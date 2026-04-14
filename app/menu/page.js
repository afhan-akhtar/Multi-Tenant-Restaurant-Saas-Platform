import MenuPageClient from "./MenuPageClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Table menu",
  description: "Order from your table",
};

export default function MenuPage() {
  return <MenuPageClient />;
}
