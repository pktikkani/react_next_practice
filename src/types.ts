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