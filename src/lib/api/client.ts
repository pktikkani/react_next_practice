import axios from 'axios';


export const apiClient = axios.create({
    baseURL: typeof window === 'undefined'
        ? 'http://localhost:3000/api/sap'
        : '/api/sap',
    withCredentials: true,
});

export async function login() {
    await apiClient.post('/Login', {
        CompanyDB: 'SBODEMOGB',
        UserName: 'manager',
        Password: 'manager',
    });
}