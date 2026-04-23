import { OfflineView } from "./OfflineView";

export const metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};

/**
 * Shown when a document navigation fails in the service worker (no network and
 * no cached copy). Keep minimal: no data fetches.
 */
export default function OfflinePage() {
  return <OfflineView />;
}
