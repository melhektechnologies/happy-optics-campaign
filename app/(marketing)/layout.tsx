import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CornerThemeToggle } from "@/components/corner-theme-toggle";
import Script from "next/script";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Happy Optics Optometry Clinic | Premium Eye Care in Addis Ababa",
    template: "%s | Happy Optics",
  },
  description: "Brightens your vision one smile at a time. Established in 2003 E.C., Happy Optics offers exceptional eye care services and premium eyewear across Addis Ababa.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CornerThemeToggle />
      <main className="min-h-screen pt-20">{children}</main>
      <Footer />
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalClinic",
            name: "Happy Optics Optometry Clinic",
            description: "Brightens your vision one smile at a time. Premium eye care services and eyewear in Addis Ababa.",
            url: "https://happyoptics.com",
            telephone: ["+251-115584293", "+25191439469", "+251912509666"],
            email: "happy.optics21@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Addis Ababa Stadium, Yeha City Center",
              addressLocality: "Addis Ababa",
              addressCountry: "ET",
            },
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "09:00",
                closes: "18:00",
              },
            ],
            priceRange: "$$",
            medicalSpecialty: "Optometry",
            areaServed: {
              "@type": "City",
              name: "Addis Ababa",
            },
          }),
        }}
      />
    </>
  );
}

