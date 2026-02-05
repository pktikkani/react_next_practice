'use client'

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useItemFilter} from "@/hooks/useItemFilter";

const ItemSummary = React.memo(function ItemSummary({ summary } : { summary: Summary }) {
    console.log('ItemSummary rendering...');
    return <p>{summary.count} items</p>;
});

const ItemActions = React.memo(function ItemActions({ onClearSearch } : { onClearSearch: () => void}) {
    console.log('ItemActions rendering...');
    return (
        <button
            onClick={onClearSearch}
            className="m-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
            Clear Search
        </button>
    );
});

const ItemRow = React.memo(function ItemRow({item, onItemClick} : {item: Item, onItemClick: (itemCode: string) => void}) {
    console.log('ItemRow rendering:', item.ItemCode)
    return (
        <li
            onClick={() => onItemClick(item.ItemCode)}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
        >
            <span className="font-medium">{item.ItemCode}</span> - {item.ItemName} (Stock: {item.QuantityOnStock})
        </li>
    );
})



export function ItemListClient({ items }: ItemListClientProps) {
    const { searchText, setSearchText, filteredItems, clearSearch } = useItemFilter(items);
    const [counters, setCounters] = useState<number>(0);
    const [showItems, setShowItems] = useState(false);
    const logsearchText = useCallback(() => console.log('searchText: ', searchText), [searchText])
    const handleItemClick = useCallback((itemCode: string) => {
        console.log('Item clicked: ', itemCode)
    },[])

    useEffect(() => {
        logsearchText();
    }, [logsearchText]);


    const summary = useMemo(() => {
        return {
            count: items.length,
            totalStock: items.reduce((sum, i) => sum + i.QuantityOnStock, 0)
        };
    }, [items]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold dark:text-white">Items</h1>
                <ItemSummary summary={summary} />
                <ItemActions onClearSearch={clearSearch} />
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
                    {filteredItems.map((i) => (
                        <ItemRow key={i.ItemCode} item={i} onItemClick={handleItemClick} />
                    ))}
                </ul>
            )}
        </div>
    );
}