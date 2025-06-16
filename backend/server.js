
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const alunosRouter = require('./routes/alunos.routes'); // Caminho correto para o teu ficheiro
app.use('/alunos', alunosRouter);

const cursosRouter = require('./routes/cursos.routes');
app.use('/api/cursos', cursosRouter);


mongoose.connect('mongodb+srv://user1:12345@cluster0.d47mvin.mongodb.net/academicos')
  .then(() => console.log('Ligado ao MongoDB'))
  .catch((err) => console.error('Erro ao ligar ao MongoDB:', err));

app.listen(3001, () => {
  console.log('Servidor a correr na porta 3001');
});

app.get('/', (req, res) => {
  res.send('API de Alunos e Cursos em funcionamento.');
});

