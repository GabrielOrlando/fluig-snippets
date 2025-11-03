/*
    AUTOMAÇÃO DE BUSCA DE USUÁRIOS POR EMAIL
    AUTOR: GABRIEL ORLANDO
    DATA DE CRIAÇÃO: 26/04/2023
    DATA DE ATUALIZAÇÃO: 26/04/2023
    V1.0
*/


/* 
    Como utilizar:
    Passo 1: Na variavel "usuários" informe uma string contendo todos os e-mails a serem pesquisados separados por virgula e espaço.
    Passo 2: Chame a função consulta() passando como parâmetro a variável usuários.
*/

var usuarios = "exemplo1@exemplo.com.br, exemplo2@exemplo.com.br, exemplo3@exemplo.com.br, exemplo4@exemplo.com.br, exemplo5@exemplo.com.br";


function buscaUsuarios(emails) {
    emails = emails.split(", ")

    const filtered = emails.filter((item, index) => emails.indexOf(item) === index);

    var result = [];
    for (i = 0; i < filtered.length; i++) {
        var c = DatasetFactory.createConstraint('mail', filtered[i], filtered[i], ConstraintType.MUST)
        var users = DatasetFactory.getDataset('colleague', null, [c], null)
        result.push(users.values[0])
    }
    console.log("Total de registros informados: "+ emails.length);
    console.log("Total de registros únicos: " + filtered.length);
    console.log("Total de registros encontrados: " + result.length);
    return result
}

function consulta(email){
    let r = buscaUsuarios(email);

    console.table(r);
}