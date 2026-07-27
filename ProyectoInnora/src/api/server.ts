import http from "http";
import { router } from "./router";

const servidor = http.createServer((req, res) => {
    router(req, res);
});

servidor.listen(3000, () => {
    console.log("Servidor ejecutándose en http://localhost:3000");
});