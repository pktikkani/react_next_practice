'use client';

import {useEffect, useRef, useState} from 'react';

export default function RefItemClient({items}: ItemListClientProps) {
    const [searchText, setSearchText] = useState('');
    const [showItems, setShowItems] = useState(false);
    const [displayCount, setDisplayCount] = useState(0);
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const [renderDisplay, setRenderDisplay] = useState(0);


    // Test 1: DOM ref — autofocus input on mount
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Test 2: Mutable value — count keystrokes without re-rendering
    const searchCountRef = useRef(0);

    // Test 3: Timer ID storage — interval with cleanup
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [ticking, setTicking] = useState(false);
    const [tickCount, setTickCount] = useState(0);

    // Test 4: Previous value tracking
    const prevSearchRef = useRef<string>('');

    // Test 5: DOM ref — scroll to bottom
    const listEndRef = useRef<HTMLDivElement>(null);

    // Test 6: DOM ref — measure element
    const listRef = useRef<HTMLUListElement>(null);

    // Test 7: AbortController for fetch cancellation
    const abortControllerRef = useRef<AbortController | null>(null);
    const [apiResults, setApiResults] = useState<Item[]>([]);

    // Test 8: Callback ref — scroll highlighted item into view
    const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

    // Test 9: Ref does NOT re-render (prove difference vs useState)
    const renderCountRef = useRef(0);
    const silentCountRef = useRef(0);

    // Track render count
    renderCountRef.current++;

    const filteredItems = items.filter(function filterByName(i) {
        return i.ItemName.toLowerCase().includes(searchText.toLowerCase());
    });

    // Test 1: Auto-focus on mount
    useEffect(function focusEffect() {
        searchInputRef.current?.focus();
    }, []);

    // Test 4: Track previous search value
    useEffect(function trackPrevSearch() {
        prevSearchRef.current = searchText;
    }, [searchText]);

    // Test 7: Fetch with AbortController on search change
    useEffect(function fetchWithAbort() {
        if (!searchText) {
            setApiResults([]);
            return;
        }

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        fetch(`/api/items/search?q=${searchText}`, {
            signal: abortControllerRef.current.signal,
        })
            .then(function handleResponse(res) { return res.json(); })
            .then(function handleData(data) { setApiResults(data); })
            .catch(function handleError(err) {
                if (err.name !== 'AbortError') console.error(err);
            });
    }, [searchText]);

    // Test 3: Start/stop interval
    function handleStartTimer() {
        if (intervalRef.current) return;
        setTicking(true);
        intervalRef.current = setInterval(function tick() {
            setTickCount(function increment(c) { return c + 1; });
        }, 1000);
    }

    function handleStopTimer() {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setTicking(false);
    }

    function handleResetTimer() {
        handleStopTimer();
        setTickCount(0);
    }

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useRef Tests</h1>

            {/* Test 1: DOM ref — focus input */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1: DOM Ref (Auto-Focus)</h2>
            <input
                type="text"
                placeholder="This auto-focused on mount..."
                value={searchText}
                ref={searchInputRef}
                onChange={function handleChange(e) {
                    searchCountRef.current++;
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />

            {/* Test 2: Mutable counter — no re-render */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 2: Mutable Counter (No Re-render)</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Keystrokes (ref, hidden): {searchCountRef.current} — only updates in UI when something else re-renders
            </p>
            <button
                onClick={function handleShowCount() {
                    setDisplayCount(searchCountRef.current);
                }}
                className="mr-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Show Count
            </button>
            <p className="text-sm dark:text-white">Display count (state): {displayCount}</p>

            {/* Test 3: Timer ID storage */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3: Timer ID Storage</h2>
            <p className="text-sm dark:text-white mb-1">Ticks: {tickCount} {ticking ? '(running)' : '(stopped)'}</p>
            <button
                onClick={handleStartTimer}
                className="mr-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
                Start
            </button>
            <button
                onClick={handleStopTimer}
                className="mr-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                Stop
            </button>
            <button
                onClick={handleResetTimer}
                className="mr-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
                Reset
            </button>

            {/* Test 4: Previous value */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 4: Previous Value</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Previous: "{prevSearchRef.current}" | Current: "{searchText}"
            </p>

            {/* Test 5 + 6: Scroll + Measure — need list visible */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 5/6: Scroll + Measure</h2>
            <button
                onClick={function handleToggle() {
                    setShowItems(!showItems);
                }}
                className="mr-1 mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showItems ? 'Hide Items' : 'Show Items'} ({filteredItems.length})
            </button>
            <button
                onClick={function handleScrollBottom() {
                    listEndRef.current?.scrollIntoView({behavior: 'smooth'});
                }}
                className="mr-1 mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Scroll to Bottom
            </button>
            <button
                onClick={function handleMeasure() {
                    const rect = listRef.current?.getBoundingClientRect();
                    if (rect) {
                        setDimensions({width: Math.round(rect.width), height: Math.round(rect.height)});
                    }
                }}
                className="mr-1 mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Measure List
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">{dimensions.width} x {dimensions.height}</p>

            {showItems && (
                <ul className="space-y-2" ref={listRef}>
                    {filteredItems.map(function renderItem(i) {
                        return (
                            <li
                                key={i.ItemCode}
                                ref={function callbackRef(node) {
                                    if (node && i.ItemCode === highlightedItem) {
                                        node.scrollIntoView({behavior: 'smooth', block: 'center'});
                                    }
                                }}
                                className={`p-3 rounded-lg dark:text-white cursor-pointer ${
                                    i.ItemCode === highlightedItem
                                        ? 'bg-yellow-200 dark:bg-yellow-700'
                                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="font-medium">{i.ItemCode}</span> - {i.ItemName} (Stock: {i.QuantityOnStock})
                            </li>
                        );
                    })}
                </ul>
            )}
            <div ref={listEndRef} />

            {/* Test 7: AbortController */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 7: AbortController</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Type fast in search — previous fetches abort. API results: {apiResults.length}
            </p>

            {/* Test 8: Callback ref — random scroll */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 8: Callback Ref (Random Scroll)</h2>
            <button
                onClick={function handleRandomScroll() {
                    if (filteredItems.length > 0) {
                        const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
                        setHighlightedItem(randomItem.ItemCode);
                    }
                }}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
                Random Scroll
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Highlighted: {highlightedItem || 'none'} (show items first)
            </p>

            {/* Test 9: Ref does NOT re-render */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 9: Ref vs State Re-render</h2>
            <p className="text-sm dark:text-white">Component rendered {renderDisplay} times</p>
            <p className="text-sm dark:text-white">Silent ref count: {silentCountRef.current}</p>
            <button
                onClick={function handleSilentIncrement() {
                    silentCountRef.current++;
                    console.log('silentCountRef is now:', silentCountRef.current, '— but UI won\'t update');
                }}
                className="mr-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
                Increment Ref (no re-render)
            </button>
            <button
                onClick={function handleForceRender() {
                    setRenderDisplay(renderCountRef.current);
                }}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
                Force Re-render (see ref update)
            </button>
        </div>
    );
}