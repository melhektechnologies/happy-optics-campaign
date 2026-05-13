import Link from "next/link";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Users, Calendar, Heart, ArrowRight, Eye, Sparkles } from "lucide-react";

export const metadata = {
  title: "Unity University Campaign",
  description: "Free eye check for Unity University students. Book your complimentary eye examination at Happy Optics Optometry Clinic.",
};

const faqs = [
  {
    question: "Who is eligible for the free eye check?",
    answer: "All Unity University students and faculty members are eligible for the complimentary eye examination and screening program. Simply book an appointment and mention that you're part of the Unity University community.",
  },
  {
    question: "What does the free eye check include?",
    answer: "The program includes: Free Visual Acuity Test, Anterior Segment Examination, Health advice and education on digital device use and nutrition, and special discounts on additional treatments if needed.",
  },
  {
    question: "Do I need to bring anything?",
    answer: "Please bring your Unity University student or faculty ID for verification. If you have previous eye examination records or are currently using glasses/contact lenses, please bring those as well.",
  },
  {
    question: "What if I need glasses or additional treatment?",
    answer: "The free eye check covers the examination and consultation. If you need glasses, contact lenses, or other treatments, Unity University members receive special discounts on all additional services.",
  },
  {
    question: "How long is this program available?",
    answer: "This partnership program with Unity University is ongoing. We encourage all students and faculty to take advantage of this opportunity to maintain optimal eye health.",
  },
  {
    question: "Where will the services be provided?",
    answer: "Services are available at all four of our Addis Ababa branches. We're also working to bring mobile screening services directly to the Unity University campus for added convenience.",
  },
  {
    question: "Why is this program important?",
    answer: "With increased screen time from computers and mobile devices, eye strain and related health problems are common among students and faculty. This program helps detect and address these issues early, ensuring better eye health for academic and professional success.",
  },
];

export default function UnityPage() {
  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Unity University Partnership</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Free Eye Treatment & Screening Program
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              Happy Optics Optometry Clinic, in partnership with Unity University, is proud to provide 
              a comprehensive free eye treatment and screening program for students and faculty.
            </p>
            <p className="text-base text-muted-foreground mb-8">
              With increased screen time from computers and mobile devices leading to eye strain and 
              other eye health problems, we&apos;re bringing easily accessible health services directly to 
              the university campus.
            </p>
            <Button asChild size="lg" className="group">
              <Link href="/book?unity=true">
                Book Your Free Eye Check
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Container>
      </Section>

      {/* Services Provided */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Services Provided
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive eye care services designed for the university community
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Free Visual Acuity Test</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive vision testing to determine if you need glasses or vision correction. 
                  Essential for students and faculty who spend long hours reading and using digital devices.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Anterior Segment Examination</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed examination to diagnose conditions such as dry eye syndrome, 
                  conjunctivitis, and other ocular problems commonly associated with prolonged screen time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Health Advice & Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Expert guidance on digital device use, proper nutrition for eye health, 
                  and preventive care practices. Learn how to protect your vision while studying and working.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Special Discount Services</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Exclusive discounts on eyeglasses, contact lenses, and additional treatments 
                  for Unity University students and faculty members who require further care.
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* About the Partnership */}
      <Section className="bg-muted/50">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                About This Partnership
              </h2>
            </div>
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Happy Optics Optometry Clinic</strong> is a 
                    renowned institution committed to providing excellent medical services and fulfilling 
                    our corporate social responsibility (CSR) beyond business operations.
                  </p>
                  <p>
                    In partnership with <strong className="text-foreground">Unity University</strong>, 
                    one of Ethiopia&apos;s top academic institutions, we are bringing comprehensive eye care 
                    services directly to the university campus.
                  </p>
                  <p>
                    This initiative addresses the growing concern of eye health problems among students 
                    and faculty who spend significant time on computers and mobile screens, leading to 
                    eye strain, dry eyes, and other vision-related issues.
                  </p>
                  <p>
                    Our goal is to make eye health services easily accessible to the university community, 
                    ensuring that vision problems are detected early and treated appropriately, allowing 
                    students and faculty to maintain optimal eye health for their academic and professional success.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* How It Works */}
      <Section className="bg-muted/50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How It Works
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Book Your Appointment</h3>
                  <p className="text-sm text-muted-foreground">
                    Use our online booking system or call us to schedule your free eye check. 
                    Make sure to mention you&apos;re a Unity University student.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Visit Our Clinic</h3>
                  <p className="text-sm text-muted-foreground">
                    Come to any of our four Addis Ababa branches. Bring your Unity University student ID for verification.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <div>
                  <h3 className="mb-2 font-semibold">Receive Your Examination</h3>
                  <p className="text-sm text-muted-foreground">
                    Our optometrists will conduct a thorough eye examination and provide you with detailed results and recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="bg-muted/50">
        <Container>
          <Card className="border-0 bg-gradient-to-r from-primary to-accent text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready for Your Free Eye Check?</h2>
              <p className="text-lg mb-8 opacity-90">
                Book your appointment now and take advantage of this special offer for Unity University students.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/book?unity=true">
                  Book Appointment Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

