import VendorListClient from "@/components/VendorListClient";

const SAP_BASE = 'https://saporder.nubewired.com/b1s/v2';

async function sapLogin(): Promise<string> {
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

async function fetchVendors(cookies: string) {
    const response = await fetch(
        `${SAP_BASE}/BusinessPartners?$filter=CardType eq 'S'&$top=10&$select=CardCode,CardName`,
        {
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies,
            },
        },
    );

    const data = await response.json();
    return data.value;
}

export default async function VendorListServer() {
    const cookies = await sapLogin();
    const vendors = await fetchVendors(cookies);

    return <VendorListClient vendors={vendors} />;
}