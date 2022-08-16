const Joi = require('joi');

const obj = {
  email: "teste@test.com",
  password: "123456",
}

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': `O campo email não pode ser vazio`,
    'string.email': `O campo email deve ser um email válido`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': `O campo senha não pode ser vazio`,
    'string.min': `O campo senha deve ter no mínimo {#limit} caracteres`,
  }),
}).required({
  'any.required': 'O campo {#label} é obrigatório',
});


console.log(schema.validate(obj));

return res.status(400).json({ message: err.details[0].message });
