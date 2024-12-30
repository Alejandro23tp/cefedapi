import express from "express";
import axios from "axios";

const router = express.Router();

// Token del bot de Telegram
const BOT_TOKEN = "8042342679:AAGEsMomZeQjPexBHdMiEaHVkNiVmQ2IbII";
// ID del chat o grupo donde se enviarán los mensajes
const CHAT_ID = "6838427759"; // Obtén esto escribiendo /start al bot en Telegram y usando el método getUpdates del API de Telegram

// Ruta para recibir mensajes del formulario
router.post("/telegram/contact", async (req, res) => {
  const { nombre, correo, telefono, mensaje } = req.body;

  if (!nombre || !correo || !telefono || !mensaje) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" });
  }

  // Construir el mensaje a enviar
  const text = `
  *Nuevo mensaje de contacto:*
  - *Nombre:* ${nombre}
  - *Correo:* ${correo}
  - *Teléfono:* ${telefono}
  - *Mensaje:* ${mensaje}
  `;

  try {
    // Enviar el mensaje al bot de Telegram
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: "Markdown", // Formato para texto enriquecido
    });

    res.status(200).json({ message: "Mensaje enviado correctamente a Telegram" });
  } catch (error) {
    console.error("Error al enviar mensaje a Telegram:", error.message);
    res.status(500).json({ message: "Error al enviar mensaje a Telegram", error: error.message });
  }
});

export default router;
