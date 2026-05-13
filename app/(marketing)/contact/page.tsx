"use client";

import { useState } from "react";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        setErrorMessage(
          data?.error ||
            "We couldn't send your message. Please try again or call us."
        );
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
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

      {/* Contact Info */}
      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="border-0 bg-card/50 backdrop-blur-sm text-center">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
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
                    <Mail className="h-6 w-6 text-primary" />
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
                    <MapPin className="h-6 w-6 text-primary" />
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
                    <Clock className="h-6 w-6 text-primary" />
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

      {/* Contact Form */}
      <Section className="bg-muted/50">
        <Container>
          <div className="mx-auto max-w-2xl">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {isSuccess ? (
                  <div className="rounded-md bg-primary/10 p-4 text-center text-sm text-primary">
                    Thank you for your message! We&apos;ll get back to you soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {errorMessage && (
                      <div
                        role="alert"
                        className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
                      >
                        {errorMessage}
                      </div>
                    )}
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={6}
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}

