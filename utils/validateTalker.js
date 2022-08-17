// Lembrete: A requisição de teste está sendo feita pelo conteúdo do arquivo talker.json, logo o corpo da requisição(req.body) é dele.

// Validar token
const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }

  if (authorization.length < 16 || authorization.length > 16) {
 return res.status(401).json(
      { message: 'Token inválido' },
); 
}
  if (typeof authorization !== 'string') {
    return res.status(401).json(
      { message: 'Token inválido' },
);
  }
  
  next();
};

// Validar nome
const validateName = (req, res, next) => {
  const { name } = req.body;
  if (name === undefined || name === '') {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length === 3 || name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }

  next();
};

// Validar idade
const validateAge = (req, res, next) => {
  const { age } = req.body;
  if (age === undefined || age === '') {
      return res.status(400).json({ message: 'O campo "age" é obrigatório' }); 
  }
     if (age < 18 || age === 18) { 
      return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' }); 
  }

     next();
};

// Validar data
const validateViewDate = (req, res, next) => {
  // pegando o watchedAt de dentro do talk lá no talker.json
  const { talk: { watchedAt } } = req.body;
  // https://www.regextester.com/99555
  // https://stackoverflow.com/questions/15491894/regex-to-validate-date-formats-dd-mm-yyyy-dd-mm-yyyy-dd-mm-yyyy-dd-mmm-yyyy
  const regex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;

  if (!watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }

  if (!regex.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};

// Validar avaliação
const validateRate = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate === undefined) {
      return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }  
  if (talk.rate < 1 || talk.rate > 5) {
      return res.status(400).json({
          message: 'O campo "rate" deve ser um inteiro de 1 à 5',
        }); 
}

// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 if (!Number.isInteger(talk.rate)) {
  return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
    });
 }

  next();
};  

// Validar palestrante
const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (talk === undefined || talk === '') {
   return res.status(400).json({
       message: 'O campo "talk" é obrigatório',
     });
  }
  
   next();
};

module.exports = {
  validateToken,
  validateName,
  validateAge,
  validateViewDate,
  validateRate,
  validateTalk,
}; 