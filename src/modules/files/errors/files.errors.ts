import { ApplicationError } from '@/protocols'

export function fileNotFoundError(): ApplicationError {
    return {
        name: 'FileNotFoundError',
        message: 'File not found.',
    }
}

export function invalidFileDataError(): ApplicationError {
    return {
        name: 'InvalidFileDataError',
        message: 'Invalid file data.',
    }
}

export function fileProcessError(): ApplicationError {
    return {
        name: 'FileProcessError',
        message: 'Error processing file.',
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
