'use client';

import { useEffect, useState } from 'react';
import { login } from '@/lib/api/client';
import { getVendors } from '@/lib/api/vendor';
import type { Vendor } from '@/lib/api/types';

export default function VendorList() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        login()
            .then(() => getVendors())
            .then((data) => setVendors(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Vendors</h1>
            <ul>
                {vendors.map((v) => (
                    <li key={v.CardCode}>{v.CardCode} - {v.CardName}</li>
                ))}
            </ul>
        </div>
    );
}