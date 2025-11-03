function cancela(){
    console.log('inicio');

    var v = '0';
    var dsForm = "workflowProcess";
    var processId = "new_credito_rural";

    var fields   = null;
    
    var constraints = new Array();
    constraints.push(DatasetFactory.createConstraint("processId", processId, processId, ConstraintType.MUST));
    constraints.push(DatasetFactory.createConstraint("status", v, v, ConstraintType.MUST));
        
    var sortingFields = null;

    var retorno = DatasetFactory.getDataset(dsForm, fields, constraints, null);

    console.log(retorno)

    for (i = 0; i < retorno.values.length; i++){

         var valor = retorno.values[i]['workflowProcessPK.processInstanceId']

    console.log(valor)

         var constraints = new Array();
         constraints.push(DatasetFactory.createConstraint("processId", valor, valor, ConstraintType.MUST));

         var retorno2 = DatasetFactory.getDataset("dsCancelamentos", null, constraints, null);
    }
}