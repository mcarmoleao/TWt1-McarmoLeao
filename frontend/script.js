const apiUrl = 'https://twt1-mcarmoleao.onrender.com/api/alunos'; // Endpoint alunos
const cursosUrl = 'https://twt1-mcarmoleao.onrender.com/api/cursos'; // Endpoint cursos

const listaAlunos = document.getElementById('listaAlunos');
const form = document.getElementById('alunoForm');
const nomeInput = document.getElementById('nome');
const apelidoInput = document.getElementById('apelido');
const anoCurricularInput = document.getElementById('anoCurricular');
const cursoInput = document.getElementById('curso');
const mensagemDiv = document.getElementById('mensagem');

// Mostrar mensagens de feedback
function mostrarMensagem(texto, cor = 'green') {
  mensagemDiv.textContent = texto;
  mensagemDiv.style.color = cor;
  setTimeout(() => mensagemDiv.textContent = '', 3000);
}

async function carregarAlunos() {
  listaAlunos.innerHTML = '';
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Erro ao buscar alunos: ${res.status} ${res.statusText}`);
    }
    const alunos = await res.json();
    alunos.forEach(aluno => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${aluno.nome} ${aluno.apelido} - ${aluno.curso} (${aluno.anoCurricular}º ano)</span>
        <button onclick="removerAluno('${aluno._id}')">Remover</button>
        <button onclick="editarAluno('${aluno._id}')">Editar</button>
      `;
      listaAlunos.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    listaAlunos.innerHTML = '<li>Erro ao carregar alunos.</li>';
  }
}

// Carregar lista de cursos
async function carregarCursos() {
  try {
    const res = await fetch(cursosUrl);
    if (!res.ok) {
      throw new Error(`Erro na resposta: ${res.status}`);
    }
    const cursos = await res.json();
    const selectCurso = document.getElementById('curso');
    cursos.forEach(curso => {
      const option = document.createElement('option');
      option.value = curso.nome;
      option.textContent = curso.nome;
      selectCurso.appendChild(option);
    });
  } catch (err) {
    console.error('Erro ao carregar cursos:', err);
  }
}

// Submeter novo aluno
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const novoAluno = {
    nome: nomeInput.value.trim(),
    apelido: apelidoInput.value.trim(),
    anoCurricular: anoCurricularInput.value.trim(),
    curso: cursoInput.value
  };

  if (!novoAluno.nome || !novoAluno.apelido || !novoAluno.anoCurricular || !novoAluno.curso) {
    mostrarMensagem('Por favor preencha todos os campos', 'red');
    return;
  }

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoAluno),
    });

    if (res.status === 409) {
      mostrarMensagem('Aluno já existente', 'red');
    } else if (res.ok) {
      mostrarMensagem('Aluno adicionado com sucesso', 'green');
      form.reset();
      carregarAlunos();
    } else {
      mostrarMensagem('Erro ao adicionar aluno', 'red');
    }
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro na comunicação com o servidor', 'red');
  }
});

// Remover aluno
async function removerAluno(id) {
  try {
    const res = await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      throw new Error(`Erro ao remover aluno: ${res.status}`);
    }
    carregarAlunos();
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao remover aluno', 'red');
  }
}

// Função para editar aluno
async function editarAluno(id) {
  try {
    // Buscar dados atuais do aluno
    const res = await fetch(`${apiUrl}/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar aluno');
    const aluno = await res.json();

    // Pedir novos dados ao usuário (pode ser melhorado para um formulário modal)
    const novoNome = prompt('Editar nome:', aluno.nome);
    if (novoNome === null) return; // Cancelado
    const novoApelido = prompt('Editar apelido:', aluno.apelido);
    if (novoApelido === null) return;
    const novoAno = prompt('Editar ano curricular:', aluno.anoCurricular);
    if (novoAno === null) return;
    const novoCurso = prompt('Editar curso:', aluno.curso);
    if (novoCurso === null) return;

    const alunoAtualizado = {
      nome: novoNome.trim(),
      apelido: novoApelido.trim(),
      anoCurricular: novoAno.trim(),
      curso: novoCurso.trim()
    };

    // Enviar atualização para o backend
    const updateRes = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alunoAtualizado)
    });
    if (!updateRes.ok) throw new Error('Erro ao atualizar aluno');
    mostrarMensagem('Aluno atualizado com sucesso', 'green');
    carregarAlunos();
  } catch (error) {
    console.error(error);
    mostrarMensagem('Erro ao editar aluno', 'red');
  }
}

// Inicializar
carregarAlunos();
carregarCursos();