import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";
import { SerwistProviderClient } from "./components/SerwistProviderClient";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata = {
  title: "Multi Tenant Restaurant Saas Platform",
  description: "A multi tenant restaurant saas platform",
  applicationName: "Restaurant SaaS",
  appleWebApp: {
    capable: true,
    title: "Restaurant SaaS",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins" suppressHydrationWarning>
        <Script
          id="tablet-device-token-bootstrap"
          src="/tablet-device-bootstrap.js"
          strategy="beforeInteractive"
        />
        <SerwistProviderClient>
          <Providers>{children}</Providers>
        </SerwistProviderClient>
      </body>
    </html>
  );
}
