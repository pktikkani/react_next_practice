type Vendor = {
    CardCode: string;
    CardName: string;
};

type Post = {
    id: number;
    title: string;
    body: string;
};

type VendorListClientProps = {
    vendors: Vendor[];
};

type Item = {
    ItemCode: string;
    ItemName: string;
    QuantityOnStock: number;
    ItemType: string;
};

type ItemListClientProps = {
    items: Item[];
};

type Order = {
    DocNum: number;
    CardName: string;
    DocTotal: number;
    DocDate: string;
    DocCurrency: string;
};

type OrderListClientProps = {
    orders: Order[];
};

type Summary = {
    count: number;
    totalStock: number;
};

type OrderState = {
    showOrders: boolean;
    searchText: string;
    selectedOrder: number | null;
    counter: number;
    lastAction: string;
};

type OrderAction =
    | { type: 'TOGGLE_ORDERS' }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'SELECT_ORDER'; payload: number }
    | { type: 'INCREMENT' }
    | { type: 'RESET' };