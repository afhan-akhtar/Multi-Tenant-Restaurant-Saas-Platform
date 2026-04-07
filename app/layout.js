import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Multi Tenant Restaurant Saas Platform",
  description: "A multi tenant restaurant saas platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script
          id="tablet-device-token-bootstrap"
          src="/tablet-device-bootstrap.js"
          strategy="beforeInteractive"
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
