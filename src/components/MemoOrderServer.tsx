import MemoOrderClient from "@/components/MemoOrderClient";
import {SAP_BASE, sapLogin} from "@/lib/sap";

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

export default async function MemoOrderServer() {
    const cookies = await sapLogin();
    const orders = await fetchOrders(cookies);

    return <MemoOrderClient orders={orders} />;
}