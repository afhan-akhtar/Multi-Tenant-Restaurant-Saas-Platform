import pageStyles from "@/app/styles/Page.module.css";

export default function ZReportsPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Z-Reports</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Exportable Z-Reports compliant with German regulations. Coming soon.
      </p>
    </div>
  );
}
