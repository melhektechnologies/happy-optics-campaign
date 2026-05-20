"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/container";
import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PrescriptionUpload } from "@/components/prescription-upload";
import { ScrollAnimation } from "@/components/scroll-animation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { z } from "zod";

const appointmentSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  branch: z.enum(["head-office", "bole", "kera", "bethzatha"], {
    message: "Please select a branch",
  }),
  preferred_date: z.string().min(1, "Please select a date"),
  preferred_time: z.string().min(1, "Please select a time"),
  reason: z.string().optional(),
  is_unity_student: z.boolean().default(false),
  notes: z.string().optional(),
  honeypot: z.string().max(0, "Invalid submission").optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const branches = [
  { value: "head-office", label: "Head Office - Addis Ababa Stadium" },
  { value: "bole", label: "Bole Branch - Near Waga Eye Centre" },
  { value: "kera", label: "Kera Downtown - Near Neser Eye Clinic" },
  { value: "bethzatha", label: "Betezatha - Inside Betezatha General Hospital" },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

function BookPageContent() {
  const searchParams = useSearchParams();
  const isUnityParam = searchParams?.get("unity") === "true";

  const [formData, setFormData] = useState<Partial<AppointmentFormData>>({
    is_unity_student: isUnityParam || false,
    honeypot: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get tomorrow's date as minimum date
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateString = minDate.toISOString().split("T")[0];

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const validatedData = appointmentSchema.parse(formData);
      
      // Check honeypot
      if (validatedData.honeypot && validatedData.honeypot.length > 0) {
        throw new Error("Invalid submission");
      }

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit appointment");
      }

      setIsSuccess(true);
      setFormData({
        is_unity_student: false,
        honeypot: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ submit: error instanceof Error ? error.message : "An error occurred" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <Card className="mx-auto max-w-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
              </div>
              <h2 className="mb-4 text-3xl font-bold">Appointment Request Submitted!</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Thank you for booking with Happy Optics. We've received your appointment request and will call you 
                shortly to confirm your preferred date and time.
              </p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Hero */}
      <Section className="bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4">Book Appointment</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Schedule Your Visit
            </h1>
            <p className="text-lg text-muted-foreground">
              Fill out the form below to request an appointment. We'll call you to confirm your preferred date and time.
            </p>
            {isUnityParam && (
              <div className="mt-4">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Unity University Student - Free Eye Check
                </Badge>
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Form */}
      <Section>
        <Container>
          <Card className="mx-auto max-w-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Appointment Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.honeypot}
                  onChange={(e) => handleChange("honeypot", e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                {/* Full Name */}
                <div>
                  <Label htmlFor="full_name">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name || ""}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                    className={errors.full_name ? "border-destructive" : ""}
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-destructive">{errors.full_name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <Label htmlFor="phone">
                    Phone Number <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Branch */}
                <div>
                  <Label htmlFor="branch">
                    Preferred Branch <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    id="branch"
                    value={formData.branch || ""}
                    onChange={(e) => handleChange("branch", e.target.value)}
                    required
                    className={errors.branch ? "border-destructive" : ""}
                  >
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                      <option key={branch.value} value={branch.value}>
                        {branch.label}
                      </option>
                    ))}
                  </Select>
                  {errors.branch && (
                    <p className="mt-1 text-sm text-destructive">{errors.branch}</p>
                  )}
                </div>

                {/* Preferred Date */}
                <div>
                  <Label htmlFor="preferred_date">
                    Preferred Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="preferred_date"
                    type="date"
                    min={minDateString}
                    value={formData.preferred_date || ""}
                    onChange={(e) => handleChange("preferred_date", e.target.value)}
                    required
                    className={errors.preferred_date ? "border-destructive" : ""}
                  />
                  {errors.preferred_date && (
                    <p className="mt-1 text-sm text-destructive">{errors.preferred_date}</p>
                  )}
                </div>

                {/* Preferred Time */}
                <div>
                  <Label htmlFor="preferred_time">
                    Preferred Time <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    id="preferred_time"
                    value={formData.preferred_time || ""}
                    onChange={(e) => handleChange("preferred_time", e.target.value)}
                    required
                    className={errors.preferred_time ? "border-destructive" : ""}
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                  {errors.preferred_time && (
                    <p className="mt-1 text-sm text-destructive">{errors.preferred_time}</p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                  <Select
                    id="reason"
                    value={formData.reason || ""}
                    onChange={(e) => handleChange("reason", e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option value="eye-exam">Eye Examination</option>
                    <option value="glasses">New Glasses</option>
                    <option value="contact-lenses">Contact Lenses</option>
                    <option value="follow-up">Follow-up Visit</option>
                    <option value="other">Other</option>
                  </Select>
                </div>

                {/* Unity Student */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_unity_student"
                    checked={formData.is_unity_student || false}
                    onChange={(e) => handleChange("is_unity_student", e.target.checked)}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="is_unity_student" className="cursor-pointer">
                    I am a Unity University student (eligible for free eye check)
                  </Label>
                </div>

                {/* Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Appointment Request"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={
      <Section className="min-h-[60vh] flex items-center">
        <Container>
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        </Container>
      </Section>
    }>
      <BookPageContent />
    </Suspense>
  );
}

