# zen.erp.connector.siscomex

## Links úteis

- Portal Único Siscomex
  - https://portalunico.siscomex.gov.br/portal/#/

- Documentação da API
  - https://docs.portalunico.siscomex.gov.br/
- Documentação da API DUIMP
  - https://docs.portalunico.siscomex.gov.br/swagger/duimp-api.html#/Modelos%20da%20Duimp/buscarDadosCapaDuimp

- Comex Responde
  - https://solicitacao.servicos.gov.br/processos

## Ambientes

- Homologação: https://val.portalunico.siscomex.gov.br
- Produção: https://portalunico.siscomex.gov.br

## Consultar DUIMP's

- Acesse https://portalunico.siscomex.gov.br/duimp/#/consultar-duimp
- Selecione a opção **Outros parâmetros**
  - CPF do responsável: `(informar)`
  - Situação: `Pré-registro`
  - Data inicial: `(informar)`
  - Clique em **Consultar**
- Anote o número da DUIMP

## Exemplos de DUIMP

- 24BR0000019582-3
  - CNPJ: 26.766.610/0002-75
  - CPF: 062.607.857-12

## Instalação

- Instale o node https://nodejs.org
- Extraia o arquivo siscomex.zip em uma pasta
- Copie o certificado digital nesta pasta
- Abra um prompt de comando nesta pasta
- Execute o comando abaixo:
  - `node .\index.js --cert <certificado> --password <senha> --duimp <duimp>`
  - certificado: nome do arquivo do certificado
  - senha: senha do certificado
  - duimp: número da duimp
- O arquivo da DUIMP será gravado na mesma pasta
