import Image from "next/image";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Target, Lightbulb, Heart, Users, Award } from "lucide-react";

export const metadata = {
  title: "About Us",
  description: "Learn about Happy Optics Optometry Clinic - Our story, mission, vision, and commitment to excellence in eye care since 2003 E.C.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Our Story</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              About Happy Optics
            </h1>
            <p className="text-lg text-muted-foreground">
              Established in 2003 E.C., we've grown from a single branch to four locations across Addis Ababa, 
              serving thousands of patients with exceptional eye care and premium eyewear solutions.
            </p>
          </div>
        </Container>
      </Section>

      {/* Story */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/brand/clinic.png"
                alt="Happy Optics Clinic"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Journey</h2>
              <p className="text-muted-foreground">
                Happy Optics was established in 2003 E.C. in Addis Ababa, with the core mission of providing 
                exceptional eye care services. Initially opening a single branch, our business flourished, 
                leading to significant growth after just three years. Today, Happy Optics proudly operates 
                four branches across Addis Ababa.
              </p>
              <p className="text-muted-foreground">
                Throughout this journey, we have gained invaluable experience, enhanced our performance, and 
                developed our skills, which has enabled us to foster long-term relationships with our valued clients. 
                Our success allowed us to expand our services beyond Addis Ababa to regions such as Gambela, 
                Shabu, and Asela for two years.
              </p>
              <p className="text-muted-foreground">
                Recognizing the growing demand for our services, we are excited about our plans for future expansion. 
                We aim to broaden our reach and continue delivering personalized, high-quality eye care that meets 
                the diverse needs, preferences, and tastes of our customers.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Mission, Vision, Objective */}
      <Section className="bg-muted/50">
        <Container>
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Guide our guests through product and service excellence. Deliver top-tier eyeglass solutions 
                  and optometric consultations with personalized care and the highest quality standards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lightbulb className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lead the optics industry by redefining excellence in optometric care and eyewear innovation. 
                  Set new standards in precision, performance, and patient satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Objectives</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our objective is to expand our branch network and profitability while also fulfilling our 
                  corporate social responsibility within the optics and optometry industry. This involves not 
                  just growing our business, but also making a positive impact on society by elevating industry 
                  standards. We are committed to advancing eye health through innovation, supporting sustainable 
                  practices in eyewear production, and educating the public on the importance of regular eye care. 
                  By fostering partnerships with healthcare providers and contributing to research and development, 
                  we aim to drive improvements in the overall quality and accessibility of vision care, ensuring 
                  that our growth aligns with broader societal benefits.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Core Values
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Eye className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Uncompromising quality in every service and product
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Care</h3>
                <p className="text-sm text-muted-foreground">
                  Personalized attention for every patient
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Innovation</h3>
                <p className="text-sm text-muted-foreground">
                  Latest technology and modern solutions
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 font-semibold">Integrity</h3>
                <p className="text-sm text-muted-foreground">
                  Honest, transparent, and ethical practices
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Team Photo */}
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Team
              </h2>
              <p className="text-lg text-muted-foreground">
                Dedicated professionals committed to your vision health
              </p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/brand/team.png"
                alt="Happy Optics Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Industry Experience */}
      <Section className="bg-muted/50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Industry Experience
              </h2>
              <p className="text-lg text-muted-foreground">
                Over 12 years of excellence in optometry and eyewear
              </p>
            </div>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For over <strong className="text-foreground">12 years</strong>, Happy Optics has thrived 
                    in the industry, specializing in the production and sale of a wide variety of eyeglasses. 
                    In addition to our core offerings, we also provide optical consultations whenever needed.
                  </p>
                  <p>
                    Our selection includes medically prescribed products from doctors, as well as high-quality 
                    frames, progressive lenses, blue-cut lenses, plano lenses, bifocal lenses, and sight lenses, 
                    all at fair prices.
                  </p>
                  <p>
                    At Happy Optics, we are committed to offering innovative, durable products and professional 
                    services that exceed the expectations of our valued clients. Our company is built on the 
                    foundation of experienced, ethical staff who uphold the highest standards of honesty and 
                    integrity in every business interaction.
                  </p>
                  <p>
                    Our attention to detail ensures that our products are a worthwhile investment—high-quality, 
                    stylish, designer glasses with exclusive frames available only in our stores. These unique 
                    frames are designed to complement various face shapes and features, allowing our customers 
                    to express their personality, style, and charisma through a wide range of options in brand, 
                    color, size, shape, and frame design.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* New Optometry Clinic */}
      <Section className="bg-muted/50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our New Optometry Clinic
              </h2>
            </div>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <p className="text-muted-foreground">
                  Located in <strong className="text-foreground">Yeha City Center, Addis Ababa</strong>, our 
                  new optometric clinic is open. This state-of-the-art facility is dedicated to providing 
                  exceptional eye care services, including comprehensive eye examinations, advanced diagnostic 
                  testing, and personalized treatment plans. Our clinic is staffed by highly skilled professionals 
                  committed to delivering the highest standard of service, ensuring that each patient receives 
                  the best possible care in a comfortable and welcoming environment.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Our Growth Timeline
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                  <div className="h-full w-0.5 bg-border mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-2">2003 E.C. - Foundation</h3>
                  <p className="text-sm text-muted-foreground">
                    Happy Optics opens its first branch in Addis Ababa with the core mission of providing 
                    exceptional eye care services and premium eyewear.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                  <div className="h-full w-0.5 bg-border mt-2"></div>
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="font-semibold mb-2">Expansion Across Addis</h3>
                  <p className="text-sm text-muted-foreground">
                    Growth to four strategic locations: Head Office at Yeha City Center near Addis Ababa Stadium, 
                    Bole branch beside Waga Eye Hospital, Kera Downtown near Neser Eye Hospital, and 
                    Betezatha General Hospital.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Regional Outreach (2 Years)</h3>
                  <p className="text-sm text-muted-foreground">
                    Extended services to Gambela, Shabu, and Asela regions, 
                    bringing quality eye care to more communities for two years.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="h-4 w-4 rounded-full bg-primary"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">New Optometry Clinic</h3>
                  <p className="text-sm text-muted-foreground">
                    Opened our new state-of-the-art optometric clinic in Yeha City Center, 
                    offering comprehensive eye examinations and advanced diagnostic testing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
