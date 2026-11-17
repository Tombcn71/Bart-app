import { ProductTabs } from "./product-tabs";

/** Alle prijsschermen onder één menu-item "Prijzen", met tabbladen per product erboven. */
export default function PrijzenLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ProductTabs />
      {children}
    </>
  );
}
