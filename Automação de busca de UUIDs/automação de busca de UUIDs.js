let solicitacoes = [
    // Colocar aqui os números das solicitações apenas separados por virgula;
    
]

let uuids = [];

solicitacoes.forEach(solicitacao => {
    let c_num_solicitacao = DatasetFactory.createConstraint('H_IPROCESS', solicitacao, solicitacao, ConstraintType.MUST);

    let dsSolicitacoes = DatasetFactory.getDataset('dsFormEstruturacaoProjetosPlanoAnual', ['H_UUID'], [c_num_solicitacao], null);
    
    uuids.push(dsSolicitacoes.values[0])
});

console.log(uuids);