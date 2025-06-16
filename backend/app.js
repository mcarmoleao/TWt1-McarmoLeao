const express = require('express');
const mongoose = require('mongoose');
const alunoRoutes = require('./routes/alunos.routes');
const cursoRoutes = require('./routes/cursos.routes');

const app = express();

app.use(express.json());

// Conexão à base de dados MongoDB Atlas
mongoose.connect('mongodb+srv://user1:12345@cluster0.d47mvin.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

// Rotas
app.use('/alunos', alunoRoutes);
app.use('/api/cursos', cursoRoutes);

module.exports = app;