import pageStyles from "@/app/styles/Page.module.css";

export default function SettingsPage() {
  return (
    <div className={pageStyles.page}>
      <h2 className={pageStyles.pageTitle}>Settings</h2>
      <p className={pageStyles.pageDescription} style={{ textAlign: "center" }}>
        Coming soon. Platform and tenant settings will be available here.
      </p>
    </div>
  );
}
