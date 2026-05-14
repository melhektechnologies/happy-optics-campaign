import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://happyoptics.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Happy Optics Optometry Clinic | Premium Eye Care in Addis Ababa",
    template: "%s | Happy Optics",
  },
  description:
    "Brightens your vision one smile at a time. Established in 2003 E.C., Happy Optics offers exceptional eye care services and premium eyewear across Addis Ababa.",
  keywords: ["optometry", "eye care", "eyeglasses", "Addis Ababa", "eye exam", "optometrist"],
  authors: [{ name: "Happy Optics Optometry Clinic" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Happy Optics Optometry Clinic",
    title: "Happy Optics Optometry Clinic | Premium Eye Care",
    description:
      "Brightens your vision one smile at a time. Premium eye care services and eyewear in Addis Ababa.",
    images: [
      {
        url: "/brand/team.webp",
        width: 1600,
        height: 1000,
        alt: "The Happy Optics optometry team in Addis Ababa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happy Optics Optometry Clinic",
    description: "Brightens your vision one smile at a time.",
    images: ["/brand/team.webp"],
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
        className={`${poppins.variable} ${inter.variable} antialiased selection:bg-primary/30 selection:text-white`}
      >
        <ThemeProvider>
          {/* Cinematic Atmospheric Effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
          </div>
          
          <div className="relative z-10">
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

