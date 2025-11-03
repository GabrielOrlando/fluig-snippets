# Fluig Attachment Manager

Sistema de gerenciamento de anexos personalizado que integra com a aba de anexos do Fluig, adaptado do `fluigFormAttachment.js` original.

## 📋 Características

- ✅ Upload automático para a aba de anexos do Fluig
- ✅ Nomenclatura padronizada de arquivos
- ✅ Validação de tipos e tamanhos de arquivo
- ✅ Interface visual aprimorada
- ✅ Compatibilidade com código existente
- ✅ Visualização e download de arquivos
- ✅ Conversão automática para base64
- ✅ Gestão de estados dos botões

## 🚀 Como Usar

### 1. Incluir os arquivos no HTML

```html
<!-- Após incluir jQuery e outras dependências -->
<script src="fluigAttachmentManager.js"></script>
<!-- Opcional: arquivo de exemplo -->
<script src="exemploUsoAttachmentManager.js"></script>
```

### 2. HTML dos campos de anexo

```html
<div class="col-md-3">
    <div class="form-group">
        <label class="control-label" for="anexoNFS">Anexo NFS</label>
        <div class="custom-file-upload">
            <input type="file" id="anexoNFS" name="anexoNFS" 
                   class="file-input anexos_personalizados" 
                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                   onchange="updateFileName(this, 'anexoNFS-label')">
            <label for="anexoNFS" class="file-label" id="anexoNFS-label">
                <i class="fluigicon fluigicon-upload fluigicon-sm"></i>
                <span>Selecionar arquivo</span>
            </label>
        </div>
        <div class="anexo-actions" style="margin-top: 5px;">
            <button type="button" class="btn btn-sm btn-info" id="btnView_anexoNFS" 
                    onclick="viewAnexo('anexoNFS')" style="display: none;">
                <i class="fluigicon fluigicon-eye fluigicon-sm"></i> Visualizar
            </button>
            <button type="button" class="btn btn-sm btn-success" id="btnDownload_anexoNFS" 
                    onclick="downloadAnexo('anexoNFS')" style="display: none; margin-left: 5px;">
                <i class="fluigicon fluigicon-download fluigicon-sm"></i> Download
            </button>
            <button type="button" class="btn btn-sm btn-danger" id="btnRemove_anexoNFS" 
                    onclick="removeAnexo('anexoNFS')" style="display: none; margin-left: 5px;">
                <i class="fluigicon fluigicon-trash fluigicon-sm"></i> Remover
            </button>
        </div>
        <!-- Campos hidden para persistência -->
        <input type="hidden" id="anexoNFS_nome" name="anexoNFS_nome" value="">
        <input type="hidden" id="anexoNFS_base64" name="anexoNFS_base64" value="">
        <input type="hidden" id="anexoNFS_tipo" name="anexoNFS_tipo" value="">
    </div>
</div>
```

### 3. Inicialização Automática

O plugin se inicializa automaticamente para todos os elementos com a classe `anexos_personalizados`:

```javascript
$(document).ready(function() {
    // Inicialização automática - não precisa fazer nada!
    // Todos os inputs com classe 'anexos_personalizados' serão gerenciados
});
```

### 4. Configuração Manual (Opcional)

```javascript
$('#anexoNFS').fluigAttachmentManager({
    showActionButton: true,          // Mostrar botões de ação
    autoUpload: true,               // Upload automático para aba de anexos
    prefixName: false,              // Não adicionar prefixo ao nome
    accept: ".pdf,.jpg,.jpeg,.png", // Tipos de arquivo aceitos
    maxFileSize: 10 * 1024 * 1024,  // Tamanho máximo: 10MB
    validateExtension: true         // Validar extensão do arquivo
});
```

## ⚙️ Configurações Disponíveis

| Opção | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `showActionButton` | boolean | `true` | Exibe botões de ação |
| `autoUpload` | boolean | `true` | Upload automático para anexos do Fluig |
| `prefixName` | boolean/string | `false` | Adiciona prefixo ao nome do arquivo |
| `accept` | string | `".pdf,.jpg,.jpeg,.png,.doc,.docx"` | Tipos aceitos |
| `maxFileSize` | number | `10485760` | Tamanho máximo em bytes (10MB) |
| `validateExtension` | boolean | `true` | Validar extensão do arquivo |

## 📝 Nomenclatura Padronizada

O sistema gera nomes automaticamente baseados no tipo de anexo e dados do formulário:

- **anexoNFS**: `{EMPRESA}_NFS_{NUMERO}.ext`
- **anexoContrato**: `{EMPRESA}_CONTRATO.ext`
- **anexoTitulo**: `{EMPRESA}_TÍTULO_{NUMERO}.ext`
- **anexoComprovante**: `{EMPRESA}_COMPROVANTE_NFS_{NUMERO}.ext`

Exemplo: `HOSPITAL_SAO_PAULO_NFS_12345.pdf`

## 🔧 API do Plugin

### Métodos Públicos

```javascript
// Verificar se tem arquivo
$('#anexoNFS').fluigAttachmentManager('hasFile'); // retorna boolean

// Obter nome do arquivo
$('#anexoNFS').fluigAttachmentManager('getFileName'); // retorna string

// Obter dados do arquivo
$('#anexoNFS').fluigAttachmentManager('getFileData'); // retorna objeto

// Verificar se é válido
$('#anexoNFS').fluigAttachmentManager('isValid'); // retorna boolean

// Limpar arquivo
$('#anexoNFS').fluigAttachmentManager('clearFile');
```

### Funções Globais (Compatibilidade)

```javascript
// Manter compatibilidade com código existente
updateFileName(input, labelId);  // Funciona como antes
viewAnexo(inputId);             // Visualizar arquivo
downloadAnexo(inputId);         // Download do arquivo
removeAnexo(inputId);           // Remover arquivo
```

## 📊 Estados dos Arquivos

O sistema gerencia automaticamente os estados visuais:

- **Sem arquivo**: Label padrão, botões escondidos
- **Com arquivo**: Label verde, botões visíveis
- **Carregando**: Loading automático durante upload
- **Erro**: Toast de erro com detalhes

## 🔗 Integração com Fluig

### Upload Automático

Quando `autoUpload: true`, os arquivos são automaticamente enviados para a aba de anexos do Fluig com o nome padronizado.

### Persistência de Dados

Os dados são salvos em campos hidden:
- `{inputId}_nome`: Nome padronizado do arquivo
- `{inputId}_base64`: Conteúdo em base64
- `{inputId}_tipo`: Tipo MIME do arquivo

### Validação de Formulário

```javascript
function validateForm() {
    let isValid = true;
    
    // Verificar anexos obrigatórios
    const requiredAttachments = ['anexoNFS'];
    requiredAttachments.forEach(inputId => {
        const hasFile = $(`#${inputId}`).fluigAttachmentManager('hasFile');
        if (!hasFile) {
            isValid = false;
            FLUIGC.toast({
                title: 'Validação',
                message: `Anexo ${inputId} é obrigatório.`,
                type: 'warning'
            });
        }
    });
    
    return isValid;
}
```

## 🎨 Estilos CSS

O plugin inclui estilos automáticos:

```css
.file-label.has-file {
    background-color: #d4edda;
    border-color: #c3e6cb;
    color: #155724;
}

.anexo-actions .btn {
    margin-left: 3px;
}

.custom-file-upload {
    position: relative;
    display: inline-block;
    width: 100%;
}
```

## 🔍 Troubleshooting

### Problema: Arquivos não aparecem na aba de anexos
**Solução**: Verificar se `autoUpload: true` e se o contexto do Fluig está disponível.

### Problema: Nomes não são padronizados
**Solução**: Verificar se os campos `nomeRazaoSocialPrestServ` e `numeroNFSE` existem e têm valores.

### Problema: Validação não funciona
**Solução**: Verificar se os tipos de arquivo estão corretos no `accept` e se o tamanho não excede `maxFileSize`.

### Problema: Botões não aparecem
**Solução**: Verificar se a estrutura HTML está correta e se os IDs dos botões seguem o padrão `btnView_{inputId}`.

## 📄 Diferenças do Original

### Melhorias sobre o fluigFormAttachment.js original:

1. **Nomenclatura Inteligente**: Gera nomes baseados no contexto do formulário
2. **Upload Automático**: Envia automaticamente para anexos do Fluig
3. **Validação Aprimorada**: Validação de tipo, tamanho e conteúdo
4. **Interface Melhorada**: Estados visuais mais claros
5. **Compatibilidade**: Mantém compatibilidade com código existente
6. **Configuração Flexível**: Mais opções de configuração por campo

### Funcionalidades Mantidas:

- Sistema de upload base64
- Integração com aba de anexos
- Botões de visualização e download
- Validação de arquivos
- Interface responsiva

## 📝 Exemplo Completo

Veja o arquivo `exemploUsoAttachmentManager.js` para um exemplo completo de implementação com todas as funcionalidades.

---

**Autor**: Gabriel Orlando  
**Data**: 08/10/2025  
**Baseado em**: fluigFormAttachment.js original