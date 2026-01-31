'use client';

import { useState } from 'react';

type Vendor = {
    CardCode: string;
    CardName: string;
};

type VendorListClientProps = {
    vendors: Vendor[];
};

export default function VendorListClient({ vendors }: VendorListClientProps) {
    const [searchText, setSearchText] = useState('');

    const filteredVendors = vendors.filter(function filterByName(v) {
        return v.CardName.toLowerCase().includes(searchText.toLowerCase());
    });

    return (
        <div>
            <h1>Vendors</h1>
            <input
                type="text"
                placeholder="Search vendors..."
                value={searchText}
                onChange={function handleChange(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border-4 border-amber-500 rounded-lg mb-4 focus:outline-none"
            />
            <p>{filteredVendors.length} vendors found</p>
            <ul>
                {filteredVendors.map(function renderVendor(v) {
                    return <li key={v.CardCode}>{v.CardCode} - {v.CardName}</li>;
                })}
            </ul>
        </div>
    );
}