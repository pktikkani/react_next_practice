import { SAP_BASE, sapLogin } from "@/lib/sap";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q') || '';
    const cookies = await sapLogin();
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
    const filtered = (data.value || []).filter((item: any) =>
        item.ItemName.toLowerCase().includes(query.toLowerCase())
    );
    return NextResponse.json(filtered);
}