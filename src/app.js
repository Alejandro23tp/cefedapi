import express from "express";
import cors from "cors";
import path from "path";
import mediaRoutes from "./routes/media_routes.js";
import eventsRoutes from "./routes/events_routes.js";  // Asegúrate de importar correctamente las rutas de eventos

import contactRoutes from "./routes/contact_routes.js"; // Importa las rutas de contacto


const app = express();

// Configuración de CORS para permitir múltiples orígenes
const corsOptions = {
  origin: ["http://localhost:4200", "https://cefedapi-arpx.onrender.com.","http://localhost:8000", "https://cefed.vercel.app"],  // Añadir ambos orígenes aquí
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  allowedHeaders: ["Content-Type", "Authorization"],  // Encabezados permitidos
};

app.use(cors(corsOptions));  // Aplicar configuración de CORS

// Para manejar los datos JSON
app.use(express.json());

// Servir archivos estáticos de imágenes y videos
app.use("/uploads/images", express.static(path.resolve("uploads/images")));
app.use("/uploads/videos", express.static(path.resolve("uploads/videos")));

// Rutas de medios (imágenes y videos)
app.use("/api", mediaRoutes);
app.use("/api", eventsRoutes); // Rutas de eventos

// Ruta principal
app.get("/", (req, res) => {
  res.send("Hola desde el servidor");
});

// Agrega las rutas al servidor
app.use("/api", contactRoutes);


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Página no encontrada" });
});



export default app;
