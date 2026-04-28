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

type FormErrors = FormValues & { profilePhoto: string };

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

function validatePhoto(file: File | null): string {
  if (!file) return "Profile photo is required.";
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
  profilePhoto: "",
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
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyPhoto = useCallback((file: File) => {
    const error = validatePhoto(file);
    if (error) {
      setErrors((c) => ({ ...c, profilePhoto: error }));
      return;
    }
    setProfilePhoto(file);
    setErrors((c) => ({ ...c, profilePhoto: "" }));
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
    setProfilePhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
      profilePhoto: validatePhoto(profilePhoto),
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
          profilePhoto: photoPreview,
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
              {/* Profile Photo Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#0f172a]">
                  Upload Profile Photo *
                </label>

                {photoPreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-20 w-20 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                        {profilePhoto?.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {profilePhoto ? (profilePhoto.size / 1024).toFixed(1) : 0} KB
                      </p>
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="mt-1 text-xs font-medium text-red-500 hover:text-red-700 text-left"
                      >
                        Remove photo
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
                      "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 cursor-pointer transition",
                      isDragging
                        ? "border-emerald-500 bg-emerald-50"
                        : errors.profilePhoto
                        ? "border-red-300 bg-red-50/30"
                        : "border-zinc-300 bg-zinc-50 hover:border-emerald-400 hover:bg-emerald-50/30",
                    ].join(" ")}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-9 w-9 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d="M12 16V8m0 0-3 3m3-3 3 3" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                    <p className="text-sm font-medium text-slate-700">
                      Drag &amp; drop or{" "}
                      <span className="text-emerald-600 underline">click to upload</span>
                    </p>
                    <p className="text-xs text-slate-400">JPG, JPEG, PNG &bull; Max 2 MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  aria-label="Upload profile photo"
                />

                {errors.profilePhoto ? (
                  <p className="mt-2 text-sm text-red-600">{errors.profilePhoto}</p>
                ) : null}
              </div>

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
