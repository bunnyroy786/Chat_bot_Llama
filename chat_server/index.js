import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "url";
import cors from "cors";
import {LlamaModel, LlamaContext, LlamaChatSession} from "node-llama-cpp";





const app = express();
const server = createServer(app);

app.use(
    cors({
        origin: '*'
    })
)
const io = new Server(server, {
    cors:{
        origin: '*'
    }
});

const PORT = process.env.PORT || 8080;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
    modelPath: path.join(__dirname, "model", "notus-7b-v1.Q4_K_M.gguf")
});
const context = new LlamaContext({model});
const session = new LlamaChatSession({context});

io.on("connection" , (soc)=>{
    console.log("there is new connection on");
    console.log(soc.id);
    soc.on("message", async (msg) =>{
        try {
            const bot_reply = await session.prompt(msg);
            
            soc.emit("response", bot_reply);
          } catch (error) {
            console.error("Error generating bot reply:", error);
            // Optionally, send an error message back to the client
            soc.emit("error", "An error occurred while processing your message.");
          }
    });
});



server.listen(PORT, ()=>{
    console.log("Server is started on %d" , PORT);
});