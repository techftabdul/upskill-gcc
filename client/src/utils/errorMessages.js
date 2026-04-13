export const getFriendlyErrorMessage = (error, defaultMessage = 'Something went wrong. Please try again.') => {
    const message = error?.message || (typeof error === 'string' ? error : '');

    if (message.includes('auth/invalid-credential')) {
        return 'Incorrect email or password. Please try again.';
    }

    if (message.includes('auth/email-already-in-use')) {
        return 'An account with this email already exists.';
    }

    if (message.includes('auth/weak-password')) {
        return 'Password must be at least 6 characters.';
    }

    if (message.includes('auth/user-not-found')) {
        return 'No account found with this email.';
    }

    if (message.includes('auth/network-request-failed')) {
        return 'Network error. Please check your internet connection.';
    }

    if (message.includes('NO_CREDITS')) {
        return 'You have no credits remaining.';
    }

    return defaultMessage;
};