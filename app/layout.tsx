import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Happy Optics Optometry Clinic | Premium Eye Care in Addis Ababa",
    template: "%s | Happy Optics",
  },
  description: "Brightens your vision one smile at a time. Established in 2003 E.C., Happy Optics offers exceptional eye care services and premium eyewear across Addis Ababa.",
  keywords: ["optometry", "eye care", "eyeglasses", "Addis Ababa", "eye exam", "optometrist"],
  authors: [{ name: "Happy Optics Optometry Clinic" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://happyoptics.com",
    siteName: "Happy Optics Optometry Clinic",
    title: "Happy Optics Optometry Clinic | Premium Eye Care",
    description: "Brightens your vision one smile at a time. Premium eye care services and eyewear in Addis Ababa.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Optics Optometry Clinic",
    description: "Brightens your vision one smile at a time.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${inter.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
