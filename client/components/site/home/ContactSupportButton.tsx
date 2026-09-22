"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { ContactModal } from "./ContactModal";
import type { ContactSource } from "@/features/contact";

interface ContactSupportButtonProps {
  label: string;
  source?: ContactSource;
}

/**
 * The only interactive part of the advice section.
 *
 * Keeping the modal state here lets the surrounding section stay a Server
 * Component, so its copy ships as HTML instead of client JS.
 */
export function ContactSupportButton({
  label,
  source = "home",
}: ContactSupportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
      >
        <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </button>

      <ContactModal isOpen={isOpen} onOpenChange={setIsOpen} source={source} />
    </>
  );
}

export default ContactSupportButton;
