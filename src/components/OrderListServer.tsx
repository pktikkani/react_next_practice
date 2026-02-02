import {SAP_BASE, sapLogin} from "@/lib/sap";
import {OrderListClient} from "@/components/OrderListClient";

async function fetchOrders(cookies: string) {
    const response = await fetch(
        `${SAP_BASE}/Orders?$select=DocNum,CardName,DocTotal,DocDate,DocCurrency&$top=30`,
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

export default async function OrderListServer() {
    // console.log('ItemListServer rendering...');
    const cookies = await sapLogin();
    const orders = await fetchOrders(cookies);
    return <OrderListClient orders={orders} />;
}