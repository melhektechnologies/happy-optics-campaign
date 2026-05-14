import type { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Premium Eye Care in Addis Ababa",
  description:
    "Happy Optics — comprehensive eye exams, premium eyewear, contact lenses, and partnered services in Addis Ababa. Book online or visit one of our four branches.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Happy Optics — Premium Eye Care in Addis Ababa",
    description:
      "Comprehensive optometry services and premium eyewear in Addis Ababa. Book your appointment online.",
    url: "/",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
