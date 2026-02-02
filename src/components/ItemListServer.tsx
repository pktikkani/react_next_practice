import {SAP_BASE, sapLogin} from "@/lib/sap";
import {ItemListClient} from "@/components/ItemListClient";

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

export default async function ItemListServer() {
    // console.log('ItemListServer rendering...');
    const cookies = await sapLogin();
    const items = await fetchItems(cookies);
    return <ItemListClient items={items} />;
}