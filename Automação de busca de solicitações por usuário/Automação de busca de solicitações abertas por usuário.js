/***************************************************
*                                                  *
*    BUSCAR SOLICITAÇÕES ABERTAS POR USUÁRIO       *
*    AUTOR: GABRIEL ORLANDO                        *
*    DATA DE CRIAÇÃO:     30/05/2023               *
*    DATA DE ATUALIZAÇÃO: 30/05/2023               *
*    VERSÃO: 1.2                                   *
*                                                  *
***************************************************/

// COMO UTILIZAR ESTE CÓDIGO:

// 1. Colar as três funções no console.

// 2. Criar uma variável que receba um array contendo os emails a serem utilizados na busca, separados por virgula e um espaço. Exemplo: [email@teste.com, email2@teste2.com]

// 3. Executar a função consultaSolicitacoesPorUsuario(), passando como parâmetro o array de emails.





// Busca usuários cadastrados
function buscaUsuarios(emails) {
    emails = emails.split(", ")

    const filtered = emails.filter((item, index) => emails.indexOf(item) === index);

    var result = [];
    for (i = 0; i < filtered.length; i++) {
        var c = DatasetFactory.createConstraint('mail', filtered[i], filtered[i], ConstraintType.MUST)
        var users = DatasetFactory.getDataset('colleague', ['active', 'mail', 'login'], [c], null)
        if(users.values[0]){
            result.push(users.values[0])
        }
        
    }
    console.log("Total de e-mails informados: " + emails.length);
    console.log("Total de e-mails únicos: " + filtered.length);
    console.log("Total de e-mails encontrados: " + result.length);
    return result;
}

// Busca solicitação de cada usuário
function buscaSolicitacoes(login) {

    let c_status = DatasetFactory.createConstraint('status', '0', '0', ConstraintType.MUST);
    let c_email = DatasetFactory.createConstraint('requesterId', login, login, ConstraintType.MUST);


    let dsSolicitacoes = DatasetFactory.getDataset('workflowProcess', ['workflowProcessPK.processInstanceId'], [c_status, c_email], null);

    return dsSolicitacoes;
}

function consultaSolicitacoesPorUsuario(email) {
    let dataUsuarios = buscaUsuarios(email);
    let arrayMatriculas = [];
    let dataSolicitacoes = [];

    for (n = 0; n < dataUsuarios.length; n++) {
        console.log(n + ' / ' + dataUsuarios[n].login)

        let data = buscaSolicitacoes(dataUsuarios[n].login);

        dataSolicitacoes.push([dataUsuarios[n].mail, data.values]);

    }

    return dataSolicitacoes;
}