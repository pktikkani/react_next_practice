'use client';

import React, {useReducer} from 'react';

// Test 6: Lazy initializer — runs once, receives initialArg
function createInitialState(orderCount: number): OrderState {
    console.log('Lazy initializer running with:', orderCount);
    return {
        showOrders: false,
        searchText: '',
        selectedOrder: null,
        counter: 0,
        lastAction: `Initialized with ${orderCount} orders`,
    };
}

// The reducer — all state logic in one place
function orderReducer(state: OrderState, action: OrderAction): OrderState {
    switch (action.type) {
        // Test 1: Basic dispatch
        case 'TOGGLE_ORDERS':
            return {...state, showOrders: !state.showOrders, lastAction: 'Toggled orders'};

        // Test 3: Action with payload
        case 'SET_SEARCH':
            return {...state, searchText: action.payload, lastAction: `Searched: "${action.payload}"`};

        // Test 3: Another payload action
        case 'SELECT_ORDER':
            return {...state, selectedOrder: action.payload, lastAction: `Selected order #${action.payload}`};

        // Test 5: State depends on previous state
        case 'INCREMENT':
            return {...state, counter: state.counter + 1, lastAction: `Counter: ${state.counter + 1}`};

        // Test 2: Reset action
        case 'RESET':
            return {...createInitialState(0), lastAction: 'Reset all state'};

        // Test 4: Unknown action — return state unchanged
        default:
            return state;
    }
}

// Test 9: React.memo child receiving dispatch (dispatch is stable)
const OrderActions = React.memo(function OrderActions({dispatch}: { dispatch: React.Dispatch<OrderAction> }) {
    console.log('OrderActions rendering...');
    return (
        <div className="flex gap-2 mb-2">
            <button
                onClick={function handleToggle() {
                    dispatch({type: 'TOGGLE_ORDERS'});
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Toggle Orders
            </button>
            <button
                onClick={function handleReset() {
                    dispatch({type: 'RESET'});
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
                Reset All
            </button>
        </div>
    );
});

export default function ReducerOrderClient({orders}: OrderListClientProps) {
    // Test 6: Lazy initialization — third argument
    const [state, dispatch] = useReducer(orderReducer, orders.length, createInitialState);

    // Filtered orders derived from reducer state
    const filteredOrders = orders.filter(function filterBySearch(o) {
        return o.CardName.toLowerCase().includes(state.searchText.toLowerCase());
    });

    return (
        <div className="max-w-2xl mx-auto p-6 dark:bg-gray-900">
            <h1 className="text-2xl font-bold dark:text-white mb-4">useReducer Tests</h1>

            {/* Status bar — shows last action from reducer */}
            <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg mb-4">
                <p className="text-sm dark:text-white">Last action: <span className="font-medium">{state.lastAction}</span></p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Counter: {state.counter} | Search: "{state.searchText}" | Selected: {state.selectedOrder ?? 'none'} | Showing: {state.showOrders ? 'yes' : 'no'}
                </p>
            </div>

            {/* Test 9: dispatch passed to React.memo child */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 9: Dispatch Stability (React.memo)</h2>
            <OrderActions dispatch={dispatch} />
            <p className="text-sm text-gray-500 dark:text-gray-400">"OrderActions rendering..." should NOT appear when you type or click counter.</p>

            {/* Test 3: Search with payload */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 3: Action with Payload</h2>
            <input
                type="text"
                placeholder="Search orders..."
                value={state.searchText}
                onChange={function handleSearch(e) {
                    dispatch({type: 'SET_SEARCH', payload: e.target.value});
                }}
                className="w-1/2 p-3 border border-orange-600 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-orange-600 dark:bg-gray-800 dark:text-white dark:border-orange-500"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredOrders.length} orders found</p>

            {/* Test 5: State depends on previous state */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 5: Previous State Dependency</h2>
            <button
                onClick={function handleIncrement() {
                    dispatch({type: 'INCREMENT'});
                }}
                className="mr-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
                Counter: {state.counter}
            </button>

            {/* Test 6: Lazy initializer */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 6: Lazy Initializer</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Check console — "Lazy initializer running..." appears once on mount, never again on re-renders.</p>

            {/* Test 1: Basic toggle + Test 2: Multiple action types */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 1/2: Orders List</h2>

            {state.showOrders && (
                <ul className="space-y-2">
                    {filteredOrders.map(function renderOrder(o) {
                        return (
                            <li
                                key={o.DocNum}
                                onClick={function handleSelect() {
                                    dispatch({type: 'SELECT_ORDER', payload: o.DocNum});
                                }}
                                className={`p-3 rounded-lg cursor-pointer dark:text-white ${
                                    o.DocNum === state.selectedOrder
                                        ? 'bg-orange-100 dark:bg-orange-800'
                                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="font-medium">#{o.DocNum}</span> — {o.CardName} — {o.DocTotal.toFixed(2)} {o.DocCurrency}
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Test 7: Immutability proof */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 7: Immutability</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                The reducer always returns <code>{'{...state, ...changes}'}</code>. If you remove the spread and mutate state directly, React won't re-render. Try it in code to prove it.
            </p>

            {/* Test 8: vs useState */}
            <h2 className="text-lg font-semibold dark:text-white mt-4">Test 8: vs Multiple useState</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                This component manages 5 state values (showOrders, searchText, selectedOrder, counter, lastAction) with ONE useReducer instead of 5 separate useState calls. All transitions go through the reducer.
            </p>
        </div>
    );
}