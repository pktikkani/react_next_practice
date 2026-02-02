import VendorListServer from "@/components/VendorListServer";
import ItemListServer from "@/components/ItemListServer";
import OrderListServer from "@/components/OrderListServer";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
      <>
          <VendorListServer />
          <ItemListServer />
          <OrderListServer />
      </>
  );
}
