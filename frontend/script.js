// JS para operações CRUD com Fetch API

const API_URL = 'http://localhost:3000/alunos'; // Ajuste conforme seu backend

const form = document.getElementById('aluno-form');
const idInput = document.getElementById('aluno-id');
const nomeInput = document.getElementById('nome');
const idadeInput = document.getElementById('idade');
const salvarBtn = document.getElementById('salvar-btn');
const cancelarBtn = document.getElementById('cancelar-btn');
const tabela = document.getElementById('alunos-table').querySelector('tbody');

let editando = false;

async function carregarAlunos() {
    tabela.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    try {
        const resp = await fetch(API_URL);
        const alunos = await resp.json();
        tabela.innerHTML = '';
        if (alunos.length === 0) {
            tabela.innerHTML = '<tr><td colspan="4">Nenhum aluno cadastrado.</td></tr>';
        } else {
            alunos.forEach(aluno => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${aluno.id}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.idade}</td>
                    <td>
                        <button class="acao editar" onclick="editarAluno(${aluno.id}, '${aluno.nome}', ${aluno.idade})">Editar</button>
                        <button class="acao apagar" onclick="apagarAluno(${aluno.id})">Apagar</button>
                    </td>
                `;
                tabela.appendChild(tr);
            });
        }
    } catch (e) {
        tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar alunos.</td></tr>';
    }
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const nome = nomeInput.value.trim();
    const idade = parseInt(idadeInput.value, 10);

    if (!nome || !idade) return;

    if (editando) {
        // Atualizar aluno
        await fetch(`${API_URL}/${idInput.value}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, idade })
        });
    } else {
        // Adicionar aluno
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, idade })
        });
    }
    form.reset();
    cancelarEdicao();
    carregarAlunos();
};

window.editarAluno = (id, nome, idade) => {
    editando = true;
    idInput.value = id;
    nomeInput.value = nome;
    idadeInput.value = idade;
    salvarBtn.textContent = 'Salvar';
    cancelarBtn.style.display = 'inline-block';
};

window.apagarAluno = async (id) => {
    if (confirm('Deseja realmente apagar este aluno?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarAlunos();
    }
};

cancelarBtn.onclick = cancelarEdicao;

function cancelarEdicao() {
    editando = false;
    idInput.value = '';
    form.reset();
    salvarBtn.textContent = 'Adicionar';
    cancelarBtn.style.display = 'none';
}

carregarAlunos();