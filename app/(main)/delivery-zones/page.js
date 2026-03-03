import pageStyles from "@/app/styles/Page.module.css";

export default function DeliveryZonesPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Delivery Zones</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Define custom delivery zones with distance-based pricing and validation. Coming soon.
      </p>
    </div>
  );
}
