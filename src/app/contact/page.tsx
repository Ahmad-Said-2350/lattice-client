"use client";

import { useState } from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export default function ContactPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container-pad py-12">
      <div className="max-w-2xl">
        <p className="section-label">Contact</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">
          Talk with the Lattice team
        </h1>
        <p className="mt-3 text-muted">
          Partnerships, listing help, or product feedback — we read every note.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div id="support" className="space-y-4">
          {[
            {
              icon: <FiMail className="text-accent" />,
              label: "Email",
              value: "hello@lattice.app",
              href: "mailto:hello@lattice.app",
            },
            {
              icon: <FiPhone className="text-accent" />,
              label: "Phone",
              value: "+1 (415) 555-0190",
              href: "tel:+14155550190",
            },
            {
              icon: <FiMapPin className="text-accent" />,
              label: "Office",
              value: "448 Market Street, Suite 210\nSan Francisco, CA 94111",
            },
          ].map((item) => (
            <div key={item.label} className="panel p-5">
              <p className="inline-flex items-center gap-2 text-sm font-medium">
                {item.icon} {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-2 block whitespace-pre-line text-sm text-muted hover:text-ink"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-2 whitespace-pre-line text-sm text-muted">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>

        <form
          className="panel p-6"
          onSubmit={(event) => {
            event.preventDefault();
            setOpen(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <input required className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input type="email" required className="input-field" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Subject</label>
            <input required className="input-field" />
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium">Message</label>
            <textarea required rows={6} className="input-field min-h-[140px]" />
          </div>
          <Button type="submit" className="mt-5">
            Send message
          </Button>
        </form>
      </div>

      <Modal
        open={open}
        title="Message received"
        description="Thanks for reaching out to Lattice."
        onClose={() => setOpen(false)}
        footer={
          <Button onClick={() => setOpen(false)}>Close</Button>
        }
      >
        <p className="text-sm leading-relaxed text-muted">
          Our team typically replies within one business day.
        </p>
      </Modal>
    </div>
  );
}
