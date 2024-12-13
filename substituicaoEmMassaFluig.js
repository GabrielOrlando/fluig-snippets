// Data de Criação: 13/12/2024
// Última Alteração: 13/12/2024
// Versão: 1.0
// ----------------------------

let enpoint = 'https://exemplofluig.com.br' // URL do ambiente

let dataInicio = '13/12/2024' // Data inicial da substituição no formato dd/mm/aaaa
let dataFim = '01/01/2025' // Data final da substituição no formato dd/mm/aaaa

let substitutoId = 'admin' // Matricula do substituto
let usuariosEmail = ['exemplo@exemplo.com', 'exemplo2@exemplo.com'] // Email dos usuários a serem substituidos

let usuariosId, objSubstitutos = [] // Não alterar

// Consulta matriculas de usuários e monta array
for (let i = 0; i < usuariosEmail.length; i++){
    let c1 = DatasetFactory.createConstraint('mail', usuariosEmail[i], usuariosEmail[i], ConstraintType.MUST)
    let ds = DatasetFactory.getDataset('colleague', null, [c1], null)

    usuariosId.push(ds.values[0]['colleaguePK.colleagueId'])
}

// Monta array com dados de substituição
for (let i = 0; i < usuariosId.length; i++){
    let aux = {
        "companyId": 1,
        "userId": substitutoId,
        "substituteId": usuariosId[i],
        "validationStartDate": dataInicio,
        "validationFinalDate": dataFim,
    }

    objSubstitutos.push(aux)
}

// Cria substituições usando API
$.ajax({
    url: `${endpoint}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    data: JSON.stringify(objSubstitutos),
    success: (response) => {
        console.info(response)
    }
})