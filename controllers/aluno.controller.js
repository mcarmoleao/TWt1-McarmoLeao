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

exports.editAluno = async (req, res) => {
  const { id } = req.params;
  const { nome, apelido, anoCurricular, curso } = req.body;
  try {
    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      id,
      { nome, apelido, anoCurricular, curso },
      { new: true, runValidators: true }
    );
    if (!alunoAtualizado) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }
    res.json(alunoAtualizado);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar aluno', error });
  }
};

exports.getAlunoById = async (req, res) => {
  const { id } = req.params;
  try {
    const aluno = await Aluno.findById(id);
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao buscar aluno', error });
  }
};