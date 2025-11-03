/***************************************************
*                                                  *
*    BUSCAR SOLICITAÇÕES ABERTAS POR USUÁRIO       *
*    AUTOR: GABRIEL ORLANDO                        *
*    DATA DE CRIAÇÃO: 30/05/2023                   *
*    VERSÃO: 1.2                                   *
*                                                  *
***************************************************/

// COMO UTILIZAR ESTE CÓDIGO:

// 1. Colar as três funções no console.

// 2. Criar uma variável que receba um array contendo os emails a serem utilizados na busca, separados por virgula e um espaço. Exemplo: [email@teste.com, email2@teste2.com]

// 3. Executar a função consultaSolicitacoesPorUsuario(), passando como parâmetro o array de emails.






function buscaSolicitacoes(uuid) {
    let dsSolicitacoes = DatasetFactory.getDataset('workflowProcess', null, null, null);

    let solicitacoesFiltradasMes = [];

    for (let i = 0; i < dsSolicitacoes.values.length; i++) {
        let dataSolicitacao = dsSolicitacoes.values[i]['startDateProcess']

        if (dataSolicitacao > '1693537200000' && dataSolicitacao < '1696129199000') {
            for(let n = 0; n < uuid.length; n++){
                if( dsSolicitacoes.values[i]['uUID'] == uuid[n]){
                    solicitacoesFiltradasMes.push(dsSolicitacoes.values[i]['workflowProcessPK.processInstanceId'])
                }
            }
        }
    }

    return solicitacoesFiltradasMes;
}

console.log( buscaSolicitacoes(uuids) )