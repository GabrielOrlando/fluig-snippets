function createDataset(fields, constraints, sortFields) {

    var ds = DatasetBuilder.newDataset();

    var c = constraints[0].initialValue;
    
    encerraProcesso(c);

    return ds;

}

function encerraProcesso(numeroProcesso) {
    var id = new com.fluig.sdk.api.workflow.CancelInstanceVO();
    id.setProcessInstanceId(numeroProcesso);
    id.setCancelText("Cancelado");
    var resultado = fluigAPI.getWorkflowService().cancelInstance(id);
    var mensagemResultado = resultado.getMessage();
    return mensagemResultado;
}