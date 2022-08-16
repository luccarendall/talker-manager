const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');
const { tokenGen } = require('./utils/tokenGen');
const { readFile, createTalker } = require('./utils/fileSystem');
const { validateEmail, validatePwd } = require('./utils/validateLogin');

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

app.get('/talker', async (_req, res) => {
  const talker = await fs.readFile(talkerInfo, 'utf-8');
  const talkerJSON = JSON.parse(talker);
  res.status(HTTP_OK_STATUS).json(talkerJSON);
});

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

app.post('/login', validateEmail, validatePwd, (_req, res) => {
  const loginToken = tokenGen();
  res.status(HTTP_OK_STATUS).json({ token: loginToken });
});

app.post('/talker', async (req, res) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;

  const talkerFile = await readFile();
  
  const talkerCreated = { name, age, talk: { watchedAt, rate } };

  talkerFile.push(talkerCreated);

  await createTalker(talkerFile);
  return res.status(HTTP_CREATED_STATUS).json({ talkerCreated });
});