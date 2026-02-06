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

interface CartItem extends Item {
    quantity: number;
}

type CartState = {
    cartItems: CartItem[];
    totalItems: number;
    totalStock: number;
    lastAction: string;
}

type CartAction =
    | { type: "ADD_ITEM"; item: Item }
    | { type: "REMOVE_ITEM"; itemCode: string }
    | { type: "UPDATE_QUANTITY"; itemCode: string; quantity: number }
    | { type: "CLEAR_CART" };

type VendorFilterState = {
    searchText: string;
    sortOrder: "asc" | "desc";
};

type VendorFilterAction =
    | { type: "SET_SEARCH"; text: string }
    | { type: "TOGGLE_SORT" }
    | { type: "RESET" };



