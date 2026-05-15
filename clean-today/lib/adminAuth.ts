export const ADMIN_KEY = 'admin_logged_in'

export const isaAdmin = () => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(ADMIN_KEY) === 'true'
}

export const setAdmin = (value: boolean) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ADMIN_KEY, value ? 'true' : 'false')
}

export const logoutAdmin = () => {
    localStorage.removeItem(ADMIN_KEY)
}