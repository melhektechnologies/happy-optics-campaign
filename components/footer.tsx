import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";

const branches = [
  { name: "Head Office", location: "Addis Ababa Stadium – Yeha City Center" },
  { name: "Bole Branch", location: "Near Waga Eye Centre" },
  { name: "Kera Downtown", location: "Near Neser Eye Clinic" },
  { name: "Betezatha Branch", location: "Inside Betezatha General Hospital" },
];

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/branches", label: "Branches" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container>
        <div className="py-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="relative h-12 w-48">
                <Image
                  src="/brand/happy-optics-logo.png"
                  alt="Happy Optics Optometry Clinic"
                  fill
                  className="object-contain object-left"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Brightens your vision one smile at a time.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/book">Book Appointment</Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Our Branches</h3>
            <ul className="space-y-2">
              {branches.map((branch, index) => (
                <li key={index}>
                  <p className="text-sm font-medium text-foreground">{branch.name}</p>
                  <p className="text-xs text-muted-foreground">{branch.location}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="tel:+251115584293" className="hover:text-primary">
                  +251-115584293
                </a>
              </li>
              <li>
                <a href="tel:+25191439469" className="hover:text-primary">
                  +251 91 43 94 69
                </a>
              </li>
              <li>
                <a href="tel:+251912509666" className="hover:text-primary">
                  +251 912509666
                </a>
              </li>
              <li>
                <a href="mailto:happy.optics21@gmail.com" className="hover:text-primary">
                  happy.optics21@gmail.com
                </a>
              </li>
              <li className="pt-2">
                <p className="text-xs">Addis Ababa Stadium, Yeha City</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Happy Optics Optometry Clinic. All rights reserved.
          </p>
          <p className="mt-1">Established in 2003 E.C.</p>
        </div>
      </Container>
    </footer>
  );
}

