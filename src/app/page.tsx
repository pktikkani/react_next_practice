import VendorListServer from "@/components/VendorListServer";
import ItemListServer from "@/components/ItemListServer";
import OrderListServer from "@/components/OrderListServer";
import StateVendorServer from "@/components/StateVendorServer";
import EffectVendorServer from "@/components/EffectVendorServer";
import RefItemServer from "@/components/RefItemServer";
import MemoOrderServer from "@/components/MemoOrderServer";
import CallbackItemServer from "@/components/CallbackItemServer";
import ReducerOrderServer from "@/components/ReducerOrderServer";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
      <>
          <StateVendorServer />
          <EffectVendorServer />
          <RefItemServer />
          <MemoOrderServer />
          <CallbackItemServer />
          <ReducerOrderServer />
          {/*<VendorListServer />*/}
          {/*<ItemListServer />*/}
          {/*<OrderListServer />*/}
      </>
  );
}
