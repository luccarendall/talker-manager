const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const HTTP_OK_STATUS = 200;
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