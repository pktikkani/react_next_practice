'use client';

import {useState} from 'react';

// Test 8: Child component that resets via key
function VendorNote() {
    const [note, setNote] = useState('');
    return (
        <input
            type="text"
            placeholder="Type a note for this vendor..."
            value={note}
            onChange={function handleNoteChange(e) {
                setNote(e.target.value);
            }}
            className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
        />
    );
}

export default function StateVendorClient({vendors}: VendorListClientProps) {
    // Test 1: String state — controlled input
    const [searchText, setSearchText] = useState('');

    // Test 2: Boolean toggle
    const [showVendors, setShowVendors] = useState(false);

    // Test 3: Number counter
    const [count, setCount] = useState(0);

    // Test 5: Object state with spread
    const [form, setForm] = useState({CardCode: '', CardName: ''});

    // Test 6: Array state — favorites
    const [favorites, setFavorites] = useState<Vendor[]>([]);

    // Test 7: Lazy initializer
    const [lazyValue] = useState(function computeInitial() {
        console.log('Lazy initializer running...');
        return vendors.length;
    });

    // Test 8: Reset with key
    const [selectedVendorIndex, setSelectedVendorIndex] = useState(0);

    // Test 1: Filtered list from string state
    const filteredVendors = vendors.filter(function filterByName(v) {
        return v.CardName.toLowerCase().includes(searchText.toLowerCase());
    });

    // Test 4: Updater function — prove batching difference
    function handleTripleIncrement() {
        // These three all use stale `count`, so result is count + 1
        setCount(count + 1);
        setCount(count + 1);
        setCount(count + 1);
        console.log('After 3x setCount(count + 1), count is still:', count);
    }

    function handleTripleIncrementCorrect() {
        // These three use updater function, so result is count + 3
        setCount(function increment(c) { return c + 1; });
        setCount(function increment(c) { return c + 1; });
        setCount(function increment(c) { return c + 1; });
        console.log('After 3x updater, count is still:', count);
    }

    // Test 5: Object update handlers
    function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({...form, CardCode: e.target.value});
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({...form, CardName: e.target.value});
    }

    // Test 6: Add/remove favorites
    function handleToggleFavorite(vendor: Vendor) {
        const exists = favorites.some(function check(f) {
            return f.CardCode === vendor.CardCode;
        });
        if (exists) {
            setFavorites(favorites.filter(function remove(f) {
                return f.CardCode !== vendor.CardCode;
            }));
        } else {
            setFavorites([...favorites, vendor]);
        }
    }

    // Test 9: State as snapshot
    function handleSnapshotTest() {
        setCount(99);
        console.log('Right after setCount(99), count is:', count);
    }

    // Test 10: Object.is bailout
    function handleBailoutTest() {
        console.log('Setting count to same value...');
        setCount(count);
    }

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useState Tests</h1>

            {/* Test 1: String state */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1: String State</h2>
            <input
                type="text"
                placeholder="Search vendors..."
                value={searchText}
                onChange={function handleSearch(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredVendors.length} vendors found</p>

            {/* Test 2: Boolean toggle */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 2: Boolean Toggle</h2>
            <button
                onClick={function handleToggle() {
                    setShowVendors(!showVendors);
                }}
                className="mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showVendors ? 'Hide Vendors' : 'Show Vendors'}
            </button>

            {showVendors && (
                <ul className="space-y-2 mb-4">
                    {filteredVendors.map(function renderVendor(v) {
                        return (
                            <li key={v.CardCode} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg dark:text-white flex justify-between items-center">
                                <span><span className="font-medium">{v.CardCode}</span> - {v.CardName}</span>
                                {/* Test 6: Favorite toggle per vendor */}
                                <button
                                    onClick={function handleFav() {
                                        handleToggleFavorite(v);
                                    }}
                                    className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    {favorites.some(function check(f) { return f.CardCode === v.CardCode; }) ? '★ Unfav' : '☆ Fav'}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Test 3 + 4: Number counter + Updater function */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3/4: Counter + Updater</h2>
            <p className="text-sm dark:text-white mb-2">Count: {count}</p>
            <button
                onClick={function handleIncrement() {
                    setCount(count + 1);
                }}
                className="mr-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                +1
            </button>
            <button
                onClick={handleTripleIncrement}
                className="mr-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                +3 (broken)
            </button>
            <button
                onClick={handleTripleIncrementCorrect}
                className="mr-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                +3 (correct)
            </button>
            <button
                onClick={function handleReset() {
                    setCount(0);
                }}
                className="mr-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
                Reset
            </button>

            {/* Test 5: Object state */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 5: Object State</h2>
            <div className="flex gap-2 mb-2">
                <input
                    type="text"
                    placeholder="CardCode"
                    value={form.CardCode}
                    onChange={handleCodeChange}
                    className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
                <input
                    type="text"
                    placeholder="CardName"
                    value={form.CardName}
                    onChange={handleNameChange}
                    className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
                />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Form: {form.CardCode} — {form.CardName}</p>

            {/* Test 6: Array state */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 6: Favorites ({favorites.length})</h2>
            {favorites.length > 0 && (
                <ul className="space-y-1 mb-2">
                    {favorites.map(function renderFav(f) {
                        return (
                            <li key={f.CardCode} className="text-sm dark:text-white">
                                ★ {f.CardCode} - {f.CardName}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Test 7: Lazy initializer */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 7: Lazy Initializer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Initial vendor count (computed once): {lazyValue}
            </p>

            {/* Test 8: Reset with key */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 8: Reset with Key</h2>
            <p className="text-sm dark:text-white mb-1">
                Selected: {filteredVendors[selectedVendorIndex]?.CardName || 'none'}
            </p>
            <button
                onClick={function handleNext() {
                    setSelectedVendorIndex((selectedVendorIndex + 1) % filteredVendors.length);
                }}
                className="mr-1 mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Next Vendor
            </button>
            <VendorNote key={selectedVendorIndex} />

            {/* Test 9: State as snapshot */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 9: Snapshot</h2>
            <button
                onClick={handleSnapshotTest}
                className="mr-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                Set to 99 (check console)
            </button>

            {/* Test 10: Object.is bailout */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 10: Bailout</h2>
            <button
                onClick={handleBailoutTest}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
                Set same value (check React DevTools)
            </button>
        </div>
    );
}