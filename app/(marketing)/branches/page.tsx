import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { BranchCard } from "@/components/branch-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Branches",
  description:
    "Find Happy Optics Optometry Clinic locations across Addis Ababa: Head Office, Bole, Kera Downtown, and Betezatha.",
  alternates: { canonical: "/branches" },
  openGraph: {
    title: "Happy Optics — Branches",
    description: "Four convenient locations across Addis Ababa.",
    url: "/branches",
  },
};

const branches = [
  {
    name: "Head Office",
    location: "Addis Ababa Stadium – Yeha City Center",
    phone: "+251-115584293",
    mapUrl: "https://maps.google.com/?q=Addis+Ababa+Stadium+Yeha+City+Center",
  },
  {
    name: "Bole Branch",
    location: "Near Waga Eye Centre (beside Waga Eye Hospital)",
    phone: "+251 91 43 94 69",
    mapUrl: "https://maps.google.com/?q=Waga+Eye+Centre+Addis+Ababa",
  },
  {
    name: "Kera Downtown",
    location: "Near Neser Eye Clinic/Hospital",
    phone: "+251 912509666",
    mapUrl: "https://maps.google.com/?q=Neser+Eye+Clinic+Addis+Ababa",
  },
  {
    name: "Betezatha Branch",
    location: "Inside Betezatha General Hospital",
    phone: "+251-115584293",
    mapUrl: "https://maps.google.com/?q=Betezatha+General+Hospital+Addis+Ababa",
  },
];

const otherRegions = [
  { name: "Asela", period: "2 years" },
  { name: "Gambela", period: "2 years" },
  { name: "Shabu", period: "2 years" },
];

export default function BranchesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Our Locations</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Visit Us at Our Branches
            </h1>
            <p className="text-lg text-muted-foreground">
              With four convenient locations across Addis Ababa, we&apos;re here to serve you. 
              Find the branch nearest to you.
            </p>
          </div>
        </Container>
      </Section>

      {/* Addis Ababa Branches */}
      <Section>
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Addis Ababa Branches</h2>
            <p className="text-muted-foreground">
              Our four locations across the capital city
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {branches.map((branch, index) => (
              <BranchCard
                key={index}
                name={branch.name}
                location={branch.location}
                phone={branch.phone}
                mapUrl={branch.mapUrl}
              />
            ))}
          </div>
        </Container>
      </Section>

      {/* Other Regions */}
      <Section className="bg-muted/50">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Other Regions Served</h2>
            <p className="text-muted-foreground">
              We&apos;ve also extended our services to these regions
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {otherRegions.map((region, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{region.name}</h3>
                      <p className="text-sm text-muted-foreground">Served for {region.period}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Info */}
      <Section>
        <Container>
          <Card className="border-0 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Need Directions?</h2>
              <p className="text-muted-foreground mb-6">
                Contact us for detailed directions to any of our branches or to schedule an appointment.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <a href="tel:+251115584293" className="text-primary hover:underline">
                  +251-115584293
                </a>
                <a href="tel:+25191439469" className="text-primary hover:underline">
                  +251 91 43 94 69
                </a>
                <a href="tel:+251912509666" className="text-primary hover:underline">
                  +251 912509666
                </a>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

