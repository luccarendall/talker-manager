const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');
const { tokenGen } = require('./utils/tokenGen');
const { readFile, createTalker } = require('./utils/fileSystem');
const { validateEmail, validatePwd } = require('./utils/validateLogin');
const { 
  validateAge,
  validateViewDate,
  validateName,
  validateRate,
  validateTalk,
  validateToken } = require('./utils/validateTalker');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const PORT = '3000';

const talkerInfo = './talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

// GET TALKER
app.get('/talker', async (_req, res) => {
  const talker = await fs.readFile(talkerInfo, 'utf-8');
  const talkerJSON = JSON.parse(talker);
  res.status(HTTP_OK_STATUS).json(talkerJSON);
});

// GET TALKER:id
// npm run restore para restaurar o arquivo talker.json
app.get('/talker/:id', async (req, res) => {
const { id } = req.params;
  const talkerFile = await fs.readFile(talkerInfo, 'utf-8');
  const talkerJSON = JSON.parse(talkerFile);
  const talkerID = talkerJSON.find((talker) => talker.id === +id);
  
  if (!talkerID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
res.status(HTTP_OK_STATUS).json(talkerID);
});

// POST LOGIN
app.post('/login', validateEmail, validatePwd, (_req, res) => {
  const loginToken = tokenGen();
  res.status(HTTP_OK_STATUS).json({ token: loginToken });
});

// POST TALKER
app.post('/talker', 
// Não tava passando pq tava chamando o validateToken por ultimo e precisa chamar antes dos outros. Mesma coisa com o talk... passei uns 40 minutos nisso e tô incrédulo até agora
validateToken, validateAge, validateTalk, validateViewDate, validateName,
validateRate, 
async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkerFile = await readFile();
  const idCounter = talkerFile.length + 1;  

  const createdTalker = { name, id: idCounter, age, talk: { watchedAt, rate } };

  talkerFile.push(createdTalker);

  await createTalker(talkerFile);
  return res.status(HTTP_CREATED_STATUS).json(createdTalker);
});