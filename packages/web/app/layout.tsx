import "./css/style.css";
import Footer from "@web/components/ui/footer";
import Header from "@web/components/ui/header";
import { Metadata } from "next";
import { Inter, Architects_Daughter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const architects_daughter = Architects_Daughter({
  subsets: ["latin"],
  variable: "--font-architects-daughter",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Purpose Bound Money (PBM)",
  description:
    "A protocol for the use of digital money under specified conditions.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    minimumScale: 1,
  },
  themeColor: "#2563EB",
  icons: {
    icon: ["/favicon.ico?v=4"],
    apple: ["/apple-touch-icon.png?v=4"],
    shortcut: ["/apple-touch-icon.png"],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-white text-gray-700 tracking-tight bg-top bg-no-repeat bg-auto bg-blend-multiply bg-page`}
      >
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
