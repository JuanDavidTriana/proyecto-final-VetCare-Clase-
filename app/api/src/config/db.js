import mongoose from "mongoose";

export async function connectDB(uri) {
    mongoose.connection.on("connected", () =>  console.log("Conectado a la base de datos"));
    mongoose.connection.on("error", (err) => console.error("Error de conexión a la base de datos: ", err));
    mongoose.connection.on("disconnected", () => console.warn("Desconectado de la base de datos"));

    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 }); 
}

export function dbStatus() {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    return states[mongoose.connection.readyState];
}