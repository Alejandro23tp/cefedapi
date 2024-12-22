import express from "express"; // Importa Express
import multer from "multer"; // Importa Multer
import path from "path"; // Para manejar rutas
import cors from "cors"; // Importa CORS
import media_routes from "./routes/media_routes.js";
import events_routes from "./routes/events_routes.js";

const app = express();

// Permitir CORS para todos los orígenes y métodos
app.use(cors({
  origin: "*", // Permitir todos los orígenes
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Cabeceras permitidas
  credentials: true // Permitir cookies si es necesario
}));

app.use(express.json()); // Interpreta los objetos enviados como JSON

// Servir archivos estáticos de las carpetas de imágenes y videos
app.use("/uploads/images", express.static(path.resolve("uploads/images")));
app.use("/uploads/videos", express.static(path.resolve("uploads/videos")));

// Rutas de medios (imágenes y videos)
app.use("/api", media_routes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

// Rutas de eventos
app.use("/api", events_routes);

// Crear el directorio para las imágenes de eventos
app.use("/uploads/images/events", express.static(path.resolve("uploads/images/events")));

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Página no encontrada" });
});

export default app;
