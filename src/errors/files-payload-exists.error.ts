export function fileNotFoundError() {
    return {
        name: 'fileNotFoundError',
        message: 'Arquivo não enviado',
    }
}

export function fileExtError() {
    return {
        name: 'fileExtError',
        message: 'Extensão de arquivo inválida. Apenas .txt permitido.',
    }
}

export function fileSizeError() {
    return {
        name: 'fileSizeError',
        message: 'Arquivo excede o tamanho máximo permitido (1MB).',
    }
}

export function fileValidationError() {
    return {
        name: 'fileValidationError',
        message: 'Erro ao validar arquivo.',
    }
}
