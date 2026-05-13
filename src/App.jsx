import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Home,
  Wallet,
  Wrench,
  FileText,
  MessageCircle,
  Phone,
  CalendarCheck,
  ClipboardCheck,
  Star,
  MapPin,
  Mail,
} from "lucide-react";

const PHONE_DISPLAY = "0728 315 939";
const PHONE_LINK = "+40728315939";
const WHATSAPP_LINK = "40728315939";
const EMAIL = "globalestatesrl@gmail.com";

const BACKEND_ENDPOINT =
  import.meta.env.VITE_BACKEND_ENDPOINT ||
  "https://api.micrositeboss.com/api/contact";

const services = [
  {
    icon: KeyRound,
    title: "Găsim și verificăm chiriașul",
    description:
      "Promovăm apartamentul, organizăm vizionări și filtrăm chiriașii înainte de semnarea contractului.",
  },
  {
    icon: FileText,
    title: "Contract, inventar și predare",
    description:
      "Pregătim documentele, procesul-verbal, pozele de predare și evidența garanției.",
  },
  {
    icon: Wallet,
    title: "Urmărim chiria și utilitățile",
    description:
      "Verificăm lunar plata chiriei și a facturilor, ca tu să nu alergi după chiriaș.",
  },
  {
    icon: Wrench,
    title: "Coordonăm reparațiile",
    description:
      "Preluăm solicitările chiriașului și chemăm instalator, electrician sau meseriaș când este nevoie.",
  },
  {
    icon: ClipboardCheck,
    title: "Verificări periodice",
    description:
      "Putem verifica starea apartamentului și îți trimitem raport cu poze sau video.",
  },
  {
    icon: MessageCircle,
    title: "Comunicare cu chiriașul",
    description:
      "Chiriașul vorbește cu noi pentru problemele curente, nu te deranjează pe tine pentru fiecare detaliu.",
  },
];

const steps = [
  {
    number: "01",
    title: "Evaluăm apartamentul",
    description:
      "Stabilim chiria realistă, publicul potrivit și ce trebuie optimizat înainte de promovare.",
  },
  {
    number: "02",
    title: "Îl închiriem corect",
    description:
      "Facem prezentarea, promovarea, vizionările, selecția chiriașului și semnarea documentelor.",
  },
  {
    number: "03",
    title: "Administrăm lunar",
    description:
      "Monitorizăm chiria, utilitățile, solicitările chiriașului și eventualele intervenții tehnice.",
  },
  {
    number: "04",
    title: "Primești raport și bani",
    description:
      "Tu rămâi informat, iar apartamentul funcționează ca un venit cât mai pasiv.",
  },
];

const painPoints = [
  "Nu vrei să te sune chiriașul pentru orice problemă",
  "Ești plecat din București sau din țară",
  "Ai avut chiriași care au întârziat cu plata",
  "Vrei un apartament închiriat curat, legal și urmărit",
  "Nu ai timp de vizionări, contracte, facturi și reparații",
];

const pricing = [
  {
    name: "Închiriere",
    price: "50% din prima chirie",
    description: "Pentru proprietarii care vor doar găsirea unui chiriaș bun.",
    features: ["Promovare", "Vizionări", "Filtrare chiriași", "Contract și predare"],
    highlighted: false,
  },
  {
    name: "Administrare Basic",
    price: "10% lunar",
    description: "Pentru apartamente deja închiriate sau închiriate prin noi.",
    features: [
      "Urmărire chirie",
      "Verificare utilități",
      "Comunicare chiriaș",
      "Coordonare reparații simple",
    ],
    highlighted: true,
  },
  {
    name: "Administrare Premium",
    price: "12–15% lunar",
    description: "Pentru proprietari care vor administrare completă și raportare detaliată.",
    features: [
      "Tot din Basic",
      "Verificări periodice",
      "Raport foto/video",
      "Coordonare curățenie și mentenanță",
    ],
    highlighted: false,
  },
];

const faqItems = [
  {
    question: "Cine încasează chiria?",
    answer:
      "Recomandarea noastră este ca plata chiriei să intre direct în contul proprietarului, iar comisionul de administrare să fie facturat separat. Putem discuta și variante personalizate.",
  },
  {
    question: "Vă ocupați și dacă există deja chiriaș?",
    answer:
      "Da. Putem prelua administrarea unui apartament deja închiriat, cu verificarea documentelor, a garanției și a situației utilităților.",
  },
  {
    question: "Ce se întâmplă dacă apare o reparație?",
    answer:
      "Preluăm solicitarea, cerem estimare de cost și coordonăm intervenția. Pentru costuri mici se poate stabili din contract un prag aprobat în avans.",
  },
  {
    question: "Pot renunța la serviciu?",
    answer:
      "Da, colaborarea se stabilește contractual, cu o perioadă de preaviz clară și predarea documentelor/situației la zi.",
  },
];

function PrimaryButton({ children, href = "#contact", variant = "dark", className = "" }) {
  const baseClass =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition";

  const variantClass =
    variant === "light"
      ? "border border-slate-200 bg-white text-slate-950 hover:border-slate-300 hover:bg-slate-50"
      : "bg-slate-950 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800";

  return (
    <a href={href} className={`${baseClass} ${variantClass} ${className}`}>
      {children}
    </a>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-lg leading-8 text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

function LeadForm() {
  const [status, setStatus] = useState("idle");
  const [photoCount, setPhotoCount] = useState(0);
  const [photoError, setPhotoError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const MAX_FILE_SIZE_MB = 5;

  function validatePhotos(files) {
    if (files.length !== 4) {
      return "Trebuie să adaugi exact 4 poze ale apartamentului.";
    }

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return "Poți încărca doar poze, nu PDF-uri sau alte fișiere.";
      }

      const sizeMb = file.size / 1024 / 1024;

      if (sizeMb > MAX_FILE_SIZE_MB) {
        return `Fiecare poză trebuie să aibă maximum ${MAX_FILE_SIZE_MB} MB.`;
      }
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setStatus("idle");
    setPhotoError("");
    setSubmitError("");

    const form = event.currentTarget;
    const photoInput = form.querySelector('input[name="poze"]');
    const files = photoInput ? Array.from(photoInput.files || []) : [];

    const validationMessage = validatePhotos(files);

    if (validationMessage) {
      setPhotoError(validationMessage);
      return;
    }

    setStatus("loading");

    const formData = new FormData(form);

    try {
      const response = await fetch(BACKEND_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (response.ok) {
        setStatus("success");
        setPhotoCount(0);
        setPhotoError("");
        setSubmitError("");
        form.reset();
      } else {
        setStatus("error");
        setSubmitError(
          data?.message ||
            "Nu s-a putut trimite formularul. Verifică pozele sau încearcă din nou."
        );
      }
    } catch (error) {
      console.error("Form submit error:", error);
      setStatus("error");
      setSubmitError(
        "Nu s-a putut conecta la server. Încearcă din nou sau scrie-ne direct pe WhatsApp."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 md:p-6"
    >
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-500">Cerere evaluare gratuită</p>

        <h3 className="mt-1 text-2xl font-bold text-slate-950">
          Ai un apartament de administrat?
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Lasă datele și adaugă 4 poze ale apartamentului. Te contactăm pentru o
          estimare realistă a chiriei și a pașilor următori.
        </p>
      </div>

      <div className="grid gap-3">
        <input
          name="nume"
          autoComplete="name"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Nume proprietar"
          required
        />

        <input
          type="tel"
          name="telefon"
          inputMode="tel"
          autoComplete="tel"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Număr de telefon"
          required
        />

        <input
          name="zona"
          autoComplete="street-address"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Adresa exactă a apartamentului"
          required
        />

        <select
          name="tip_proprietate"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-600 outline-none transition focus:border-slate-950"
          defaultValue=""
          required
        >
          <option value="" disabled>
            Tip proprietate
          </option>
          <option>Garsonieră</option>
          <option>Apartament 2 camere</option>
          <option>Apartament 3 camere</option>
          <option>Apartament 4+ camere</option>
          <option>Casă / vilă</option>
        </select>

        <textarea
          name="detalii"
          className="min-h-[96px] rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Detalii utile: mobilat, bloc nou, chiria dorită, dacă există deja chiriaș etc."
        />

        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <label className="block text-sm font-semibold text-slate-950">
            Adaugă exact 4 poze ale apartamentului
          </label>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Ideal: living, bucătărie, dormitor/cameră și baie. Fiecare poză
            trebuie să aibă maximum {MAX_FILE_SIZE_MB} MB.
          </p>

          <input
            type="file"
            name="poze"
            accept="image/*"
            multiple
            required
            onChange={(event) => {
              const files = Array.from(event.target.files || []);
              setPhotoCount(files.length);
              setPhotoError(validatePhotos(files));
              setSubmitError("");
            }}
            className="mt-3 block w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-slate-800"
          />

          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
            <span
              className={
                photoCount === 4
                  ? "font-semibold text-emerald-700"
                  : "text-slate-500"
              }
            >
              Poze selectate: {photoCount}/4
            </span>

            <span className="text-slate-400">Max. {MAX_FILE_SIZE_MB} MB / poză</span>
          </div>

          {photoError ? (
            <div className="mt-3 rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-800">
              {photoError}
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Se trimite..." : "Trimite oferta cu poze"}
        <ArrowRight className="h-4 w-4" />
      </button>

      {status === "success" ? (
        <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
          Cererea a fost trimisă. Te contactăm în cel mai scurt timp.
        </div>
      ) : null}

      {status === "error" ? (
        <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-800">
          {submitError ||
            "Nu s-a putut trimite formularul. Verifică dimensiunea pozelor sau scrie-ne direct pe WhatsApp."}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Prin trimiterea formularului ești de acord să fii contactat pentru oferta
        de administrare proprietate.
      </p>
    </form>
  );
}

export default function GlobalEstateNetworkLanding() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_LINK}?text=${encodeURIComponent(
    "Bună, am un apartament în București și vreau detalii despre administrare."
  )}`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-bold leading-none text-slate-950">Global Estate Network</p>
              <p className="mt-1 text-xs font-medium text-slate-500">Property Management București</p>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            <a href="#servicii" className="hover:text-slate-950">Servicii</a>
            <a href="#proces" className="hover:text-slate-950">Proces</a>
            <a href="#preturi" className="hover:text-slate-950">Prețuri</a>
            <a href="#faq" className="hover:text-slate-950">Întrebări</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <PrimaryButton variant="light" href={`tel:${PHONE_LINK}`}>
              <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
            </PrimaryButton>
            <PrimaryButton href="#contact">Cere ofertă</PrimaryButton>
          </div>
        </div>
      </header>

      <section id="top" className="relative overflow-hidden bg-white">
        <div className="absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-slate-100 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-8 md:py-24 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Administrare completă pentru apartamente închiriate
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-slate-950 md:text-6xl md:leading-[1.02]">
              Tu ai apartamentul. Noi ne ocupăm de chiriaș. Tu primești banii.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              Global Estate Network administrează apartamente în București pentru proprietari care vor chirie lunară fără telefoane, vizionări, facturi, reparații și stres cu chiriașii.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton href="#contact" className="text-base">
                Vreau evaluare gratuită <ArrowRight className="h-5 w-5" />
              </PrimaryButton>
              <PrimaryButton variant="light" href={whatsappUrl} className="text-base">
                <MessageCircle className="h-5 w-5" /> Scrie pe WhatsApp
              </PrimaryButton>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-1 gap-3 text-sm text-slate-600 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-950">10%</p>
                <p className="mt-1">administrare lunară de la</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-950">0 stres</p>
                <p className="mt-1">cu chiriașul și reparațiile</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-2xl font-bold text-slate-950">București</p>
                <p className="mt-1">apartamente și garsoniere</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-slate-200 to-white" />
              <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-sm text-slate-300">Raport proprietar</p>
                    <p className="mt-1 text-xl font-bold">Apartament 2 camere • București</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-500/15 px-3 py-2 text-sm font-semibold text-emerald-300">
                    Chirie încasată
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <div className="flex items-center justify-between rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Chirie</p>
                        <p className="mt-1 text-sm text-slate-300">Plată verificată lunar</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">600 €</p>
                  </div>

                  <div className="flex items-center justify-between rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Contract</p>
                        <p className="mt-1 text-sm text-slate-300">Documente și inventar la zi</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">OK</p>
                  </div>

                  <div className="flex items-center justify-between rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Mentenanță</p>
                        <p className="mt-1 text-sm text-slate-300">Solicitări rezolvate prin furnizori</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">1 intervenție</p>
                  </div>

                  <div className="flex items-center justify-between rounded-3xl bg-white/8 p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                        <CalendarCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">Verificare</p>
                        <p className="mt-1 text-sm text-slate-300">Raport foto/video la cerere</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white">Programat</p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-white p-5 text-slate-950">
                  <p className="text-sm font-semibold text-slate-500">Ce vede proprietarul</p>
                  <p className="mt-2 text-2xl font-bold">Un venit urmărit, nu o bătaie de cap.</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Raport clar, comunicare simplă și intervenții coordonate fără să pierzi timp cu detalii operaționale.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 py-6 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 md:flex-row md:items-center md:justify-between md:px-8">
          <p className="text-lg font-semibold">Ai apartamentul liber sau deja închiriat?</p>
          <p className="max-w-3xl text-sm leading-6 text-slate-300">
            Îl putem prelua de la zero sau putem administra chiriașul existent: chirie, utilități, comunicare, reparații și verificări.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Pentru cine este"
            title="Ideal pentru proprietari care vor chirie fără administrare zilnică"
            subtitle="Dacă apartamentul tău trebuie să producă bani, dar nu vrei să devii tu administrator, recepționer, instalator și recuperator de chirii, serviciul este pentru tine."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {painPoints.map((item) => (
              <Card key={item}>
                <CheckCircle2 className="mb-4 h-6 w-6 text-emerald-600" />
                <p className="text-sm font-semibold leading-6 text-slate-800">{item}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="servicii" className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Ce facem pentru tine"
            title="Administrăm apartamentul ca să nu mai fii prins între chiriaș, facturi și reparații"
            subtitle="Serviciul acoperă tot fluxul important: închiriere, documente, comunicare, verificări și coordonare lunară."
          />

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section id="proces" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Proces simplu"
            title="De la apartament liber la venit lunar urmărit"
            subtitle="Proprietarul trebuie să știe exact ce se întâmplă. De aceea lucrăm pe pași clari, fără promisiuni vagi."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number} className="relative overflow-hidden">
                <p className="absolute right-5 top-4 text-6xl font-black text-slate-100">{step.number}</p>
                <div className="relative">
                  <p className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-bold text-white">
                    {step.number}
                  </p>
                  <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 px-5 py-16 text-white md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Diferența importantă</p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
              Nu doar închiriem apartamentul. Îl urmărim după ce chiriașul s-a mutat.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Multe probleme apar după semnarea contractului: întârzieri, facturi, defecțiuni, discuții cu vecinii, verificări și schimbări de chiriaș. Acolo intervine administrarea reală.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/10">
              <Star className="mb-4 h-6 w-6 text-amber-300" />
              <h3 className="text-lg font-bold">Pentru proprietar</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Mai puține telefoane, mai mult control și o situație lunară clară.
              </p>
            </div>
            <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/10">
              <Star className="mb-4 h-6 w-6 text-amber-300" />
              <h3 className="text-lg font-bold">Pentru chiriaș</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Un punct de contact rapid când apare o problemă reală.
              </p>
            </div>
            <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/10">
              <Star className="mb-4 h-6 w-6 text-amber-300" />
              <h3 className="text-lg font-bold">Pentru apartament</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Verificări, inventar, poze și intervenții coordonate.
              </p>
            </div>
            <div className="rounded-3xl bg-white/8 p-6 ring-1 ring-white/10">
              <Star className="mb-4 h-6 w-6 text-amber-300" />
              <h3 className="text-lg font-bold">Pentru venit</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Chiria este urmărită, iar perioadele goale pot fi reduse prin reînchiriere rapidă.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="preturi" className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <SectionTitle
            eyebrow="Prețuri orientative"
            title="Pachete simple, ușor de înțeles"
            subtitle="Oferta finală depinde de zonă, chirie, starea apartamentului și nivelul de implicare dorit. Pentru testul de ads, mesajul trebuie să fie clar și direct."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-6 shadow-sm ${
                  plan.highlighted
                    ? "border-slate-950 bg-slate-950 text-white shadow-xl shadow-slate-900/20"
                    : "border-slate-200 bg-white text-slate-950"
                }`}
              >
                {plan.highlighted ? (
                  <div className="mb-5 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
                    Recomandat
                  </div>
                ) : null}

                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className={`mt-3 text-sm leading-6 ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>
                  {plan.description}
                </p>
                <p className="mt-6 text-4xl font-extrabold">{plan.price}</p>
                <p className={`mt-2 text-xs ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                  *Se poate stabili comision minim lunar în funcție de proprietate.
                </p>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className={`mt-0.5 h-5 w-5 ${plan.highlighted ? "text-emerald-300" : "text-emerald-600"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <PrimaryButton href="#contact" variant={plan.highlighted ? "light" : "dark"} className="mt-8 w-full">
                  Cere detalii
                </PrimaryButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-900/5 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Încredere</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Lucrăm cu documente, poze, raportare și reguli clare de la început.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Scopul nu este doar să găsim rapid un chiriaș, ci să protejăm apartamentul și să păstrăm relația proprietar–chiriaș controlată.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-800">Proces-verbal cu inventar</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-800">Contract și evidență documente</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <Wallet className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-800">Monitorizare plăți</p>
              </div>
              <div className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950 shadow-sm">
                  <MapPin className="h-6 w-6" />
                </div>
                <p className="font-semibold text-slate-800">Focus pe București și Ilfov</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-white px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-5xl">
          <SectionTitle
            eyebrow="Întrebări frecvente"
            title="Ce întreabă de obicei proprietarii înainte să înceapă"
          />

          <div className="mt-10 grid gap-4">
            {faqItems.map((item) => (
              <details key={item.question} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-950">
                  <div className="flex items-center justify-between gap-5">
                    {item.question}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 group-open:hidden">+</span>
                    <span className="hidden rounded-full bg-slate-950 px-3 py-1 text-sm text-white group-open:block">−</span>
                  </div>
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Vrei să vezi dacă apartamentul tău se potrivește pentru administrare?
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Trimite-ne adresa exactă, tipul apartamentului și chiria dorită. Îți spunem ce se poate obține realist și ce variantă de administrare are sens.
            </p>

            <div className="mt-8 grid gap-4">
              <a href={`tel:${PHONE_LINK}`} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Telefon</p>
                  <p className="font-bold text-slate-950">{PHONE_DISPLAY}</p>
                </div>
              </a>

              <a href={`mailto:${EMAIL}`} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-bold text-slate-950">{EMAIL}</p>
                </div>
              </a>

              <a href={whatsappUrl} className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">WhatsApp</p>
                  <p className="font-bold text-slate-950">Trimite mesaj rapid</p>
                </div>
              </a>
            </div>
          </div>

          <LeadForm />
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-bold text-slate-950">Global Estate Network</p>
            <p className="mt-1">Administrare apartamente închiriate • București & Ilfov</p>
          </div>
          <p>© {new Date().getFullYear()} Global Estate Network. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </main>
  );
}
