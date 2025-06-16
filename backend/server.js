// API real a ser implementada

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;
const MONGO_URL = 'mongodb+srv://user1:12345@cluster0.d47mvin.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'academicos';

MongoClient.connect(MONGO_URL, { useNewUrlParser: true})
    .then(client => {
        db = client.db(DB_NAME);
        alunosCollection = db.collection('alunos');
        cursosCollection = db.collection('cursos');
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.get("/", async (req, res) => {
    res.send('<h1>Olá TW ECGM</1>')
})


//Rotas alunos

//listar alunos
app.get("/alunos", async (req, res) => {
    const alunos = await alunosCollection.find().toArray();
    res.json(alunos);
});

//listar aluno especifico (por id)
app.get("/alunos/:id", async (req, res) => {
    console.log(req.params.id);
    const aluno = await alunosCollection.findOne({ _id: ObjectId(req.params.id) });
    console.log(aluno);
    res.json(aluno);
});

//adicionar aluno
app.post("/alunos", async (req, res) => {
    const novoAluno = req.body;
    const result = await alunosCollection.insertOne(novoAluno);
    res.status(201).json({ id: result.insertedId });
});

//editar aluno (por id)
app.put("/alunos/:id", async (req, res) => {
    const alunoAtualizado = req.body;
    const result = await alunosCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: alunoAtualizado }
    );
    if (result.modifiedCount === 1) {
        res.status(200).send('Aluno atualizado com sucesso');
    } else {
        res.status(404).send('Aluno não encontrado');
    }
});

//apagar aluno (por id)
app.delete("/alunos/:id", async (req, res) => {
    const result = await alunosCollection.deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
        res.status(200).send('Aluno apagado com sucesso');
    } else {
        res.status(404).send('Aluno não encontrado');
    }
});


//listar cursos
app.get("/cursos", async (req, res) => {
    const cursos = await cursosCollection.find().toArray();
    res.json(cursos);
});

//listar curso especifico (por id)
/*app.get("/cursos/:id", async (req, res) => {
    const curso = await cursosCollection.findOne({ _id: ObjectId(req.params.id) });
    res.json(curso);
});*/

//listar cursos especificos (por nome)
app.get("/cursos/nome/:nome", async (req, res) => {
    const cursos = await cursosCollection.find({ nome: req.params.nome }).toArray();
    res.json(cursos);
});

//editar curso (por id)
app.put("/cursos/:id", async (req, res) => {
    const cursoAtualizado = req.body;
    const result = await cursosCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: cursoAtualizado }
    );
    if (result.modifiedCount === 1) {
        res.status(200).send('Curso atualizado com sucesso');
    } else {
        res.status(404).send('Curso não encontrado');
    }
});

//adicionar curso
app.post("/cursos", async (req, res) => {
    const novoCurso = req.body;
    const result = await cursosCollection.insertOne(novoCurso);
    res.status(201).json({ id: result.insertedId });
});

//apagar curso (por id)
app.delete("/cursos/:id", async (req, res) => {
    const result = await cursosCollection.deleteOne({ _id: ObjectId(req.params.id) });
    if (result.deletedCount === 1) {
        res.status(200).send('Curso apagado com sucesso');
    } else {
        res.status(404).send('Curso não encontrado');
    }
});
