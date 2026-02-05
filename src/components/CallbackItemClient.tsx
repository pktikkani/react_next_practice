'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';

// Test 1: React.memo child — only re-renders when onClear reference changes
const ClearButton = React.memo(function ClearButton({onClear}: { onClear: () => void }) {
    console.log('ClearButton rendering...');
    return (
        <button
            onClick={onClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
            Clear Search
        </button>
    );
});

// Test 3: React.memo list item — shared callback across all items
const ItemRow = React.memo(function ItemRow({item, onItemClick}: { item: Item; onItemClick: (code: string) => void }) {
    console.log('ItemRow rendering:', item.ItemCode);
    return (
        <li
            onClick={function handleClick() {
                onItemClick(item.ItemCode);
            }}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
        >
            <span className="font-medium">{item.ItemCode}</span> — {item.ItemName} (Stock: {item.QuantityOnStock})
        </li>
    );
});

// Test 4: Custom hook returning memoized functions
function useItemSearch(items: Item[]) {
    const [searchText, setSearchText] = useState('');

    const filteredItems = useMemo(function filterItems() {
        return items.filter(function match(i) {
            return i.ItemName.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [items, searchText]);

    const clearSearch = useCallback(function clear() {
        setSearchText('');
    }, []);

    return {searchText, setSearchText, filteredItems, clearSearch};
}

export default function CallbackItemClient({items}: ItemListClientProps) {
    const {searchText, setSearchText, filteredItems, clearSearch} = useItemSearch(items);
    const [counter, setCounter] = useState(0);
    const [showItems, setShowItems] = useState(false);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);
    const [logMessages, setLogMessages] = useState<string[]>([]);

    // Test 2: useCallback as stable useEffect dependency
    const logSearchChange = useCallback(function logSearch() {
        console.log('Search changed to:', searchText);
    }, [searchText]);

    useEffect(function searchEffect() {
        logSearchChange();
    }, [logSearchChange]);

    // Test 3: Stable handler for list items
    const handleItemClick = useCallback(function handleClick(code: string) {
        console.log('Item clicked:', code);
        setSelectedItem(code);
    }, []);

    // Test 5: UNSTABLE version — new function every render (for comparison)
    function handleItemClickUnstable(code: string) {
        console.log('Item clicked (unstable):', code);
        setSelectedItem(code);
    }

    // Test 6: Callback that updates when dependency changes
    const addLog = useCallback(function addLogMessage() {
        const msg = `Log #${counter}: ${searchText || '(empty)'}`;
        setLogMessages(function appendLog(prev) {
            return [...prev, msg];
        });
    }, [counter, searchText]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useCallback Tests</h1>

            {/* Search input */}
            <input
                type="text"
                placeholder="Search items..."
                value={searchText}
                onChange={function handleChange(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredItems.length} items found</p>

            {/* Test 1: React.memo child with useCallback */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1: Stable Props (React.memo)</h2>
            <ClearButton onClear={clearSearch} />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click counter below — "ClearButton rendering..." should NOT appear in console.</p>

            {/* Counter to trigger parent re-render */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Parent Re-render Trigger</h2>
            <button
                onClick={function handleIncrement() {
                    setCounter(counter + 1);
                }}
                className="mr-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Counter: {counter}
            </button>

            {/* Test 2: Stable useEffect dependency */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 2: Stable useEffect Dependency</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Console logs "Search changed to:" only when searchText changes, not on counter clicks.</p>

            {/* Test 3 + 5: List items */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3: Stable Handler for List</h2>
            <button
                onClick={function handleToggle() {
                    setShowItems(!showItems);
                }}
                className="mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showItems ? 'Hide Items' : 'Show Items'} ({filteredItems.length})
            </button>
            {selectedItem && <p className="text-sm dark:text-white mb-2">Selected: {selectedItem}</p>}

            {showItems && (
                <ul className="space-y-2">
                    {filteredItems.map(function renderItem(i) {
                        return <ItemRow key={i.ItemCode} item={i} onItemClick={handleItemClick} />;
                    })}
                </ul>
            )}

            {/* Test 4: Custom hook */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 4: Custom Hook</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">clearSearch from useItemSearch hook is memoized via useCallback. ClearButton above uses it.</p>

            {/* Test 6: Callback with changing deps */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 6: Callback with Dependencies</h2>
            <button
                onClick={addLog}
                className="mr-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                Add Log
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">Change counter or search, then click Add Log — message reflects current values.</p>
            {logMessages.length > 0 && (
                <ul className="mt-2 space-y-1">
                    {logMessages.map(function renderLog(msg, idx) {
                        return <li key={idx} className="text-xs text-gray-500 dark:text-gray-400">{msg}</li>;
                    })}
                </ul>
            )}
        </div>
    );
}