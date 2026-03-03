import pageStyles from "@/app/styles/Page.module.css";

export default function LoyaltyPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Loyalty Program</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Configure loyalty program and points rules. Coming soon.
      </p>
    </div>
  );
}
