const mongoose = require('mongoose');

const cursoSchema = new mongoose.Schema({
  nome: { type: String, required: true }
});

module.exports = mongoose.model('Curso', cursoSchema);