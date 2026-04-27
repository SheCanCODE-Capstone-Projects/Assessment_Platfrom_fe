import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
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

type FormErrors = FormValues;

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

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<FormValues>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);

  function validateField(name: keyof FormValues, value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return "This field is required.";
    }

    if (name === "email" && !emailPattern.test(trimmedValue)) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;
    const fieldName = name as keyof FormValues;

    setFormValues((current) => ({
      ...current,
      [fieldName]: value,
    }));

    setErrors((current) => ({
      ...current,
      [fieldName]: validateField(fieldName, value),
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      fullName: validateField("fullName", formValues.fullName),
      email: validateField("email", formValues.email),
      phoneNumber: validateField("phoneNumber", formValues.phoneNumber),
      preferredLanguage: validateField(
        "preferredLanguage",
        formValues.preferredLanguage
      ),
    };

    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) {
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(
        "candidateRegistration",
        JSON.stringify({
          fullName: formValues.fullName.trim(),
          preferredLanguage: formValues.preferredLanguage.trim(),
        })
      );
    }

    void router.push("/instructions");
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar right={<span aria-hidden="true" />} />

      <main className="px-4 py-12 sm:px-6 sm:py-14">
        <section className="mx-auto w-full max-w-[610px] rounded-xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
          <header>
            <h1 className="text-[30px] font-bold tracking-tight text-[#0f172a] sm:text-[32px]">
              JavaScript Developer Assessment
            </h1>
            <p className="mt-3 text-[15px] leading-7 text-slate-600">
              This assessment tests your fundamental JavaScript programming
              skills.
            </p>
          </header>

          <section className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
            <h2 className="text-[16px] font-semibold text-[#0f172a]">
              Assessment Details:
            </h2>
            <ul className="mt-4 space-y-2 text-[15px] leading-7 text-slate-800">
              <li>&bull; Duration: 60 minutes</li>
              <li>&bull; Number of Questions: 3</li>
              <li>&bull; Pass Mark: 70%</li>
            </ul>
          </section>

          <form onSubmit={handleSubmit} className="mt-9">
            <h2 className="text-[17px] font-semibold text-[#0f172a]">
              Personal Information
            </h2>

            <div className="mt-7 space-y-6">
              <FormField
                id="fullName"
                label="Full Name *"
                error={errors.fullName}
              >
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

              <FormField
                id="email"
                label="Email Address *"
                error={errors.email}
              >
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

              <FormField
                id="phoneNumber"
                label="Phone Number *"
                error={errors.phoneNumber}
              >
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
                    className={[
                      inputClasses(Boolean(errors.preferredLanguage)),
                      "appearance-none pr-10",
                    ].join(" ")}
                  >
                    <option value="">Select a programming language</option>
                    {LANGUAGE_OPTIONS.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      aria-hidden="true"
                    >
                      <path d="m5 7.5 5 5 5-5" />
                    </svg>
                  </span>
                </div>
              </FormField>
            </div>

            <Button
              type="submit"
              tone="green"
              size="lg"
              className="mt-6 h-12 w-full rounded-lg bg-[#1ec28b] text-base font-semibold hover:bg-[#18af7d]"
            >
              Continue to Instructions
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
