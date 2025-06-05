const apiUrl = 'http://localhost:3001/alunos';
const cursosUrl = 'http://localhost:3001/api/cursos';

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

// Carregar lista de alunos
async function carregarAlunos() {
  listaAlunos.innerHTML = '';
  const res = await fetch(apiUrl);
  const alunos = await res.json();
  alunos.forEach(aluno => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${aluno.nome} ${aluno.apelido} - ${aluno.curso} (${aluno.anoCurricular}º ano)</span>
      <button onclick="removerAluno('${aluno._id}')">Remover</button>
    `;
    listaAlunos.appendChild(li);
  });
}

// Carregar lista de cursos
async function carregarCursos() {
  try {
    const res = await fetch('http://localhost:3001/api/cursos');

    if (!res.ok) {
      throw new Error(`Erro na resposta: ${res.status}`);
    }

    const cursos = await res.json();

    // Exemplo de como preencher o <select id="curso">
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

  // Verificar campos vazios
  if (!novoAluno.nome || !novoAluno.apelido || !novoAluno.anoCurricular || !novoAluno.curso) {
    mostrarMensagem('Por favor preencha todos os campos', 'red');
    return;
  }

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
});

// Remover aluno
async function removerAluno(id) {
  await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
  carregarAlunos();
}

// Inicializar
carregarAlunos();
carregarCursos();
