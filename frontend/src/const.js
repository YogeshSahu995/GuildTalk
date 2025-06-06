const CORS_ORIGIN = `${import.meta.env.VITE_CORS_ORIGIN}`
const baseURL = `${CORS_ORIGIN}/api/v1`
const multipartFormatte = {'Content-Type': 'multipart/form-data'}
const jsonFormatte = {'Content-Type': 'application/json'}

export {CORS_ORIGIN, baseURL, multipartFormatte, jsonFormatte}