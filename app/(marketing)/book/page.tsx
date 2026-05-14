import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Loader2 } from "lucide-react";
import { BookForm } from "./book-form";

export const metadata: Metadata = {
  title: "Book an Appointment",
  description:
    "Schedule your appointment with Happy Optics in Addis Ababa. Choose your branch and preferred time — we'll call to confirm.",
  alternates: { canonical: "/book" },
  openGraph: {
    title: "Book an Appointment — Happy Optics",
    description: "Schedule your eye exam or eyewear fitting in Addis Ababa.",
    url: "/book",
  },
};

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <Section className="min-h-[60vh] flex items-center">
          <Container>
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" aria-hidden />
            </div>
          </Container>
        </Section>
      }
    >
      <BookForm />
    </Suspense>
  );
}
