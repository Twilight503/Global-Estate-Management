@'
from pathlib import Path
import re

path = Path("src/App.jsx")
text = path.read_text(encoding="utf-8")

endpoint_match = re.search(r'const FORMSPREE_ENDPOINT\s*=\s*"([^"]+)";', text)
endpoint = endpoint_match.group(1) if endpoint_match else "https://formspree.io/f/ID_UL_TAU_REAL"

lead_form = r'''function LeadForm() {
  const [status, setStatus] = useState("idle");
  const [photoCount, setPhotoCount] = useState(0);
  const [photoError, setPhotoError] = useState("");

  const FORMSPREE_ENDPOINT = "__ENDPOINT__";
  const MAX_FILE_SIZE_MB = 20;

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

    formData.append(
      "_subject",
      "Lead nou cu poze - Administrare apartament Global Estate Network"
    );

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        setPhotoCount(0);
        setPhotoError("");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 md:p-6"
    >
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-500">
          Cerere evaluare gratuită
        </p>

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
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Nume proprietar"
          required
        />

        <input
          name="telefon"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Telefon"
          required
        />

        <input
          name="zona"
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-950"
          placeholder="Zona apartamentului"
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
            Ideal: living, bucătărie, dormitor/cameră și baie.
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

            <span className="text-slate-400">
              Max. {MAX_FILE_SIZE_MB} MB / poză
            </span>
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
          Nu s-a putut trimite formularul. Verifică dimensiunea pozelor sau
          scrie-ne direct pe WhatsApp.
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Prin trimiterea formularului ești de acord să fii contactat pentru
        oferta de administrare proprietate.
      </p>
    </form>
  );
}
'''.replace("__ENDPOINT__", endpoint)

start = text.find("function LeadForm()")
end = text.find("export default function GlobalEstateNetworkLanding()")

if start == -1:
    raise SystemExit("Nu am găsit function LeadForm() în src/App.jsx")

if end == -1:
    raise SystemExit("Nu am găsit export default function GlobalEstateNetworkLanding() în src/App.jsx")

if end < start:
    raise SystemExit("Structura fișierului pare stricată: export default apare înainte de LeadForm")

new_text = text[:start] + lead_form + "\n\n" + text[end:]
path.write_text(new_text, encoding="utf-8")

print("LeadForm a fost înlocuit corect.")
print("Endpoint păstrat:", endpoint)
'@ | Set-Content fix_leadform.py -Encoding UTF8