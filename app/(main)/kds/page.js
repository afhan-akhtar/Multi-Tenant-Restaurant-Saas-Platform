import pageStyles from "@/app/styles/Page.module.css";

export default function KDSPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Kitchen Display System (KDS)</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Digital screens replacing kitchen printers. Real-time sync via WebSockets, status workflow: Created → Cooking → Ready → Dispatched.
      </p>
    </div>
  );
}
