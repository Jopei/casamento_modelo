import { useState } from "react";
import { RsvpForm, type RsvpFormValues } from "../components/landing/RsvpForm";
import { submitRsvp } from "../api/rsvp";
import { useGuestAuth } from "../context/GuestAuthContext";

export function RsvpPage() {
  const { ensureIdentified } = useGuestAuth();
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpSubmit = async (values: RsvpFormValues) => {
    try {
      await ensureIdentified();
    } catch {
      // Convidado fechou o modal de identificacao sem se identificar.
      return;
    }

    await submitRsvp({
      attending: true,
      companions_count: values.companionsCount,
      message: values.message || undefined,
    });
    setRsvpSubmitted(true);
  };

  return <RsvpForm onSubmit={handleRsvpSubmit} submitted={rsvpSubmitted} />;
}
