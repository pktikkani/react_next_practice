import CallbackItemClient from "@/components/CallbackItemClient";
import {SAP_BASE, sapLogin} from "@/lib/sap";

async function fetchItems(cookies: string) {
    const response = await fetch(
        `${SAP_BASE}/Items?$select=ItemCode,ItemName,QuantityOnStock,ItemType&$top=50`,
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

export default async function CallbackItemServer() {
    const cookies = await sapLogin();
    const items = await fetchItems(cookies);

    return <CallbackItemClient items={items} />;
}