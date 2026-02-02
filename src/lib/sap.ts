export const SAP_BASE = 'https://saporder.nubewired.com/b1s/v2';

export async function sapLogin(): Promise<string> {
    const response = await fetch(`${SAP_BASE}/Login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            CompanyDB: 'SBODEMOGB',
            UserName: 'manager',
            Password: 'manager',
        }),
    });

    const setCookies = response.headers.getSetCookie();
    return setCookies.join('; ');
}