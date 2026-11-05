/**
 * API do formulário "Fale Conosco" — Conecta Advocacia
 *
 * Recebe os dados enviados pela página Agendar_Uma_Consulta.html
 * e salva cada contato como uma nova linha na planilha.
 *
 * Como instalar (passo a passo no README.md):
 *   1. Crie uma planilha no Google Sheets.
 *   2. Menu Extensões > Apps Script, apague o que estiver lá e cole este arquivo.
 *   3. Implantar > Nova implantação > Tipo "App da Web"
 *        Executar como: Eu
 *        Quem pode acessar: Qualquer pessoa
 *   4. Copie a URL gerada (termina em /exec) e cole em js/contato.js.
 */

const NOME_ABA = 'Contatos';
const COLUNAS = ['Data', 'Nome', 'Empresa', 'Email', 'Telefone', 'Mensagem', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const p = (e && e.parameter) || {};

    // Campo escondido "site" anti-robô: pessoas não preenchem, robôs sim.
    if (p.site) {
      return resposta({ ok: true });
    }

    const nome = limpar(p.nome);
    const email = limpar(p.email);
    const telefone = limpar(p.telefone);
    const mensagem = limpar(p.mensagem);

    if (!nome || !email || !telefone || !mensagem) {
      return resposta({ ok: false, erro: 'Preencha todos os campos obrigatórios.' });
    }

    const aba = pegarAba();
    aba.appendRow([
      new Date(),
      nome,
      limpar(p.empresa),
      email,
      telefone,
      mensagem,
      'Novo'
    ]);

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

// Permite abrir a URL no navegador para testar se a API está no ar.
function doGet() {
  return resposta({ ok: true, mensagem: 'API do Fale Conosco funcionando.' });
}

function pegarAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);
  if (!aba) {
    aba = planilha.insertSheet(NOME_ABA);
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }
  return aba;
}

// Corta textos muito longos e evita que o Sheets execute fórmulas enviadas no formulário.
function limpar(valor) {
  let texto = String(valor || '').trim().slice(0, 2000);
  if (/^[=+\-@]/.test(texto)) texto = "'" + texto;
  return texto;
}

function resposta(dados) {
  return ContentService
    .createTextOutput(JSON.stringify(dados))
    .setMimeType(ContentService.MimeType.JSON);
}
