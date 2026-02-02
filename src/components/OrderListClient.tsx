'use client'

import {useMemo, useState} from "react";

export function OrderListClient({orders}: OrderListClientProps ) {
    const [showOrders, setShowOrders] = useState(false);
    const totalAmount = useMemo(() => {
        return orders.reduce((sum, order) => sum + order.DocTotal, 0);
    }, [orders]);

    const averageOrder = useMemo(() => {
        return orders.length > 0 ? totalAmount / orders.length : 0;
    }, [totalAmount, orders.length]);

    const currencySummary = useMemo(() => {
        return orders.reduce((acc, order) => {
            acc[order.DocCurrency] = (acc[order.DocCurrency] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [orders]);

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">Orders</h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                    <p className="text-lg font-bold dark:text-white">{totalAmount.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average Order</p>
                    <p className="text-lg font-bold dark:text-white">{averageOrder.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">By Currency</p>
                    {Object.entries(currencySummary).map(([currency, count]) => (
                        <p key={currency} className="text-sm dark:text-white">{currency}: {count}</p>
                    ))}
                </div>
            </div>

            <button
                onClick={() => setShowOrders(!showOrders)}
                className="mb-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                {showOrders ? 'Hide Orders' : 'Show Orders'}
            </button>

            {showOrders && (
                <ul className="space-y-2">
                    {orders.map(function renderOrder(o) {
                        return (
                            <li key={o.DocNum} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">
                                <span className="font-medium">#{o.DocNum}</span> - {o.CardName} — {o.DocTotal.toFixed(2)} {o.DocCurrency} — {o.DocDate}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}