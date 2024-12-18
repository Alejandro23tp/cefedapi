import express from "express"; // Importa Express
import multer from "multer"; // Importa Multer
import path from "path"; // Para manejar rutas
import cors from "cors"; // Importa CORS
import media_routes from "./routes/media_routes.js";

const app = express();
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json()); //interprete los objetos enviados como json

// Servir archivos estáticos de las carpetas de imágenes y videos
app.use("/uploads/images", express.static(path.resolve("uploads/images")));
app.use("/uploads/videos", express.static(path.resolve("uploads/videos")));

// Rutas de medios (imágenes y videos)
app.use("/api", media_routes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Página no encontrada" });
});

export default app;
