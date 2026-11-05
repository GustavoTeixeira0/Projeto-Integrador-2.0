// Cole aqui a URL do App da Web do Google Apps Script (termina em /exec).
// Veja o passo a passo no README.md.
const URL_API = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';

const form = document.getElementById('form-contato');
const botao = form.querySelector('button[type="submit"]');
const aviso = document.getElementById('aviso-contato');

function mostrarAviso(texto, tipo) {
  aviso.textContent = texto;
  aviso.className = 'alert mt-4 text-center alert-' + tipo;
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  if (URL_API.startsWith('COLE_AQUI')) {
    mostrarAviso('A API ainda não foi configurada (js/contato.js).', 'warning');
    return;
  }

  const textoOriginal = botao.innerHTML;
  botao.disabled = true;
  botao.textContent = 'Enviando...';

  try {
    const resposta = await fetch(URL_API, {
      method: 'POST',
      body: new FormData(form)
    });
    const dados = await resposta.json();

    if (!dados.ok) throw new Error(dados.erro || 'Erro ao enviar.');

    form.reset();
    mostrarAviso('Recebemos sua mensagem! Entraremos em contato em breve.', 'success');
  } catch (erro) {
    console.error(erro);
    mostrarAviso('Não foi possível enviar agora. Tente novamente ou ligue (34) 3000-0000.', 'danger');
  } finally {
    botao.disabled = false;
    botao.innerHTML = textoOriginal;
  }
});
