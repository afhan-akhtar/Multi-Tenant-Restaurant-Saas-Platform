import pageStyles from "@/app/styles/Page.module.css";

export default function ReportsPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Reports</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Coming soon. Sales reports, analytics, and exports will be available here.
      </p>
    </div>
  );
}
