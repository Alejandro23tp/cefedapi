import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

// Configuración de Multer para manejar imágenes y videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    // Guardar imágenes en la carpeta 'uploads/images' y videos en 'uploads/videos'
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      cb(null, "uploads/images");
    } else if (ext === ".mp4") {
      cb(null, "uploads/videos");
    } else {
      cb(new Error("Formato de archivo no permitido"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Middleware de Multer
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpg|jpeg|png|webp|mp4/;
    const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes (.jpg, .jpeg, .png, .webp) o videos (.mp4)"));
    }
  },
});

// Crear un archivo multimedia (imagen o video)
router.post("/media", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No se ha subido ningún archivo" });
  }
  res.status(201).json({
    message: "Archivo subido exitosamente",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Obtener todas las imágenes y videos
router.get("/media", (req, res) => {
  const imagesDir = path.resolve("uploads/images");
  const videosDir = path.resolve("uploads/videos");

  const media = { images: [], videos: [] };

  fs.readdir(imagesDir, (err, files) => {
    if (!err) {
      media.images = files.map((file) => `/uploads/images/${file}`);
    }

    fs.readdir(videosDir, (err, files) => {
      if (!err) {
        media.videos = files.map((file) => `/uploads/videos/${file}`);
      }

      res.status(200).json(media);
    });
  });
});

// Obtener un archivo multimedia por nombre
router.get("/media/:type/:nombre", (req, res) => {
  const { type, nombre } = req.params;

  const folder = type === "images" ? "uploads/images" : type === "videos" ? "uploads/videos" : null;

  if (!folder) {
    return res.status(400).json({ message: "Tipo de archivo no válido" });
  }

  const filePath = path.resolve(folder, nombre);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: "Archivo no encontrado" });
  }
});

// Actualizar un archivo multimedia (reemplazarlo)
router.put("/media/:type/:nombre", upload.single("file"), (req, res) => {
  const { type, nombre } = req.params;

  const folder = type === "images" ? "uploads/images" : type === "videos" ? "uploads/videos" : null;

  if (!folder) {
    return res.status(400).json({ message: "Tipo de archivo no válido" });
  }

  const oldFilePath = path.resolve(folder, nombre);

  if (!fs.existsSync(oldFilePath)) {
    return res.status(404).json({ message: "Archivo no encontrado para actualizar" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No se ha subido ningún nuevo archivo" });
  }

  // Eliminar el archivo antiguo
  fs.unlinkSync(oldFilePath);

  res.status(200).json({
    message: "Archivo actualizado exitosamente",
    filePath: `/uploads/${req.file.filename}`,
  });
});

// Eliminar un archivo multimedia
router.delete("/media/:type/:nombre", (req, res) => {
  const { type, nombre } = req.params;

  const folder = type === "images" ? "uploads/images" : type === "videos" ? "uploads/videos" : null;

  if (!folder) {
    return res.status(400).json({ message: "Tipo de archivo no válido" });
  }

  const filePath = path.resolve(folder, nombre);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Archivo no encontrado" });
  }

  // Eliminar el archivo
  fs.unlinkSync(filePath);

  res.status(200).json({ message: "Archivo eliminado exitosamente" });
});

export default router;
