// const uuid = "efc95548-ead3-4635-be9f-e4a153484429";
// const uuid_programa = "c5212485-68ca-4eef-9c43-b34dafa397ba";
const obejtivo_estrategico = "Simplificar, desonerar e agilizar o dia a dia do empreendedor"
const UF = "SP";

function buscaSolicitacao(uuid) {

    // CONSULTAR DATASET DO PROCESSO DE CRIAÇÃO/CÓPIA PASSANDO COMO PARÂMETRO O UUID PARA CONSULTAR NAS TABELAS PAI X FILHO
    let data_solicitacoes_criar = [];





    // let c_programa = DatasetFactory.createConstraint('H_UUID_PROGRAMA', uuid_programa, uuid_programa, ConstraintType.MUST);
    let c_objetivo_estrategico = DatasetFactory.createConstraint('H_DESCRITOR', obejtivo_estrategico, obejtivo_estrategico, ConstraintType.MUST);
    let c_uf = DatasetFactory.createConstraint('H_ESTADO', UF, UF, ConstraintType.MUST);

    let dsCPP = DatasetFactory.getDataset('ds_pt_CPP_nivel_programas', null, [c_objetivo_estrategico, c_uf], null);
    console.log(dsCPP);

    let dsMPP = DatasetFactory.getDataset('ds_MPP_Nivel_Programas', null, [c_objetivo_estrategico, c_uf], null);
    console.log(dsMPP);

    // ESSA BUSCA VAI RETORNAR AS SOLICITAÇÕES DE CRIAÇÃO E MIGRAÇÃO RESPECTIVAMENTE. A PARTIR DISSO, BUSCAR OS DOCUMENTS IDS UTILIZANDO O NUMERO DA SOLICITAÇÃO COMO PARAMETRO;
    // DEPOIS BUSCAR A TABELA PAI X FILHO;
    // PROCURAR NA TABELA O UUID CORRESPONDENTE AO PROJETO QUE ESTAMOS PROCURANDO;
    // RETORNAR O NÚMERO DA SOLICITAÇÃO ONDE FOI ENCONTRADO O PROJETO;
}