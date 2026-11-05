# Projeto-Integrador

Site da Conecta Advocacia (HTML, CSS e Bootstrap).

## Formulário "Fale Conosco" salvando os contatos

A página `Agendar_Uma_Consulta.html` envia os dados do formulário (nome, empresa,
e-mail, telefone e mensagem) para uma API feita no **Google Apps Script**. Cada
contato vira uma linha numa planilha do **Google Sheets**, com data e uma coluna
`Status` (começa como "Novo") para marcar quando o cliente já foi atendido.

Arquivos:

- `api/salvar-contato.gs`: código da API (vai no Google Apps Script)
- `js/contato.js`: envia o formulário para a API e mostra a mensagem de sucesso/erro

### Como ligar a API (uma vez só, uns 5 minutos)

1. Acesse <https://sheets.new> e crie uma planilha (ex.: "Contatos do site").
2. Na planilha, vá em **Extensões > Apps Script**.
3. Apague o código que aparecer e cole todo o conteúdo de `api/salvar-contato.gs`. Salve.
4. Clique em **Implantar > Nova implantação**.
   - Em "Selecionar tipo", escolha **App da Web**.
   - **Executar como:** Eu
   - **Quem pode acessar:** Qualquer pessoa
   - Clique em **Implantar** e autorize com a sua conta Google.
5. Copie a **URL do app da Web** (termina em `/exec`).
6. Abra `js/contato.js` e troque `COLE_AQUI_A_URL_DO_APPS_SCRIPT` por essa URL.

Pronto: cada envio do formulário aparece na aba **Contatos** da planilha.

Para testar se a API está no ar, abra a URL `/exec` no navegador. Deve aparecer
`{"ok":true,"mensagem":"API do Fale Conosco funcionando."}`.

> Se você alterar o código do Apps Script depois, use **Implantar > Gerenciar
> implantações > Editar > Nova versão** para a mudança valer na mesma URL.
