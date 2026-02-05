'use client';

import React, {useCallback, useMemo, useState} from 'react';

// Test 3: React.memo child — only re-renders when summary object reference changes
const OrderSummary = React.memo(function OrderSummary({summary}: { summary: { count: number; total: number; average: number } }) {
    console.log('OrderSummary rendering...');
    return (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2">
            <p className="text-sm dark:text-white">{summary.count} orders | Total: {summary.total.toFixed(2)} | Avg: {summary.average.toFixed(2)}</p>
        </div>
    );
});

// Test 6: Combined — React.memo child receiving a useCallback function
const OrderRow = React.memo(function OrderRow({order, onOrderClick}: { order: Order; onOrderClick: (docNum: number) => void }) {
    console.log('OrderRow rendering:', order.DocNum);
    return (
        <li
            onClick={function handleClick() {
                onOrderClick(order.DocNum);
            }}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white cursor-pointer"
        >
            <span className="font-medium">#{order.DocNum}</span> — {order.CardName} — {order.DocTotal.toFixed(2)} {order.DocCurrency}
        </li>
    );
});

export default function MemoOrderClient({orders}: OrderListClientProps) {
    const [searchText, setSearchText] = useState('');
    const [showOrders, setShowOrders] = useState(false);
    const [counter, setCounter] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

    // Test 1: Expensive filtered list — skips recalculation when counter changes
    const filteredOrders = useMemo(function filterOrders() {
        console.log('Filtering orders...');
        return orders.filter(function matchSearch(o) {
            return o.CardName.toLowerCase().includes(searchText.toLowerCase());
        });
    }, [orders, searchText]);

    // Test 2: Derived state — computed from props, no useState needed
    const totalAmount = useMemo(function computeTotal() {
        console.log('Computing total...');
        return orders.reduce(function sum(acc, o) {
            return acc + o.DocTotal;
        }, 0);
    }, [orders]);

    const averageOrder = useMemo(function computeAverage() {
        return orders.length > 0 ? totalAmount / orders.length : 0;
    }, [totalAmount, orders.length]);

    // Test 3: Referential stability — object passed to React.memo child
    const summary = useMemo(function computeSummary() {
        console.log('Computing summary object...');
        return {
            count: orders.length,
            total: totalAmount,
            average: averageOrder,
        };
    }, [orders.length, totalAmount, averageOrder]);

    // Test 4: Dependency tracking — recalculates when searchText changes
    const currencySummary = useMemo(function computeCurrencySummary() {
        console.log('Computing currency summary...');
        return filteredOrders.reduce(function groupByCurrency(acc, o) {
            acc[o.DocCurrency] = (acc[o.DocCurrency] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [filteredOrders]);

    // Test 5: Memoizing JSX — cache rendered list when inputs unchanged
    const currencyBadges = useMemo(function renderCurrencyBadges() {
        console.log('Rendering currency badges...');
        return Object.entries(currencySummary).map(function renderBadge([currency, count]) {
            return (
                <span key={currency} className="inline-block mr-2 px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs rounded">
                    {currency}: {count}
                </span>
            );
        });
    }, [currencySummary]);

    // Test 6: useCallback for stable function reference to React.memo child
    const handleOrderClick = useCallback(function handleClick(docNum: number) {
        console.log('Order clicked:', docNum);
        setSelectedOrder(docNum);
    }, []);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useMemo Tests</h1>

            {/* Test 3: React.memo child with memoized summary */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3: Referential Stability (React.memo)</h2>
            <OrderSummary summary={summary} />

            {/* Test 1: Filtered list */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1: Filtered List</h2>
            <input
                type="text"
                placeholder="Search orders by customer..."
                value={searchText}
                onChange={function handleSearch(e) {
                    setSearchText(e.target.value);
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length} orders found</p>

            {/* Counter — proves useMemo skips recalculation */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1b: Unrelated State (Counter)</h2>
            <button
                onClick={function handleIncrement() {
                    setCounter(counter + 1);
                }}
                className="mr-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Counter: {counter}
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">Click counter — console should NOT show "Filtering orders..." or "Computing total..."</p>

            {/* Test 2: Derived state */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 2: Derived State</h2>
            <p className="text-sm dark:text-white">Total: {totalAmount.toFixed(2)} | Average: {averageOrder.toFixed(2)}</p>

            {/* Test 4: Currency summary changes with filter */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 4: Dependency Tracking</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currency breakdown updates when search changes:</p>

            {/* Test 5: Memoized JSX */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 5: Memoized JSX</h2>
            <div className="mb-2">{currencyBadges}</div>

            {/* Test 6: Combined — show/hide list with React.memo rows */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 6: Combined (useMemo + useCallback + React.memo)</h2>
            <button
                onClick={function handleToggle() {
                    setShowOrders(!showOrders);
                }}
                className="mb-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showOrders ? 'Hide Orders' : 'Show Orders'}
            </button>
            {selectedOrder && <p className="text-sm dark:text-white mb-2">Selected: #{selectedOrder}</p>}

            {showOrders && (
                <ul className="space-y-2">
                    {filteredOrders.map(function renderOrder(o) {
                        return <OrderRow key={o.DocNum} order={o} onOrderClick={handleOrderClick} />;
                    })}
                </ul>
            )}
        </div>
    );
}