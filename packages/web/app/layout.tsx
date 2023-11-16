import "./css/style.css";
import Footer from "@web/components/ui/footer";
import Header from "@web/components/ui/header";
import { Metadata } from "next";
import { Inter, Architects_Daughter } from "next/font/google";
import Head from "next/head";
import Script from "next/script";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  openGraph: {
    type: "website",
    title: "The Purpose Bound Money (PBM)",
    description:
      "A protocol, developed as part of Project Orchid, enabling the use of digital money with automated on-chain escrow payment releases.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Purpose Bound Money (PBM)",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // noinspection HtmlRequiredTitleElement
  return (
    <html lang="en">
      <Head>
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body
        className={`${inter.variable} ${architects_daughter.variable} font-inter antialiased bg-white text-gray-700 tracking-tight bg-top bg-no-repeat bg-auto bg-blend-multiply bg-page`}
      >
        <div className="flex flex-col min-h-screen overflow-hidden">
          <Header />
          {children}
          <Footer />
        </div>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${gaMeasurementId}');
        `}
        </Script>
      </body>
    </html>
  );
}
