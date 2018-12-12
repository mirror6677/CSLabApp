
//export const API_ROOT = 'http://localhost:8000'
export let API_ROOT;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    API_ROOT = 'http://localhost:8000'
} else {
    // production code
    API_ROOT = 'https://www.eg.bucknell.edu/labapp'
}

export const BUCKNELL_API = 'https://myapi.bucknell.edu/framework'
