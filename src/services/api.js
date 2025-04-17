import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchBooks = async (page = 1, title = '', sortField = '', sortOrder = '') => {
    const response = await api.get('books', {
        params: {
            page,
            title,
            sortField,
            sortOrder
        },
    });
    return response.data;
};
export const fetchAllAuthors = async () => {
    const response = await api.get('/authors/all');
    return response.data;
};

export const createBook = async (bookData) => {
    const response = await api.post('books', bookData);
    return response.data;
};

export const fetchBookById = async (id) => {
    try {
        const response = await api.get(`books/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching book by ID:', error);
        throw error;
    }
};

export const updateBook = async (id, bookData) => {
    const response = await api.put(`books/${id}`, bookData);
    return response.data;
};

export const deleteBook = async (id) => {
    await api.delete(`books/${id}`);
};

export const fetchAuthors = async (page = 1, nameFilter = '') => {
    try {
        const response = await api.get('authors', {
            params: {
                page: page,
                name: nameFilter,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching authors:', error);
        throw error;
    }
};
export const fetchAuthor = async (id) => {
    const response = await api.get(`authors/${id}`);
    return response.data;
};

export const deleteAuthor = async (id) => {
    await api.delete(`authors/${id}`);
};
export const createAuthor = async (authorData) => {
    const response = await api.post('authors', authorData);
    return response.data;
};
export const updateAuthor = async (id, authorData) => {
    const response = await api.put(`authors/${id}`, authorData);
    return response.data;
}