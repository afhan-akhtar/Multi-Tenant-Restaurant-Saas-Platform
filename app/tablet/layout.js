import TabletResumeSync from "./components/TabletResumeSync";

export const metadata = {
  title: "Tableside tablet",
  description: "Customer ordering and waiter tools",
};

export default function TabletLayout({ children }) {
  return (
    <div className="min-h-dvh-safe overflow-x-hidden bg-slate-950 text-slate-100 antialiased px-nav-safe">
      <TabletResumeSync />
      {children}
    </div>
  );
}
