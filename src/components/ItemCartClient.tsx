function cartReducer(state: CartState, action: CartAction): CartState {
    let newCartItems: CartItem[];

    switch (action.type) {
        case "ADD_ITEM": {
            const existing = state.cartItems.find(i => i.ItemCode === action.item.ItemCode);
            if (existing) {
                newCartItems = state.cartItems.map(i =>
                    i.ItemCode === action.item.ItemCode
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            } else {
                newCartItems = [...state.cartItems, { ...action.item, quantity: 1 }];
            }
            return {
                cartItems: newCartItems,
                totalItems: newCartItems.reduce((sum, i) => sum + i.quantity, 0),
                totalStock: newCartItems.reduce((sum, i) => sum + i.QuantityOnStock, 0),
                lastAction: `Added ${action.item.ItemCode}`,
            };
        }
        case "REMOVE_ITEM": {
            newCartItems = state.cartItems.filter(i => i.ItemCode !== action.itemCode);
            return {
                cartItems: newCartItems,
                totalItems: newCartItems.reduce((sum, i) => sum + i.quantity, 0),
                totalStock: newCartItems.reduce((sum, i) => sum + i.QuantityOnStock, 0),
                lastAction: `Removed ${action.itemCode}`,
            };
        }
        case "UPDATE_QUANTITY": {
            newCartItems = state.cartItems.map(i =>
                i.ItemCode === action.itemCode
                    ? { ...i, quantity: action.quantity }
                    : i
            );
            return {
                cartItems: newCartItems,
                totalItems: newCartItems.reduce((sum, i) => sum + i.quantity, 0),
                totalStock: newCartItems.reduce((sum, i) => sum + i.QuantityOnStock, 0),
                lastAction: `Updated ${action.itemCode} to ${action.quantity}`,
            };
        }
        case "CLEAR_CART": {
            return {
                cartItems: [],
                totalItems: 0,
                totalStock: 0,
                lastAction: "Cleared cart",
            };
        }
        default:
            throw new Error("Unknown action type");
    }
}

export function ItemCartClient({ items }: ItemListClientProps) {

    return null;
}