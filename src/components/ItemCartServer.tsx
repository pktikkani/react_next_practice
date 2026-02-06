import {SAP_BASE, sapLogin} from "@/lib/sap";
import {ItemCartClient} from "@/components/ItemCartClient";

async function fetchCartItems(cookies: string) {
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

export default async function ItemCartServer() {
    // console.log('ItemListServer rendering...');
    const cookies = await sapLogin();
    const items = await fetchCartItems(cookies);
    return <ItemCartClient items={items} />;
}