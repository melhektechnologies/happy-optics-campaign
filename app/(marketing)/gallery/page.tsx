import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryImage } from "@/components/gallery-image";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of Happy Optics Optometry Clinic in Addis Ababa — our facilities, premium eyewear collection, and clinic atmosphere.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Happy Optics — Gallery",
    description: "Inside our Addis Ababa optometry clinics.",
    url: "/gallery",
  },
};

// Gallery items from brand folder
const galleryItems = [
  {
    src: "/brand/galley 1.webp",
    alt: "Inside the Happy Optics clinic — reception area",
    title: "Our Clinic",
    category: "Facilities",
  },
  {
    src: "/brand/galley 2.webp",
    alt: "Optometrist performing an eye exam at Happy Optics",
    title: "Our Services",
    category: "Services",
  },
  {
    src: "/brand/galley 3.webp",
    alt: "Premium eyewear frames on display at Happy Optics",
    title: "Premium Eyewear",
    category: "Products",
  },
  {
    src: "/brand/galley 4.webp",
    alt: "Happy Optics staff providing expert eye care",
    title: "Expert Care",
    category: "Services",
  },
  {
    src: "/brand/galley 5.webp",
    alt: "Modern examination room at Happy Optics",
    title: "Modern Facilities",
    category: "Facilities",
  },
  {
    src: "/brand/galley 6.webp",
    alt: "Customer service area at Happy Optics",
    title: "Quality Service",
    category: "Services",
  },
];

export default function GalleryPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Our Gallery</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Explore Our Clinic
            </h1>
            <p className="text-lg text-muted-foreground">
              Take a virtual tour of our modern facilities, premium eyewear collection, 
              and the welcoming atmosphere at Happy Optics.
            </p>
          </div>
        </Container>
      </Section>

      {/* Gallery Grid */}
      <Section>
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryItems.map((item, index) => (
              <Card key={index} className="group overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <GalleryImage
                    src={item.src}
                    alt={item.alt}
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-primary mb-1">{item.category}</p>
                  <h3 className="font-semibold">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

    </>
  );
}

