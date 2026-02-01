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
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Vendors</h1>
            <input
                type="text"
                placeholder="Search vendors..."
                value={searchText}
                onChange={function handleChange(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-4 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mb-2">{filteredVendors.length} vendors found</p>
            <ul className="space-y-2">
                {filteredVendors.map(function renderVendor(v) {
                    return (
                        <li key={v.CardCode} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                            <span className="font-medium">{v.CardCode}</span> - {v.CardName}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}