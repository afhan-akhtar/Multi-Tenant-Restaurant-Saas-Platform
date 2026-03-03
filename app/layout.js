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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
