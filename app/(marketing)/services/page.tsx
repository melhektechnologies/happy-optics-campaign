import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumButton } from "@/components/premium-button";
import Link from "next/link";
import { 
  Eye, 
  Glasses, 
  Contact, 
  Monitor, 
  Layers, 
  Palette,
  Shield,
  Sparkles
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Eye Exams, Glasses, Contacts, Coatings",
  description:
    "Comprehensive optometry services in Addis Ababa: eye exams, glasses fitting, contact lenses, progressive and blue-cut lenses, and premium frames.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Happy Optics — Services",
    description: "Comprehensive eye care services and premium eyewear in Addis Ababa.",
    url: "/services",
  },
};

const services = [
  {
    title: "Comprehensive Eye Examinations",
    description: "Thorough eye health assessments using state-of-the-art diagnostic equipment. Our certified optometrists evaluate your vision, eye health, and detect early signs of eye conditions.",
    icon: <Eye className="h-8 w-8" />,
    features: [
      "Visual acuity testing",
      "Refraction assessment",
      "Eye health evaluation",
      "Glaucoma screening",
      "Retinal examination",
    ],
  },
  {
    title: "Eyeglass Fitting & Consultation",
    description: "Expert fitting services ensuring optimal comfort and vision correction. We help you find the perfect frames and lenses tailored to your prescription and lifestyle.",
    icon: <Glasses className="h-8 w-8" />,
    features: [
      "Frame selection consultation",
      "Precise lens fitting",
      "Prescription verification",
      "Style recommendations",
      "Adjustment services",
    ],
  },
  {
    title: "Contact Lens Services",
    description: "Professional fitting and consultation for various contact lens options. From daily disposables to specialty lenses, we provide comprehensive contact lens care.",
    icon: <Contact className="h-8 w-8" />,
    features: [
      "Contact lens fitting",
      "Trial lens evaluation",
      "Care instruction",
      "Follow-up appointments",
      "Lens care products",
    ],
  },
  {
    title: "Blue Light Protection",
    description: "Specialized lenses designed to protect your eyes from digital screen strain. Reduce eye fatigue and improve sleep quality with our blue light filtering technology.",
    icon: <Monitor className="h-8 w-8" />,
    features: [
      "Blue light filtering lenses",
      "Digital eye strain relief",
      "Sleep quality improvement",
      "Available in all lens types",
      "Anti-reflective coating",
    ],
  },
  {
    title: "Progressive & Multifocal Lenses",
    description: "Advanced multifocal lenses providing seamless vision at all distances. Perfect for presbyopia, offering clear vision for reading, computer work, and distance.",
    icon: <Layers className="h-8 w-8" />,
    features: [
      "Progressive lens fitting",
      "Bifocal options",
      "Trifocal solutions",
      "Custom lens design",
      "Adaptation support",
    ],
  },
  {
    title: "Premium Frame Selection",
    description: "Curated collection of high-quality frames from leading international brands. From designer eyewear to budget-friendly options, find frames that match your style.",
    icon: <Palette className="h-8 w-8" />,
    features: [
      "Designer frame brands",
      "Wide style variety",
      "Size fitting service",
      "Color consultations",
      "Frame warranties",
    ],
  },
  {
    title: "Lens Coatings & Treatments",
    description: "Enhance your lenses with premium coatings for durability, clarity, and protection. Choose from anti-reflective, scratch-resistant, UV protection, and more.",
    icon: <Shield className="h-8 w-8" />,
    features: [
      "Anti-reflective coating",
      "Scratch resistance",
      "UV protection",
      "Hydrophobic coating",
      "Photochromic options",
    ],
  },
  {
    title: "Specialty Lens Services",
    description: "Custom lens solutions for unique vision needs. Including high-index lenses, aspheric designs, and specialty prescriptions for optimal visual performance.",
    icon: <Sparkles className="h-8 w-8" />,
    features: [
      "High-index lenses",
      "Aspheric lens design",
      "Custom prescriptions",
      "Sports eyewear",
      "Computer glasses",
    ],
  },
  {
    title: "Progressive Lenses",
    description: "Advanced multifocal lenses providing seamless vision at all distances. Perfect for presbyopia, offering clear vision for reading, computer work, and distance.",
    icon: <Layers className="h-8 w-8" />,
    features: [
      "Seamless distance to near vision",
      "No visible line",
      "Wide field of vision",
      "Custom fitting",
      "Premium quality",
    ],
  },
  {
    title: "Blue-Cut Lenses",
    description: "Specialized lenses designed to protect your eyes from harmful blue light emitted by digital screens. Reduce eye strain and improve sleep quality.",
    icon: <Monitor className="h-8 w-8" />,
    features: [
      "Blue light filtering",
      "Digital eye strain relief",
      "Sleep quality improvement",
      "Available in all lens types",
      "Anti-reflective coating",
    ],
  },
  {
    title: "Plano Lenses",
    description: "Non-prescription lenses for fashion and protection. Perfect for those who want stylish eyewear without vision correction.",
    icon: <Eye className="h-8 w-8" />,
    features: [
      "No prescription needed",
      "Fashion-forward options",
      "UV protection",
      "Blue light filtering available",
      "Wide frame selection",
    ],
  },
  {
    title: "Bifocal Lenses",
    description: "Traditional two-power lenses for distance and reading. Clear separation between vision zones for optimal clarity at both distances.",
    icon: <Layers className="h-8 w-8" />,
    features: [
      "Distance and reading zones",
      "Clear vision separation",
      "Affordable option",
      "Easy adaptation",
      "Durable design",
    ],
  },
  {
    title: "Sight Lenses",
    description: "Medically prescribed lenses from doctors. We work with your prescription to provide the exact vision correction you need.",
    icon: <Eye className="h-8 w-8" />,
    features: [
      "Doctor-prescribed",
      "Precise vision correction",
      "Custom fitting",
      "Quality assurance",
      "Fair pricing",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Our Services</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Comprehensive Eye Care Services
            </h1>
            <p className="text-lg text-muted-foreground">
              From routine eye examinations to premium eyewear solutions, we offer a full range of 
              optometric services tailored to your vision needs.
            </p>
          </div>
        </Container>
      </Section>

      {/* Services Grid */}
      <Section>
        <Container>
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <Card key={index} className="group transition-all hover:shadow-lg hover:border-primary/50">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {service.icon}
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-muted/50">
        <Container>
          <Card className="border-0 bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Services?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book your appointment today and let our experts help you achieve optimal vision.
              </p>
              <PremiumButton asChild size="lg" glowEffect>
                <Link href="/book">Book Your Appointment</Link>
              </PremiumButton>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

