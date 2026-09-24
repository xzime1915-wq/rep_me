"use client";

import { useState } from "react";
import { Input } from "@/components/Input";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="container-trizen py-12">
      <h1 className="text-2xl font-bold uppercase tracking-wide mb-8">Contact Us</h1>
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[
            { icon: Mail, label: "Email", value: "support@trizenstore.com" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
            {
              icon: MapPin,
              label: "Address",
              value: "123 Innovation Drive, Tech City, TC 10001",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex gap-4">
              <Icon className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {label}
                </p>
                <p className="mt-1">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
            <p className="font-semibold mb-2">Message Sent!</p>
            <p className="text-sm text-[var(--color-muted)]">
              We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Name" required />
            <Input label="Email" type="email" required />
            <Textarea label="Message" required />
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
