const axios = require('axios');

async function testLogin() {
    const apiClient = axios.create({
        baseURL: 'https://saporder.nubewired.com/b1s/v2',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    try {
        console.log('Attempting login...');
        const response = await apiClient.post('/Login', {
            CompanyDB: 'SBODEMOGB',
            UserName: 'manager',
            Password: 'manager',
        });
        console.log('Login successful');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Login failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testLogin();
