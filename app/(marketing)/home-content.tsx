"use client";

import Image from "next/image";
import Link from "next/link";
import { PremiumButton } from "@/components/premium-button";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { ServiceCard } from "@/components/service-card";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import { ScrollAnimation } from "@/components/scroll-animation";
import { ParallaxSection } from "@/components/parallax-section";
import { TrustBadges } from "@/components/trust-badges";
import { PartnersSection } from "@/components/partners-section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Glasses, Heart, Sparkles, CheckCircle2, Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "The staff at Happy Optics are incredibly professional and caring. My new glasses are perfect, and the service was exceptional.",
    author: "Alem T.",
    role: "Patient",
    rating: 5,
  },
  {
    quote: "I've been coming to Happy Optics for years. The quality of care and eyewear selection is unmatched in Addis Ababa.",
    author: "Mekonnen K.",
    role: "Long-term Patient",
    rating: 5,
  },
  {
    quote: "As a Unity student, I took advantage of the free eye check. The examination was thorough, and I'm very satisfied with the service.",
    author: "Sara M.",
    role: "Unity University Student",
    rating: 5,
  },
];

export function HomeContent() {
  return (
    <>
      {/* Hero Section with Premium Animations */}
      <Section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 80, 0],
            y: [0, -80, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            x: [0, -80, 0],
            y: [0, 80, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center py-12 lg:py-20">
            <ScrollAnimation direction="right" delay={0.2}>
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge variant="outline" className="w-fit mb-4 group cursor-pointer">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="inline-block mr-2"
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.span>
                    Established 2003 E.C.
                  </Badge>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  Brightens your vision{" "}
                  <motion.span 
                    className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      backgroundSize: "200% 200%",
                    }}
                  >
                    one smile at a time
                  </motion.span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-muted-foreground max-w-2xl"
                >
                  Experience exceptional eye care services and premium eyewear solutions at Happy Optics Optometry Clinic. 
                  With four branches across Addis Ababa, we&apos;re committed to delivering personalized care and the highest quality.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <PremiumButton asChild size="lg" glowEffect>
                    <Link href="/book">Book Appointment</Link>
                  </PremiumButton>
                  <PremiumButton asChild variant="outline" size="lg" showArrow={false}>
                    <Link href="/about">Learn More</Link>
                  </PremiumButton>
                </motion.div>
              </div>
            </ScrollAnimation>

            <ParallaxSection speed={0.3}>
              <ScrollAnimation direction="left" delay={0.4}>
                <div className="relative">
                  <motion.div
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl group"
                    whileHover={{ scale: 1.05, rotate: 1 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image
                        src="/brand/clinic.webp"
                        alt="Inside the Happy Optics Optometry Clinic in Addis Ababa"
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                    </motion.div>
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"
                      initial={{ opacity: 0.5 }}
                      whileHover={{ opacity: 0.8 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 border-2 border-primary/20 rounded-2xl"
                      whileHover={{ borderColor: "rgba(13, 115, 119, 0.5)" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-6 -right-6 hidden h-32 w-32 rounded-full bg-primary/20 blur-3xl lg:block"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>
              </ScrollAnimation>
            </ParallaxSection>
          </div>
        </Container>
      </Section>

      {/* Trust Badges */}
      <Section className="bg-muted/30">
        <Container>
          <ScrollAnimation>
            <TrustBadges />
          </ScrollAnimation>
        </Container>
      </Section>


      {/* Highlights with Premium Cards */}
      <Section>
        <Container>
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Why Choose Happy Optics?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We combine precision, innovation, and personalized care to deliver exceptional optometric services.
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Eye,
                title: "Expert Optometrists",
                description: "Our certified professionals provide comprehensive eye examinations with state-of-the-art equipment.",
              },
              {
                icon: Glasses,
                title: "Premium Eyewear",
                description: "Curated collection of high-quality frames and lenses from leading international brands.",
              },
              {
                icon: Heart,
                title: "Personalized Care",
                description: "Every patient receives individualized attention and tailored treatment plans.",
              },
            ].map((highlight, index) => (
              <ScrollAnimation key={index} delay={index * 0.15} direction="up">
                <motion.div
                  whileHover={{ y: -12, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Card className="border-0 bg-card/50 backdrop-blur-sm h-full group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <CardContent className="p-8 relative z-10">
                      <motion.div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-all duration-300 relative overflow-hidden"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <highlight.icon className="h-8 w-8 text-primary relative z-10" />
                      </motion.div>
                      <motion.h3 
                        className="mb-3 text-xl font-semibold"
                        whileHover={{ x: 4 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {highlight.title}
                      </motion.h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
        </Container>
      </Section>

      {/* Services Preview */}
      <Section className="bg-muted/50">
        <Container>
          <ScrollAnimation>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Our Services
              </h2>
              <p className="text-lg text-muted-foreground">
                Comprehensive eye care solutions tailored to your needs
              </p>
            </div>
          </ScrollAnimation>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Eye Examinations", description: "Thorough eye health assessments using advanced diagnostic equipment." },
              { title: "Eyeglass Fitting", description: "Expert fitting services for optimal comfort and vision correction." },
              { title: "Contact Lenses", description: "Professional fitting and consultation for contact lens options." },
              { title: "Blue Light Protection", description: "Specialized lenses to protect your eyes from digital screen strain." },
              { title: "Progressive Lenses", description: "Advanced multifocal lenses for seamless vision at all distances." },
              { title: "Frame Selection", description: "Wide range of premium frames to match your style and needs." },
            ].map((service, index) => (
              <ScrollAnimation key={index} delay={index * 0.1} direction="up">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <ServiceCard
                    title={service.title}
                    description={service.description}
                  />
                </motion.div>
              </ScrollAnimation>
            ))}
          </div>
          <ScrollAnimation delay={0.3}>
            <div className="mt-8 text-center">
              <PremiumButton asChild variant="outline" size="lg">
                <Link href="/services">View All Services</Link>
              </PremiumButton>
            </div>
          </ScrollAnimation>
        </Container>
      </Section>

      {/* Unity Campaign Banner with Premium Design */}
      <Section>
        <Container>
          <ScrollAnimation>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 overflow-hidden relative group">
                <motion.div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(13,115,119,0.1),transparent)]"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className="grid gap-8 md:grid-cols-2 items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                          Unity University Campaign
                        </Badge>
                      </motion.div>
                      <h2 className="text-3xl font-bold mb-4">Free Eye Check for Unity Students</h2>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        Unity University students can now receive a complimentary eye examination. 
                        Book your appointment today and take the first step towards better vision.
                      </p>
                      <PremiumButton asChild size="lg" glowEffect>
                        <Link href="/unity">Learn More & Book</Link>
                      </PremiumButton>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.2,
                      }}
                    >
                      <motion.div 
                        className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 relative overflow-hidden"
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.8, type: "spring" }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <CheckCircle2 className="h-16 w-16 text-primary relative z-10" />
                      </motion.div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollAnimation>
        </Container>
      </Section>

      {/* Premium Testimonials Carousel */}
      <Section className="bg-muted/50">
        <Container>
          <ScrollAnimation>
            <div className="text-center mb-12">
              <motion.div 
                className="flex items-center justify-center gap-2 mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  What Our Patients Say
                </h2>
                <motion.div
                  animate={{ rotate: [360, 0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                </motion.div>
              </motion.div>
              <motion.p 
                className="text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Trusted by thousands of satisfied patients across Addis Ababa
              </motion.p>
            </div>
          </ScrollAnimation>
          <ScrollAnimation delay={0.2}>
            <TestimonialsCarousel testimonials={testimonials} />
          </ScrollAnimation>
        </Container>
      </Section>

          {/* Partners Section */}
          <PartnersSection />

          {/* Premium CTA Section */}
          <Section>
        <Container>
          <ScrollAnimation>
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <Card className="border-0 bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground overflow-hidden relative group">
                <motion.div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
                <CardContent className="p-12 text-center relative z-10">
                  <motion.h2
                    className="text-3xl font-bold mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    Ready to Improve Your Vision?
                  </motion.h2>
                  <motion.p 
                    className="text-lg mb-8 opacity-90"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0.9, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Book your appointment today and experience the Happy Optics difference.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <PremiumButton asChild size="lg" variant="secondary" glowEffect>
                      <Link href="/book">Book Your Appointment Now</Link>
                    </PremiumButton>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </ScrollAnimation>
        </Container>
      </Section>
    </>
  );
}

