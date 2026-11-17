"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { contactSchema, type ContactInput } from "@/features/contact/contact.schema";

type Status = "idle" | "success" | "error" | "rateLimited" | "unavailable";

type FieldName = keyof ContactInput;

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const submit = async (values: ContactInput) => {
    setStatus("idle");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypot.current?.value ?? "",
          startedAt: startedAt.current,
        }),
      });

      if (response.ok) {
        reset();
        startedAt.current = Date.now();
        setStatus("success");
      } else if (response.status === 429) setStatus("rateLimited");
      else if (response.status === 503) setStatus("unavailable");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const errorText = (field: FieldName) => {
    const key = errors[field]?.message;
    return key ? t(`errors.${key}` as "errors.nameRequired") : null;
  };

  if (status === "success") {
    return (
      <div role="status" className="rounded-lg border border-border bg-secondary p-8">
        <CheckCircle2 aria-hidden="true" className="size-8 text-success" />
        <p className="mt-4 text-lg leading-relaxed">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => void handleSubmit(submit)(event)} noValidate className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="name" label={t("name")} error={errorText("name")} required>
          <Input
            id="name"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field id="email" label={t("email")} error={errorText("email")} required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>
      <Field id="subject" label={t("subject")} error={errorText("subject")}>
        <Input
          id="subject"
          placeholder={t("subjectPlaceholder")}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          {...register("subject")}
        />
      </Field>
      <Field id="message" label={t("message")} error={errorText("message")} required>
        <Textarea
          id="message"
          rows={7}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* Honeypot chống spam: ẩn với người dùng và trình đọc màn hình. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input ref={honeypot} id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status !== "idle" ? (
        <p role="alert" className="rounded-md border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {t(status)}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 aria-hidden="true" className="animate-spin" /> : null}
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error: string | null;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-accent">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
