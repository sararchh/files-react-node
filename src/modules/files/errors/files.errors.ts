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
        name: 'FileExtError',
        message: 'Invalid file extension. Only .txt allowed.',
    }
}

export function fileSizeError() {
    return {
        name: 'FileSizeError',
        message: 'File exceeds the maximum allowed size (1MB).',
    }
}

export function fileValidationError() {
    return {
        name: 'FileValidationError',
        message: 'Error validating file.',
    }
}
