export function genericError(message?: string) {
    return {
        name: 'Error',
        message: message || 'An unexpected error occurred.',
    }
}
