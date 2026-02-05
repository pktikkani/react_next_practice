'use client'

import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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

const ItemRow = React.memo(function ItemRow({item, onItemClick, highlightedItem} : {item: Item, onItemClick: (itemCode: string) => void, highlightedItem: string | null}) {
    console.log('ItemRow rendering:', item.ItemCode)
    return (
        <li
            onClick={() => onItemClick(item.ItemCode)}
            ref={(node) => {
                if (node && item.ItemCode === highlightedItem) {
                    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
        >
            <span className="font-medium">{item.ItemCode}</span> - {item.ItemName} (Stock: {item.QuantityOnStock})
        </li>
    );
})

// const ItemRow = React.memo(function ItemRow({item, onItemClick} : {item: Item, onItemClick: (itemCode: string) => void}) {
//     console.log('ItemRow rendering:', item.ItemCode)
//     return (
//         <li
//             onClick={() => onItemClick(item.ItemCode)}
//             className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
//         >
//             <span className="font-medium">{item.ItemCode}</span> - {item.ItemName} (Stock: {item.QuantityOnStock})
//         </li>
//     );
// })



export function ItemListClient({ items }: ItemListClientProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listEndRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [now, setNow] = useState<number | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const { searchText, setSearchText, filteredItems, clearSearch } = useItemFilter(items);
    const [counters, setCounters] = useState<number>(0);
    const [showItems, setShowItems] = useState(false);
    const logsearchText = useCallback(() => console.log('searchText: ', searchText), [searchText])
    const handleItemClick = useCallback((itemCode: string) => {
        console.log('Item clicked: ', itemCode)
    },[])
    const prevSearchRef = useRef<string>('');
    const abortControllerRef = useRef<AbortController | null>(null);
    const [apiResults, setApiResults] = useState<Item[]>([]);
    const displayItems = searchText ? apiResults : items;
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

    useEffect(() => {
        if (!searchText) {
            setApiResults([]);
            return;
        }

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        fetch(`/api/items/search?q=${searchText}`, {
            signal: abortControllerRef.current.signal,
        })
            .then(res => res.json())
            .then(data => setApiResults(data))
            .catch(err => {
                if (err.name !== 'AbortError') console.error(err);
            });
    }, [searchText]);

    useEffect(() => {
        logsearchText();
    }, [logsearchText]);

    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    useEffect(() => {
        prevSearchRef.current = searchText;
    }, [searchText]);

    const summary = useMemo(() => {
        return {
            count: items.length,
            totalStock: items.reduce((sum, i) => sum + i.QuantityOnStock, 0)
        };
    }, [items]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <button onClick={() => {
                const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
                setHighlightedItem(randomItem.ItemCode);
            }}
                    className="ml-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-800"
            >
                Random Scroll
            </button>
            <p className="text-sm text-gray-500">
                {startTime && now ? ((now - startTime) / 1000).toFixed(3) : '0.000'} seconds
            </p>
            <button
                onClick={() => {
                    setStartTime(Date.now())
                    setNow(Date.now())
                    clearInterval(intervalRef.current!)
                    intervalRef.current = setInterval(() => {
                        setNow(Date.now());
                    }, 10);
                }}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Start
            </button>
            <button
                onClick={() => {
                    clearInterval(intervalRef.current!)
                }}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Stop
            </button>
            <button
                onClick={() => {
                    clearInterval(intervalRef.current!)
                    setStartTime(null)
                    setNow(null)
                }}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Reset
            </button>
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
                ref={searchInputRef}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500">Previous: {prevSearchRef.current} | Current: {searchText}</p>


            <button
                onClick={() => setCounters(counters + 1)}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Counter: {counters}
            </button>
            <button
                onClick={() => listEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Go to bottom
            </button>
            <button
                onClick={() =>{
                    const rect = listRef.current?.getBoundingClientRect();
                    if (rect) {
                        setDimensions({ width: rect.width, height: rect.height });
                    }
                }}
                className="ml-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Measure List
            </button>
            <p className="text-sm text-gray-500">{dimensions.width} x {dimensions.height}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{filteredItems.length} items found</p>
            {/*<p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{displayItems.length} items found</p>*/}

            <button
                onClick={() => setShowItems(!showItems)}
                className="mb-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showItems ? 'Hide Items' : 'Show Items'}
            </button>

            {showItems && (
                <ul className="space-y-2" ref={listRef}>
                    {filteredItems.map((i) => (
                        <ItemRow key={i.ItemCode} item={i} onItemClick={handleItemClick} highlightedItem={highlightedItem} />
                        // <ItemRow key={i.ItemCode} item={i} onItemClick={handleItemClick} />
                    ))}
                </ul>
            )}

            {/*{showItems && (*/}
            {/*    <ul className="space-y-2" ref={listRef}>*/}
            {/*        {displayItems.map((i) => (*/}
            {/*            <ItemRow key={i.ItemCode} item={i} onItemClick={handleItemClick} />*/}
            {/*        ))}*/}
            {/*    </ul>*/}
            {/*)}*/}
            <div ref={listEndRef} />
        </div>
    );
}