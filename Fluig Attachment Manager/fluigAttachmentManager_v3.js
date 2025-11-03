/**
 * Fluig Attachment Manager - Versão com Upload Automático Real
 * 
 * Esta versão usa exatamente a mesma abordagem do xp_attach.js
 * mas adaptada para campos personalizados com upload automático.
 */

;(function ($) {
    "use strict";

    const pluginName = "fluigAttachmentManager";
    
    // Configurações padrão
    const defaults = {
        autoUpload: true,
        accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
        maxFileSize: 10 * 1024 * 1024, // 10MB
        validateExtension: true
    };

    // Variável global para controlar o upload atual
    let currentAttachmentInput = null;

    /**
     * Gera nome padronizado para o arquivo
     */
    const generateStandardizedName = (inputId, originalName) => {
        const fileExtension = originalName.split('.').pop();
        const empresaRaw = $('#nomeRazaoSocialPrestServ').val() || 'EMPRESA';
        const empresa = empresaRaw.replace(/\s+/g, '_');
        const numeroNFS = $('#numeroNFSE').val() || '0000';
        
        const namePatterns = {
            'anexoNFS': `${empresa}_NFS_${numeroNFS}.${fileExtension}`,
            'anexoContrato': `${empresa}_CONTRATO.${fileExtension}`,
            'anexoTitulo': `${empresa}_TÍTULO_${numeroNFS}.${fileExtension}`,
            'anexoComprovante': `${empresa}_COMPROVANTE_NFS_${numeroNFS}.${fileExtension}`
        };
        
        return namePatterns[inputId] || `${empresa}_ANEXO_${inputId}.${fileExtension}`;
    };

    /**
     * Verifica se arquivo já existe na tabela de anexos
     */
    const attachmentExists = (filename) => {
        if (!parent.ECM || !parent.ECM.attachmentTable) {
            return false;
        }
        
        let exists = false;
        $.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
            if (attachment.description === filename || attachment.name === filename) {
                exists = true;
                return false; // break
            }
        });
        return exists;
    };

    /**
     * Encontra índice do anexo na tabela
     */
    const findAttachmentIndex = (filename) => {
        if (!parent.ECM || !parent.ECM.attachmentTable) {
            return -1;
        }
        
        let index = -1;
        $.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
            if (attachment.description === filename || attachment.name === filename) {
                index = i;
                return false; // break
            }
        });
        return index;
    };

    /**
     * Remove anexo existente
     */
    const removeExistingAttachment = (filename) => {
        const index = findAttachmentIndex(filename);
        if (index !== -1 && parent.WKFViewAttachment) {
            parent.WKFViewAttachment.removeAttach([index]);
            return true;
        }
        return false;
    };

    /**
     * Inicializa o sistema de upload do Fluig
     */
    const initFluigUploadSystem = () => {
        // Interceptar mudanças no input file do Fluig
        if (parent.$("#ecm-navigation-inputFile-clone").length > 0) {
            parent.$("#ecm-navigation-inputFile-clone").off('change.customAttachment');
            parent.$("#ecm-navigation-inputFile-clone").on('change.customAttachment', function (e) {
                if (currentAttachmentInput && e.target.files[0]) {
                    const fileName = e.target.files[0].name;
                    const standardizedName = generateStandardizedName(currentAttachmentInput.inputId, fileName);
                    
                    console.log("Upload detectado:", fileName, "->", standardizedName);
                    
                    // Aguardar o upload ser processado pelo Fluig
                    setTimeout(() => {
                        // Verificar se foi adicionado e renomear se necessário
                        const attachments = parent.ECM.attachmentTable.getData();
                        const newAttachment = attachments.find(att => att.name === fileName);
                        
                        if (newAttachment) {
                            // Atualizar a descrição para o nome padronizado
                            newAttachment.description = standardizedName;
                            
                            // Atualizar a interface do campo
                            currentAttachmentInput.onUploadSuccess(standardizedName);
                            
                            console.log("Upload concluído:", standardizedName);
                        } else {
                            console.warn("Upload não encontrado na tabela de anexos");
                            currentAttachmentInput.onUploadError("Falha no upload");
                        }
                        
                        currentAttachmentInput = null;
                    }, 1500);
                }
            });
        }
    };

    /**
     * Valida o arquivo selecionado
     */
    const validateFile = (file, settings) => {
        const result = { valid: true, message: '' };
        
        // Validar tamanho
        if (file.size > settings.maxFileSize) {
            result.valid = false;
            result.message = `Arquivo muito grande. Tamanho máximo: ${(settings.maxFileSize / 1024 / 1024).toFixed(1)}MB`;
            return result;
        }
        
        // Validar extensão
        if (settings.validateExtension && settings.accept !== "*") {
            const allowedExtensions = settings.accept.split(',').map(ext => ext.trim().toLowerCase());
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedExtensions.includes(fileExtension)) {
                result.valid = false;
                result.message = `Tipo de arquivo não permitido. Extensões aceitas: ${settings.accept}`;
                return result;
            }
        }
        
        return result;
    };

    /**
     * Abre o seletor de arquivos do Fluig
     */
    const openFluigFileSelector = (inputInstance) => {
        if (!parent.$("#ecm-navigation-inputFile-clone").length) {
            console.error("Sistema de upload do Fluig não encontrado");
            return false;
        }

        currentAttachmentInput = inputInstance;
        
        // Configurar o input do Fluig
        const fluigInput = parent.$("#ecm-navigation-inputFile-clone");
        fluigInput.attr({
            "data-on-camera": "true",
            "data-file-name-camera": inputInstance.inputId,
            "accept": inputInstance.settings.accept
        });

        // Disparar o clique no input do Fluig
        fluigInput.click();
        
        return true;
    };

    /**
     * Classe principal do gerenciador
     */
    class AttachmentManager {
        constructor(element, options) {
            this.element = $(element);
            this.settings = $.extend({}, defaults, options);
            this.inputId = this.element.attr('id');
            
            if (!this.inputId) {
                this.inputId = 'attachment_' + Date.now();
                this.element.attr('id', this.inputId);
            }
            
            this.init();
        }

        init() {
            // Esconder o input original e substituir por botão personalizado
            this.element.hide();
            
            // Encontrar elementos relacionados
            this.label = $(`#${this.inputId}-label`);
            this.btnView = $(`#btnView_${this.inputId}`);
            this.btnDownload = $(`#btnDownload_${this.inputId}`);
            this.btnRemove = $(`#btnRemove_${this.inputId}`);
            
            // Campos hidden para persistência
            this.hiddenName = $(`#${this.inputId}_nome`);
            this.hiddenBase64 = $(`#${this.inputId}_base64`);
            this.hiddenType = $(`#${this.inputId}_tipo`);
            
            // Configurar eventos
            this.setupEvents();
            
            // Carregar arquivo existente se houver
            this.loadExistingFile();
            
            // Inicializar sistema do Fluig se ainda não foi
            if (!window.fluigUploadSystemInitialized) {
                initFluigUploadSystem();
                window.fluigUploadSystemInitialized = true;
            }
        }

        setupEvents() {
            // Evento do label (substitui o input file)
            if (this.label.length) {
                this.label.on('click', () => {
                    if (!this.hasFile()) {
                        this.openFileSelector();
                    }
                });
                this.label.css('cursor', 'pointer');
            }
            
            // Botões de ação
            if (this.btnView.length) {
                this.btnView.on('click', () => this.viewFile());
            }
            
            if (this.btnDownload.length) {
                this.btnDownload.on('click', () => this.downloadFile());
            }
            
            if (this.btnRemove.length) {
                this.btnRemove.on('click', () => this.removeFile());
            }
        }

        openFileSelector() {
            if (!this.settings.autoUpload) {
                // Usar input normal se upload automático estiver desabilitado
                this.element.show().click().hide();
                return;
            }

            // Verificar se contexto do Fluig está disponível
            if (!parent.ECM || !parent.ECM.attachmentTable) {
                this.showToast('warning', 'Atenção', 'Sistema de anexos não disponível');
                return;
            }

            // Abrir seletor do Fluig
            this.showLoading(true);
            if (!openFluigFileSelector(this)) {
                this.showLoading(false);
                this.showToast('danger', 'Erro', 'Não foi possível abrir o seletor de arquivos');
            }
        }

        onUploadSuccess(filename) {
            this.showLoading(false);
            
            // Atualizar campos hidden
            this.hiddenName.val(filename);
            
            // Atualizar interface
            this.updateInterface(filename, true);
            
            this.showToast('success', 'Upload realizado', `Arquivo "${filename}" enviado com sucesso para a aba de anexos.`);
        }

        onUploadError(message) {
            this.showLoading(false);
            this.showToast('danger', 'Erro no upload', message);
        }

        viewFile() {
            const filename = this.hiddenName.val();
            
            if (!filename) {
                this.showToast('warning', 'Atenção', 'Nenhum arquivo carregado para visualização.');
                return;
            }

            // Usar sistema do Fluig para visualizar
            $.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
                if (attachment.description === filename || attachment.name === filename) {
                    if (attachment.documentId) {
                        parent.WKFViewAttachment.openAttachmentView('admin', attachment.documentId, 1000);
                    } else {
                        parent.WKFViewAttachment.downloadAttach([i]);
                    }
                    return false; // break
                }
            });
        }

        downloadFile() {
            const filename = this.hiddenName.val();
            
            if (!filename) {
                this.showToast('warning', 'Atenção', 'Nenhum arquivo carregado para download.');
                return;
            }

            // Usar sistema do Fluig para download
            $.each(parent.ECM.attachmentTable.getData(), function (i, attachment) {
                if (attachment.description === filename || attachment.name === filename) {
                    parent.WKFViewAttachment.downloadAttach([i]);
                    return false; // break
                }
            });
        }

        removeFile() {
            const filename = this.hiddenName.val();
            
            if (!filename) {
                this.showToast('warning', 'Atenção', 'Nenhum arquivo para remover.');
                return;
            }

            if (typeof FLUIGC !== 'undefined' && FLUIGC.message) {
                FLUIGC.message.confirm({
                    title: 'Confirmar remoção',
                    message: `Deseja realmente remover o anexo "${filename}"?`,
                    labelYes: 'Sim',
                    labelNo: 'Não'
                }, (result) => {
                    if (result) {
                        this.performRemoval(filename);
                    }
                });
            } else {
                if (confirm(`Deseja realmente remover o anexo "${filename}"?`)) {
                    this.performRemoval(filename);
                }
            }
        }

        performRemoval(filename) {
            // Remover da aba de anexos do Fluig
            if (removeExistingAttachment(filename)) {
                this.clearFile();
                this.showToast('success', 'Removido', 'Anexo removido com sucesso.');
            } else {
                this.showToast('warning', 'Atenção', 'Anexo não encontrado na aba de anexos.');
                this.clearFile(); // Limpar localmente mesmo assim
            }
        }

        clearFile() {
            // Limpar campos hidden
            this.hiddenName.val('');
            this.hiddenBase64.val('');
            this.hiddenType.val('');
            
            // Atualizar interface
            this.updateInterface('Selecionar arquivo', false);
        }

        updateInterface(text, hasFile) {
            // Atualizar label
            if (this.label.length) {
                const span = this.label.find('span');
                if (span.length) {
                    span.text(text);
                }
                
                if (hasFile) {
                    this.label.addClass('has-file');
                } else {
                    this.label.removeClass('has-file');
                }
            }
            
            // Mostrar/esconder botões
            const display = hasFile ? 'inline-block' : 'none';
            this.btnView.css('display', display);
            this.btnDownload.css('display', display);
            this.btnRemove.css('display', display);
        }

        loadExistingFile() {
            const filename = this.hiddenName.val();
            
            if (filename) {
                // Verificar se ainda existe na aba de anexos
                if (attachmentExists(filename)) {
                    this.updateInterface(filename, true);
                } else {
                    // Limpar se não existe mais
                    this.clearFile();
                }
            }
        }

        showLoading(show) {
            if (typeof FLUIGC !== 'undefined' && FLUIGC.loading) {
                if (show) {
                    if (!this.loadingInstance) {
                        this.loadingInstance = FLUIGC.loading(window, {
                            title: "Enviando",
                            textMessage: "Enviando arquivo para anexos..."
                        });
                    }
                    this.loadingInstance.show();
                } else {
                    if (this.loadingInstance) {
                        this.loadingInstance.hide();
                    }
                }
            }
        }

        showToast(type, title, message) {
            if (typeof FLUIGC !== 'undefined' && FLUIGC.toast) {
                FLUIGC.toast({
                    title: title,
                    message: message,
                    type: type
                });
            } else {
                console.log(`${type.toUpperCase()}: ${title} - ${message}`);
            }
        }

        // Métodos públicos
        hasFile() {
            return this.hiddenName.val().length > 0;
        }

        getFileName() {
            return this.hiddenName.val();
        }

        isValid() {
            return true;
        }
    }

    /**
     * Plugin jQuery
     */
    $.fn[pluginName] = function (options) {
        const args = Array.prototype.slice.call(arguments, 1);
        
        return this.each(function () {
            let instance = $.data(this, pluginName);
            
            if (!instance) {
                instance = new AttachmentManager(this, options);
                $.data(this, pluginName, instance);
            } else if (typeof options === 'string' && typeof instance[options] === 'function') {
                return instance[options].apply(instance, args);
            }
        });
    };

    // Inicialização automática quando o documento estiver pronto
    $(document).ready(function() {
        // Aguardar um pouco para garantir que o Fluig carregou
        setTimeout(() => {
            // Inicializar automaticamente todos os inputs com classe 'anexos_personalizados'
            $('.anexos_personalizados').fluigAttachmentManager();
        }, 1000);
        
        // Adicionar estilos CSS
        if (!$('#fluigAttachmentManagerStyles').length) {
            $('head').append(`
                <style id="fluigAttachmentManagerStyles">
                    .file-label.has-file {
                        background-color: #d4edda;
                        border-color: #c3e6cb;
                        color: #155724;
                    }
                    
                    .file-label {
                        cursor: pointer !important;
                    }
                    
                    .anexo-actions .btn {
                        margin-left: 3px;
                    }
                    
                    .anexo-actions .btn:first-child {
                        margin-left: 0;
                    }
                    
                    .custom-file-upload {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    
                    .file-input {
                        display: none !important;
                    }
                    
                    .file-label {
                        display: block;
                        padding: 8px 12px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background-color: #f8f9fa;
                        transition: all 0.2s ease;
                    }
                    
                    .file-label:hover {
                        background-color: #e9ecef;
                        border-color: #adb5bd;
                    }
                </style>
            `);
        }
    });

})(jQuery);

/**
 * Funções globais para compatibilidade
 */
window.updateFileName = function(input, labelId) {
    // Esta função é interceptada pelo plugin
    console.log('updateFileName intercepted');
};

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