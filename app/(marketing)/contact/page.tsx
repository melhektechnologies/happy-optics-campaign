import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Happy Optics Optometry Clinic in Addis Ababa. Phone, email, address, and direct contact form for appointments and questions.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Happy Optics",
    description: "Get in touch with our team in Addis Ababa.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Get in Touch
            </h1>
            <p className="text-lg text-muted-foreground">
              Have questions? We&apos;re here to help. Reach out to us through any of the channels below.
            </p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Phone</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <a href="tel:+251115584293" className="block hover:text-primary">
                    +251-115584293
                  </a>
                  <a href="tel:+25191439469" className="block hover:text-primary">
                    +251 91 43 94 69
                  </a>
                  <a href="tel:+251912509666" className="block hover:text-primary">
                    +251 912509666
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Email</h3>
                <a
                  href="mailto:happy.optics21@gmail.com"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  happy.optics21@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Address</h3>
                <p className="text-sm text-muted-foreground">
                  Addis Ababa Stadium, Yeha City Center
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" aria-hidden />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Mon - Sat: 9:00 AM - 6:00 PM
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-muted/50">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
