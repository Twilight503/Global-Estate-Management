const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const multer = require("multer");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

const STATIC_SITE_URL = "https://global-estate-management.onrender.com";

const allowedOrigins = [
  "http://localhost:5173",
  STATIC_SITE_URL,
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean),
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
      ok: false,
      message: "Prea multe cereri. Încearcă mai târziu.",
    },
  })
);

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

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Global Estate Network contact API",
  });
});

app.post("/api/contact", (req, res) => {
  const uploadPhotos = upload.array("poze", 4);

  uploadPhotos(req, res, async (uploadError) => {
    try {
      if (uploadError) {
        return res.status(400).json({
          ok: false,
          message: uploadError.message || "Eroare la încărcarea pozelor.",
        });
      }

      const files = req.files || [];

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

      if (!nume || !telefon || !zona || !tipProprietate) {
        return res.status(400).json({
          ok: false,
          message: "Completează nume, telefon, zonă și tip proprietate.",
        });
      }

      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return res.status(500).json({
          ok: false,
          message: "Emailul nu este configurat pe server.",
        });
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const html = `
        <h2>Lead nou - Administrare apartament</h2>

        <p><strong>Nume:</strong> ${escapeHtml(nume)}</p>
        <p><strong>Telefon:</strong> ${escapeHtml(telefon)}</p>
        <p><strong>Zona:</strong> ${escapeHtml(zona)}</p>
        <p><strong>Tip proprietate:</strong> ${escapeHtml(tipProprietate)}</p>
        <p><strong>Detalii:</strong><br>${escapeHtml(detalii).replaceAll("\n", "<br>")}</p>

        <hr>

        <p>Formular trimis de pe site-ul Global Estate Network.</p>
      `;

      const attachments = files.map((file, index) => ({
        filename: `poza-${index + 1}-${file.originalname}`,
        content: file.buffer,
        contentType: file.mimetype,
      }));

      await transporter.sendMail({
        from: `"Global Estate Website" <${process.env.EMAIL_USER}>`,
        to: process.env.TO_EMAIL || process.env.EMAIL_USER,
        subject: `Lead nou administrare apartament - ${zona}`,
        html,
        attachments,
      });

      return res.json({
        ok: true,
        message: "Cererea a fost trimisă cu succes.",
      });
    } catch (error) {
      console.error("Email error:", error);

      return res.status(500).json({
        ok: false,
        message: "Nu s-a putut trimite emailul.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});