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
