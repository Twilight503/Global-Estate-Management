const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const dns = require("dns");

// Forțăm Node să prefere IPv4, ca să nu mai încerce Gmail pe IPv6 și să dea ENETUNREACH.
dns.setDefaultResultOrder("ipv4first");

const app = express();
const PORT = process.env.PORT || 3001;

/*
  CORS permisiv pentru test.
  După ce confirmăm că merge emailul, îl putem restrânge doar la site-ul tău.
*/
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

app.use(express.json());

/*
  Anti-spam simplu.
  30 cereri / 15 minute / IP.
*/
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      ok: false,
      message: "Prea multe cereri. Încearcă mai târziu.",
    },
  })
);

/*
  Upload poze:
  - exact 4 poze
  - max 5 MB / poză
  - doar imagini
*/
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 4,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    if (file.mimetype && file.mimetype.startsWith("image/")) {
      return callback(null, true);
    }

    return callback(new Error("Poți încărca doar imagini."));
  },
});

function clean(value) {
  return String(value || "").trim();
}

function escapeHtml(value) {
  return clean(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER sau EMAIL_PASS lipsesc din Environment Variables.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    tls: {
      servername: "smtp.gmail.com",
    },
  });
}

function getEmailErrorMessage(error) {
  const parts = [];

  if (error.message) parts.push(error.message);
  if (error.code) parts.push(`code=${error.code}`);
  if (error.responseCode) parts.push(`responseCode=${error.responseCode}`);
  if (error.command) parts.push(`command=${error.command}`);

  return parts.join(" | ") || "Eroare necunoscută la trimiterea emailului.";
}

/*
  Test simplu dacă serverul e online.
*/
app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Global Estate Network contact API",
    routes: ["/api/test-email", "/api/contact"],
  });
});

/*
  Dacă intri în browser pe /api/contact, browserul face GET.
  Formularul folosește POST.
*/
app.get("/api/contact", (req, res) => {
  res.json({
    ok: true,
    message: "Ruta există. Formularul trebuie să trimită POST aici, nu GET.",
  });
});

/*
  Test email FĂRĂ poze.
  Comandă:
  curl.exe -X POST "https://global-estate-management-email-api.onrender.com/api/test-email"
*/
app.post("/api/test-email", async (req, res) => {
  try {
    console.log("POST /api/test-email primit");
    console.log("EMAIL_USER exista:", Boolean(process.env.EMAIL_USER));
    console.log("EMAIL_PASS exista:", Boolean(process.env.EMAIL_PASS));
    console.log("TO_EMAIL:", process.env.TO_EMAIL || process.env.EMAIL_USER);

    const transporter = getTransporter();

    console.log("Incep trimiterea emailului de test...");

    await transporter.sendMail({
      from: `"Global Estate Website" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL || process.env.EMAIL_USER,
      subject: "Test email Global Estate",
      text: "Dacă ai primit acest email, backendul + Gmail SMTP funcționează.",
    });

    console.log("Email test trimis cu succes");

    return res.json({
      ok: true,
      message: "Emailul de test a fost trimis cu succes.",
    });
  } catch (error) {
    console.error("Test email error:", error);

    return res.status(500).json({
      ok: false,
      message: getEmailErrorMessage(error),
    });
  }
});

/*
  Formular real CU 4 poze.
*/
app.post("/api/contact", (req, res) => {
  console.log("POST /api/contact primit");

  const uploadPhotos = upload.array("poze", 4);

  uploadPhotos(req, res, async (uploadError) => {
    try {
      console.log("Upload procesat");

      if (uploadError) {
        console.error("Upload error:", uploadError);

        let message = uploadError.message || "Eroare la încărcarea pozelor.";

        if (uploadError.code === "LIMIT_FILE_SIZE") {
          message = "Una dintre poze depășește limita de 5 MB.";
        }

        if (uploadError.code === "LIMIT_FILE_COUNT") {
          message = "Poți încărca maximum 4 poze.";
        }

        return res.status(400).json({
          ok: false,
          message,
        });
      }

      const files = req.files || [];

      console.log("Numar poze primite:", files.length);

      if (files.length !== 4) {
        return res.status(400).json({
          ok: false,
          message: "Trebuie să adaugi exact 4 poze ale apartamentului.",
        });
      }

      const nume = clean(req.body.nume);
      const telefon = clean(req.body.telefon);
      const zona = clean(req.body.zona);
      const tipProprietate = clean(req.body.tip_proprietate);
      const detalii = clean(req.body.detalii);

      console.log("Date formular:", {
        nume,
        telefon,
        zona,
        tipProprietate,
        areDetalii: Boolean(detalii),
      });

      if (!nume || !telefon || !zona || !tipProprietate) {
        return res.status(400).json({
          ok: false,
          message: "Completează nume, telefon, zonă și tip proprietate.",
        });
      }

      const transporter = getTransporter();

      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h2>Lead nou - Administrare apartament</h2>

          <p><strong>Nume:</strong> ${escapeHtml(nume)}</p>
          <p><strong>Telefon:</strong> ${escapeHtml(telefon)}</p>
          <p><strong>Zona:</strong> ${escapeHtml(zona)}</p>
          <p><strong>Tip proprietate:</strong> ${escapeHtml(tipProprietate)}</p>

          <p><strong>Detalii:</strong></p>
          <div style="padding: 12px; background: #f3f4f6; border-radius: 8px;">
            ${escapeHtml(detalii).replaceAll("\n", "<br>")}
          </div>

          <hr style="margin: 24px 0; border: none; border-top: 1px solid #e5e7eb;">

          <p>Formular trimis de pe site-ul Global Estate Network.</p>
          <p>Pozele apartamentului sunt atașate acestui email.</p>
        </div>
      `;

      const attachments = files.map((file, index) => ({
        filename: `poza-${index + 1}-${file.originalname}`,
        content: file.buffer,
        contentType: file.mimetype,
      }));

      console.log("Incep trimiterea emailului cu poze...");

      await transporter.sendMail({
        from: `"Global Estate Website" <${process.env.EMAIL_USER}>`,
        to: process.env.TO_EMAIL || process.env.EMAIL_USER,
        subject: `Lead nou administrare apartament - ${zona}`,
        html,
        attachments,
      });

      console.log("Email cu poze trimis cu succes");

      return res.json({
        ok: true,
        message: "Cererea a fost trimisă cu succes.",
      });
    } catch (error) {
      console.error("Contact email error:", error);

      return res.status(500).json({
        ok: false,
        message: getEmailErrorMessage(error),
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});