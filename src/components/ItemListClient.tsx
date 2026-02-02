'use client'

import {useMemo, useState} from "react";

export function ItemListClient({ items }: ItemListClientProps) {
    const [searchText, setSearchText] = useState('');
    const [counters, setCounters] = useState<number>(0);
    const [showItems, setShowItems] = useState(false);
    const filteredItems: Item[] = useMemo(
        () => {
        console.log('filtering items...');
        return items.filter(function filterByName(i) {
            return i.ItemName.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [items, searchText]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold dark:text-white">Items</h1>
            </div>
            <input
                type="text"
                placeholder="Search items..."
                value={searchText}
                onChange={function handleChange(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <button
                onClick={() => setCounters(counters + 1)}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Counter: {counters}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{filteredItems.length} items found</p>

            <button
                onClick={() => setShowItems(!showItems)}
                className="mb-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showItems ? 'Hide Items' : 'Show Items'}
            </button>

            {showItems && (
                <ul className="space-y-2">
                    {filteredItems.map(function renderOrder(i) {
                        return (
                            <li key={i.ItemCode} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                                <span className="font-medium">{i.ItemCode}</span> - {i.ItemName} (Stock: {i.QuantityOnStock})
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}