import { NextRequest, NextResponse } from 'next/server';

const SAP_BASE_URL = 'https://saporder.nubewired.com/b1s/v2';
let sapSessionCookies = '';


async function handler(req: NextRequest) {
    const path = req.nextUrl.pathname.replace('/api/sap', '');
    const url = `${SAP_BASE_URL}${path}${req.nextUrl.search}`;


    const response = await fetch(url, {
        method: req.method,
        headers: {
            'Content-Type': 'application/json',
            Cookie: sapSessionCookies,
        },
        body: req.method !== 'GET' ? await req.text() : undefined,
    });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        data = await response.json();
    } else {
        data = { error: await response.text() };
    }


    const res = NextResponse.json(data, { status: response.status });

    // Forward SAP cookies to the browser
    const setCookies = response.headers.getSetCookie();
    if (setCookies.length > 0 && response.status === 200) {
        sapSessionCookies = setCookies
            .map(c => c.split(';')[0])
            .join('; ');
    }
    for (const cookie of setCookies) {
        res.headers.append('set-cookie', cookie);
    }

    return res;
}

export const GET = handler;
export const POST = handler;