import VendorListClient from "@/components/VendorListClient";
import {SAP_BASE, sapLogin} from "@/lib/sap";


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