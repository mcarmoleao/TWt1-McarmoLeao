const express = require('express');
const router = express.Router();
const alunoController = require('../controllers/aluno.controller');

router.get('/', alunoController.getAlunos);
router.post('/', alunoController.addAluno);
router.delete('/:id', alunoController.deleteAluno);
router.put('/:id', alunoController.editAluno);

module.exports = router;