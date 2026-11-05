// Cole aqui a URL do App da Web do Google Apps Script (termina em /exec).
// Veja o passo a passo no README.md.
const URL_API = 'https://script.google.com/macros/s/AKfycbzrYxVKmZaT2QFEzQnU2I1n_9wL3nS4lvMOPJ6UG3hkG9rcDCZoDBK1v3iNiMMnMyMpsQ/exec';

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
    mostrarAviso('Não foi possível enviar agora. Tente novamente ou ligue (31) 99563-4814.', 'danger');
  } finally {
    botao.disabled = false;
    botao.innerHTML = textoOriginal;
  }
});


document.getElementById('telefone-cliente').addEventListener('input', function (e) {
    // Remove tudo o que não for número
    let valor = e.target.value.replace(/\D/g, "");
    
    // Limita o armazenamento a 11 dígitos numéricos
    if (valor.length > 11) {
        valor = valor.slice(0, 11);
    }

    // Aplica a máscara dinamicamente
    if (valor.length > 0) {
        valor = "(" + valor;
        if (valor.length > 3) {
            valor = valor.slice(0, 3) + ") " + valor.slice(3);
        }
        if (valor.length > 10) {
            valor = valor.slice(0, 10) + "-" + valor.slice(10);
        }
    }
    
    // Atualiza apenas o valor deste input específico
    e.target.value = valor;
});
