import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Configuración del transporte de correo
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: "iglesiacefed@gmail.com", // Tu correo
    pass: "29juliofeenDios", // Contraseña de aplicación
  },
});

// Ruta para enviar correos
router.post("/contact", async (req, res) => {
  const { nombre, telefono, correo, mensaje } = req.body;

  // Validar que los campos requeridos estén presentes
  if (!nombre || !correo || !mensaje) {
    return res.status(400).json({ message: "Por favor, completa todos los campos requeridos" });
  }

  try {
    // Configuración del mensaje
    const mailOptions = {
      from: correo,
      to: "iglesiacefed@gmail.com",
      subject: "Nuevo mensaje de contacto",
      text: `Nombre: ${nombre}\nTeléfono: ${telefono || "No proporcionado"}\nMensaje: ${mensaje}`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ message: "Error al enviar el correo", error: error.message });
  }
});

export default router;
