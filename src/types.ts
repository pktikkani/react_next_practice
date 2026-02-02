type Vendor = {
    CardCode: string;
    CardName: string;
};

type Post = {
    id: number;
    title: string;
    body: string;
}

type VendorListClientProps = {
    vendors: Vendor[];
};