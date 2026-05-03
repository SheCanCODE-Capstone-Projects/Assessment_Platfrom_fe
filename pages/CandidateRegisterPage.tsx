import {
  useState,
  useRef,
  useCallback,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  type DragEvent,
} from "react";
import { useRouter } from "next/router";

import Navbar from "@/src/components/layout/Navbar";
import Button from "@/src/components/ui/Button";

const LANGUAGE_OPTIONS = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "TypeScript",
  "C#",
  "PHP",
] as const;

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  preferredLanguage: string;
};

type FormErrors = FormValues & { idPhoto: string };

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function validatePhoto(file: File | null): string {
  if (!file) return "National ID or Passport photo is required.";
  if (!ACCEPTED_TYPES.includes(file.type))
    return "Only JPG, JPEG, or PNG files are accepted.";
  if (file.size > MAX_SIZE_BYTES) return "File size must not exceed 2 MB.";
  return "";
}

type FormFieldProps = {
  id: string;
  label: string;
  error: string;
  children: ReactNode;
};

const INITIAL_FORM: FormValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  preferredLanguage: "",
};

const INITIAL_ERRORS: FormErrors = {
  fullName: "",
  email: "",
  phoneNumber: "",
  preferredLanguage: "",
  idPhoto: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormField({ id, label, error, children }: FormFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-medium text-[#0f172a]"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function inputClasses(hasError: boolean) {
  return [
    "h-11 w-full rounded-lg border bg-white px-4 text-base text-slate-900 outline-none transition",
    "placeholder:text-slate-400 focus:ring-4",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
      : "border-zinc-300 focus:border-emerald-500 focus:ring-emerald-500/10",
  ].join(" ");
}

const STEPS = ["Assessment Details", "Personal Information"] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((label, i) => {
        const stepNum = i + 1;
        const isCompleted = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition",
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isActive
                    ? "bg-[#0f172a] text-white"
                    : "bg-zinc-200 text-zinc-500",
                ].join(" ")}
              >
                {isCompleted ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m5 12 5 5L20 7" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={[
                  "text-[11px] font-medium whitespace-nowrap",
                  isActive ? "text-[#0f172a]" : "text-slate-400",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={[
                  "h-px flex-1 mx-2 mb-4 transition",
                  isCompleted ? "bg-emerald-500" : "bg-zinc-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [idPhoto, setIdPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPhoto = useCallback((file: File) => {
    const error = validatePhoto(file);
    if (error) {
      setErrors((c) => ({ ...c, idPhoto: error }));
      return;
    }
    setIdPhoto(file);
    setErrors((c) => ({ ...c, idPhoto: "" }));
    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) applyPhoto(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) applyPhoto(file);
  }

  function removePhoto() {
    setIdPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validateField(name: keyof FormValues, value: string) {
    const trimmed = value.trim();
    if (!trimmed) return "This field is required.";
    if (name === "email" && !emailPattern.test(trimmed))
      return "Please enter a valid email address.";
    return "";
  }

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    const fieldName = name as keyof FormValues;
    setFormValues((c) => ({ ...c, [fieldName]: value }));
    setErrors((c) => ({ ...c, [fieldName]: validateField(fieldName, value) }));
  }

  function handleNextStep() {
    const photoError = validatePhoto(idPhoto);
    setErrors((c) => ({ ...c, idPhoto: photoError }));
    if (photoError) return;
    setStep(2);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      fullName: validateField("fullName", formValues.fullName),
      email: validateField("email", formValues.email),
      phoneNumber: validateField("phoneNumber", formValues.phoneNumber),
      preferredLanguage: validateField("preferredLanguage", formValues.preferredLanguage),
      idPhoto: validatePhoto(idPhoto),
    };

    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "candidateRegistration",
        JSON.stringify({
          fullName: formValues.fullName.trim(),
          preferredLanguage: formValues.preferredLanguage.trim(),
          idPhoto: photoPreview,
        })
      );
    }

    setShowSuccess(true);
    setTimeout(() => void router.push("/instructions"), 1500);
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar right={<span aria-hidden="true" />} />

      {showSuccess && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-white border border-zinc-200 px-5 py-3 shadow-xl">
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="m5 12 5 5L20 7" />
          </svg>
          <p className="text-[13px] font-semibold text-zinc-900">Information saved successfully!</p>
        </div>
      )}

      <main className="px-4 py-10 sm:px-6 sm:py-14">
        <section className="mx-auto w-full max-w-[610px] rounded-xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">

          <StepIndicator current={step} />

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              <header>
                <h1 className="text-[28px] font-bold tracking-tight text-[#0f172a] sm:text-[30px]">
                  Developer Assessment
                </h1>
                <p className="mt-3 text-[15px] leading-7 text-slate-600">
                  This assessment tests your programming skills. You will select your preferred language in the next step.
                </p>
              </header>

              <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                <h2 className="text-[15px] font-semibold text-[#0f172a]">
                  Assessment Details
                </h2>
                <ul className="mt-3 space-y-2 text-[14px] leading-7 text-slate-800">
                  <li>&bull; Duration: 60 minutes</li>
                  <li>&bull; Number of Questions: 3</li>
                  <li>&bull; Pass Mark: 70%</li>
                </ul>
              </section>

              <div className="mt-8">
                <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                  Upload National ID / Passport Photo *
                </label>
                <p className="mb-3 text-[13px] text-slate-500">
                  Upload a clear photo of your National ID or Passport for identity verification.
                </p>

                {photoPreview ? (
                  <div className="flex items-start gap-4 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                    <img
                      src={photoPreview}
                      alt="ID preview"
                      className="h-24 w-36 rounded-md object-cover border border-zinc-200 shadow-sm shrink-0"
                    />
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800">
                        Document uploaded
                      </p>
                      <p className="text-[13px] text-slate-500 truncate">
                        {idPhoto?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {idPhoto ? (idPhoto.size / 1024).toFixed(1) : 0} KB
                      </p>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="mt-1 text-xs font-medium text-red-500 hover:text-red-700 text-left"
                      >
                        Remove &amp; re-upload
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={[
                      "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-10 cursor-pointer transition",
                      isDragging
                        ? "border-emerald-500 bg-emerald-50"
                        : errors.idPhoto
                        ? "border-red-300 bg-red-50/30"
                        : "border-zinc-300 bg-zinc-50 hover:border-emerald-400 hover:bg-emerald-50/30",
                    ].join(" ")}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M3 9h18" />
                      <path d="M8 4v5" />
                      <path d="M16 4v5" />
                    </svg>
                    <p className="text-sm font-medium text-slate-700">
                      Drag &amp; drop or{" "}
                      <span className="text-emerald-600 underline">click to upload</span>
                    </p>
                    <p className="text-xs text-slate-400">
                      National ID or Passport &bull; JPG, JPEG, PNG &bull; Max 2 MB
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  aria-label="Upload National ID or Passport photo"
                />

                {errors.idPhoto ? (
                  <p className="mt-2 text-sm text-red-600">{errors.idPhoto}</p>
                ) : null}
              </div>

              <Button
                type="button"
                tone="green"
                size="lg"
                onClick={handleNextStep}
                className="mt-8 h-12 w-full rounded-lg bg-[#1ec28b] text-base font-semibold hover:bg-[#18af7d]"
              >
                Next: Personal Information →
              </Button>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <header className="mb-7">
                <h2 className="text-[22px] font-bold tracking-tight text-[#0f172a]">
                  Personal Information
                </h2>
                <p className="mt-1 text-[14px] text-slate-500">
                  Fill in your details to complete registration.
                </p>
              </header>

              <div className="space-y-6">
                <FormField id="fullName" label="Full Name *" error={errors.fullName}>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formValues.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className={inputClasses(Boolean(errors.fullName))}
                  />
                </FormField>

                <FormField id="email" label="Email Address *" error={errors.email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    autoComplete="email"
                    className={inputClasses(Boolean(errors.email))}
                  />
                </FormField>

                <FormField id="phoneNumber" label="Phone Number *" error={errors.phoneNumber}>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formValues.phoneNumber}
                    onChange={handleChange}
                    placeholder="+(250) 7XX XXX XXX"
                    autoComplete="tel"
                    className={inputClasses(Boolean(errors.phoneNumber))}
                  />
                </FormField>

                <FormField
                  id="preferredLanguage"
                  label="Preferred Programming Language *"
                  error={errors.preferredLanguage}
                >
                  <div className="relative">
                    <select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formValues.preferredLanguage}
                      onChange={handleChange}
                      className={[inputClasses(Boolean(errors.preferredLanguage)), "appearance-none pr-10"].join(" ")}
                    >
                      <option value="">Select a programming language</option>
                      {LANGUAGE_OPTIONS.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                        <path d="m5 7.5 5 5 5-5" />
                      </svg>
                    </span>
                  </div>
                </FormField>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  type="button"
                  tone="zinc"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="h-12 w-full rounded-lg text-base font-semibold"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  tone="green"
                  size="lg"
                  className="h-12 w-full rounded-lg bg-[#1ec28b] text-base font-semibold hover:bg-[#18af7d]"
                >
                  Continue to Instructions
                </Button>
              </div>
            </form>
          )}

        </section>
      </main>
    </div>
  );
}
