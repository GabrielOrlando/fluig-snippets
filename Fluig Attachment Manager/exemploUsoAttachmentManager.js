/**
 * Exemplo de uso do fluigAttachmentManager.js
 * 
 * Este arquivo demonstra como utilizar o novo gerenciador de anexos
 * que integra com a aba de anexos do Fluig.
 */

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
// O plugin se inicializa automaticamente para todos os elementos com classe 'anexos_personalizados'
// Não é necessário fazer nada adicional se você usar a classe padrão.

$(document).ready(function() {
    
    // ===== INICIALIZAÇÃO MANUAL (Opcional) =====
    // Se quiser inicializar manualmente com configurações específicas:
    
    /*
    $('#anexoNFS').fluigAttachmentManager({
        showActionButton: true,          // Mostrar botões de ação
        autoUpload: true,               // Upload automático para aba de anexos
        prefixName: false,              // Não adicionar prefixo ao nome
        accept: ".pdf,.jpg,.jpeg,.png", // Tipos de arquivo aceitos
        maxFileSize: 10 * 1024 * 1024,  // Tamanho máximo: 10MB
        validateExtension: true         // Validar extensão do arquivo
    });
    */
    
    // ===== CONFIGURAÇÃO PERSONALIZADA PARA CADA CAMPO =====
    
    // Anexo NFS - apenas PDFs
    $('#anexoNFS').fluigAttachmentManager({
        accept: ".pdf",
        maxFileSize: 5 * 1024 * 1024, // 5MB
        autoUpload: true
    });
    
    // Anexo Contrato - PDFs e DOCs
    $('#anexoContrato').fluigAttachmentManager({
        accept: ".pdf,.doc,.docx",
        maxFileSize: 10 * 1024 * 1024, // 10MB
        autoUpload: true
    });
    
    // Anexo Título - imagens e PDFs
    $('#anexoTitulo').fluigAttachmentManager({
        accept: ".pdf,.jpg,.jpeg,.png",
        maxFileSize: 8 * 1024 * 1024, // 8MB
        autoUpload: true
    });
    
    // Anexo Comprovante - todos os tipos permitidos
    $('#anexoComprovante').fluigAttachmentManager({
        accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
        maxFileSize: 15 * 1024 * 1024, // 15MB
        autoUpload: true
    });
    
    // ===== EVENTOS PERSONALIZADOS =====
    
    // Escutar quando um arquivo é carregado com sucesso
    $('.anexos_personalizados').on('fileLoaded', function(e, data) {
        console.log('Arquivo carregado:', data.filename);
        
        // Fazer algo quando arquivo for carregado
        // Por exemplo, validar campos relacionados
        validateFormSection();
    });
    
    // Escutar quando um arquivo é removido
    $('.anexos_personalizados').on('fileRemoved', function(e, data) {
        console.log('Arquivo removido:', data.filename);
        
        // Fazer algo quando arquivo for removido
        checkRequiredAttachments();
    });
    
    // ===== MÉTODOS ÚTEIS =====
    
    // Verificar se um campo tem arquivo
    function hasFile(inputId) {
        const instance = $('#' + inputId).data('fluigAttachmentManager');
        return instance ? instance.hasFile() : false;
    }
    
    // Obter nome do arquivo
    function getFileName(inputId) {
        const instance = $('#' + inputId).data('fluigAttachmentManager');
        return instance ? instance.getFileName() : '';
    }
    
    // Obter dados completos do arquivo
    function getFileData(inputId) {
        const instance = $('#' + inputId).data('fluigAttachmentManager');
        return instance ? instance.getFileData() : null;
    }
    
    // Limpar um arquivo específico
    function clearFile(inputId) {
        const instance = $('#' + inputId).data('fluigAttachmentManager');
        if (instance) {
            instance.clearFile();
        }
    }
    
    // Validar se todos os arquivos obrigatórios foram anexados
    function validateRequiredAttachments() {
        const requiredFields = ['anexoNFS']; // Adicione os campos obrigatórios
        let allValid = true;
        
        requiredFields.forEach(fieldId => {
            if (!hasFile(fieldId)) {
                allValid = false;
                console.log(`Campo obrigatório sem arquivo: ${fieldId}`);
            }
        });
        
        return allValid;
    }
    
    // ===== INTEGRAÇÃO COM VALIDAÇÃO DO FORMULÁRIO =====
    
    // Se você usa o sistema de validação do Fluig, pode integrar assim:
    window.validateForm = function() {
        let isValid = true;
        
        // Validar anexos obrigatórios
        if (!validateRequiredAttachments()) {
            isValid = false;
            FLUIGC.toast({
                title: 'Validação',
                message: 'Anexe todos os arquivos obrigatórios.',
                type: 'warning'
            });
        }
        
        // Outras validações do formulário...
        
        return isValid;
    };
    
    // ===== REGENERAR NOMES QUANDO DADOS MUDAREM =====
    
    // Quando empresa ou número da NFS mudarem, regenerar nomes dos arquivos
    $('#nomeRazaoSocialPrestServ, #numeroNFSE').on('change', function() {
        setTimeout(regenerateAllFileNames, 100);
    });
    
    function regenerateAllFileNames() {
        const fileInputs = ['anexoNFS', 'anexoContrato', 'anexoTitulo', 'anexoComprovante'];
        
        fileInputs.forEach(inputId => {
            const $input = $('#' + inputId);
            const instance = $input.data('fluigAttachmentManager');
            
            if (instance && instance.hasFile()) {
                // Forçar regeneração do nome
                const fileData = instance.getFileData();
                if (fileData.base64) {
                    // Re-processar o arquivo com novo nome
                    const file = instance.element[0].files[0];
                    if (file) {
                        instance.handleFileSelect({ target: { files: [file] } });
                    }
                }
            }
        });
    }
    
    // ===== CARREGAR ANEXOS SALVOS (Ao reabrir formulário) =====
    
    function loadSavedAttachments() {
        const inputIds = ['anexoNFS', 'anexoContrato', 'anexoTitulo', 'anexoComprovante'];
        
        inputIds.forEach(inputId => {
            const instance = $('#' + inputId).data('fluigAttachmentManager');
            if (instance) {
                instance.loadExistingFile();
            }
        });
    }
    
    // Carregar na inicialização
    setTimeout(loadSavedAttachments, 500);
    
});

// ===== FUNÇÕES GLOBAIS PARA COMPATIBILIDADE =====

// Manter compatibilidade com código existente
window.viewAnexo = function(inputId) {
    const instance = $('#' + inputId).data('fluigAttachmentManager');
    if (instance) {
        instance.viewFile();
    }
};

window.downloadAnexo = function(inputId) {
    const instance = $('#' + inputId).data('fluigAttachmentManager');
    if (instance) {
        instance.downloadFile();
    }
};

window.removeAnexo = function(inputId) {
    const instance = $('#' + inputId).data('fluigAttachmentManager');
    if (instance) {
        instance.removeFile();
    }
};

// ===== CONFIGURAÇÕES AVANÇADAS =====

// Configurar upload em lote
window.uploadAllToFluig = function() {
    const fileInputs = ['anexoNFS', 'anexoContrato', 'anexoTitulo', 'anexoComprovante'];
    let promises = [];
    
    fileInputs.forEach(inputId => {
        const instance = $('#' + inputId).data('fluigAttachmentManager');
        if (instance && instance.hasFile()) {
            const fileData = instance.getFileData();
            if (fileData.base64) {
                promises.push(
                    instance.uploadToFluig(fileData.name, fileData.base64, fileData.type)
                );
            }
        }
    });
    
    return Promise.all(promises);
};

// Validação customizada
window.customFileValidation = function(file, inputId) {
    // Implementar validações específicas por campo
    switch (inputId) {
        case 'anexoNFS':
            if (file.size > 5 * 1024 * 1024) {
                return { valid: false, message: 'NFS deve ter no máximo 5MB' };
            }
            break;
        case 'anexoContrato':
            if (!file.name.toLowerCase().includes('contrato')) {
                return { valid: false, message: 'Nome do arquivo deve conter "contrato"' };
            }
            break;
    }
    
    return { valid: true };
};