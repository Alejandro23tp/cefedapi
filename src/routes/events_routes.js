import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configuración de multer para las imágenes de eventos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Asegurarse de que el directorio exista en el servidor
    const dir = path.join(__dirname, "../../uploads/images/events");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Crear directorios si no existen
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Generar un nombre único para la imagen
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|webp/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (.jpg, .jpeg, .png, .webp)"));
    }
  },
});

// Modelo simple de eventos (en producción usarías una base de datos)
let events = [];

// Crear un evento
router.post("/events", upload.single("image"), (req, res) => {
  try {
    const { title, date, time, location, category, description } = req.body;

    const newEvent = {
      id: Date.now(),
      title,
      date,
      time,
      location,
      category,
      description,
      image: req.file ? `/uploads/images/events/${req.file.filename}` : null,
    };

    events.push(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error al crear el evento", error: error.message });
  }
});

// Obtener todos los eventos
router.get("/events", (req, res) => {
  res.status(200).json(events);
});

// Obtener un evento específico
router.get("/events/:id", (req, res) => {
  const event = events.find(e => e.id === parseInt(req.params.id));
  if (event) {
    res.status(200).json(event);
  } else {
    res.status(404).json({ message: "Evento no encontrado" });
  }
});

// Actualizar un evento
router.put("/events/:id", upload.single("image"), (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const { title, date, time, location, category, description } = req.body;
    const oldEvent = events[eventIndex];

    // Si hay una nueva imagen, eliminar la antigua
    if (req.file && oldEvent.image) {
      const oldImagePath = path.resolve(oldEvent.image.substr(1));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    events[eventIndex] = {
      ...oldEvent,
      title,
      date,
      time,
      location,
      category,
      description,
      image: req.file ? `/uploads/images/events/${req.file.filename}` : oldEvent.image,
    };

    res.status(200).json(events[eventIndex]);
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar el evento", error: error.message });
  }
});

// Eliminar un evento
router.delete("/events/:id", (req, res) => {
  const eventId = parseInt(req.params.id);
  const eventIndex = events.findIndex(e => e.id === eventId);

  if (eventIndex === -1) {
    return res.status(404).json({ message: "Evento no encontrado" });
  }

  const event = events[eventIndex];

  // Eliminar la imagen asociada si existe
  if (event.image) {
    const imagePath = path.resolve(event.image.substr(1));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  // Eliminar el evento
  events.splice(eventIndex, 1);
  res.status(200).json({ message: "Evento eliminado exitosamente" });
});

export default router;
