const Aluno = require('../models/aluno.model');

exports.getAlunos = async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
};

exports.addAluno = async (req, res) => {
  const { nome, apelido, anoCurricular, curso } = req.body;

  // Verifica duplicados, se quiseres
  const existe = await Aluno.findOne({ nome, apelido });
  if (existe) return res.status(409).json({ message: 'Aluno já existe' });

  const novoAluno = new Aluno({ nome, apelido, anoCurricular, curso });
  await novoAluno.save();
  res.status(201).json(novoAluno);
};

exports.deleteAluno = async (req, res) => {
  const { id } = req.params;
  await Aluno.findByIdAndDelete(id);
  res.status(204).end();
};