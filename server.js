import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const apiKey = process.env.OPENAI_API_KEY;

// Only error if trying to use OpenAI without key, but don't crash entire app startup immediately
// to allow for basic health checks if needed, though strictly we need the key for the chat.
if (!apiKey) {
    console.warn('WARNING: OPENAI_API_KEY is not defined.');
}

const openai = new OpenAI({ apiKey: apiKey || 'dummy' });

// Tool Definition for OpenAI
const tools = [
    {
        type: "function",
        function: {
            name: "generateFinalReport",
            description: "Gera o Dossiê Final e o Roadmap de 4 Meses. Chamar APÓS capturar Nome, Email, Whats E dados financeiros.",
            parameters: {
                type: "object",
                properties: {
                    userName: { type: "string", description: "O nome do usuário." },
                    userWhatsapp: { type: "string", description: "O WhatsApp do usuário." },
                    userEmail: { type: "string", description: "O email do usuário." },
                    currentIncome: { type: "string", description: "Renda mensal atual." },
                    financialGoal: { type: "string", description: "Meta de faturamento mensal." },
                    ticketPrice: { type: "string", description: "Preço do ticket (ou 'A Definir')." },
                    stage: { type: "string", description: "Estágio atual (ex: 'Iniciante')." },
                    executiveSummary: { type: "string", description: "Resumo executivo curto e impactante." },
                    strengths: {
                        type: "array",
                        items: { type: "string" },
                        description: "3 pontos fortes do negócio atual."
                    },
                    weaknesses: {
                        type: "array",
                        items: { type: "string" },
                        description: "3 pontos fracos que impedem a escala."
                    },
                    blindSpots: {
                        type: "array",
                        items: { type: "string" },
                        description: "3 a 5 pontos cegos (erros não óbvios)."
                    },
                    pillarScores: {
                        type: "object",
                        description: "Notas de 0 a 100 para os pilares do negócio",
                        properties: {
                            traffic: { type: "number", description: "Nota de Tráfego/Aquisição" },
                            sales: { type: "number", description: "Nota de Vendas/Conversão" },
                            product: { type: "number", description: "Nota de Produto/Oferta" },
                            management: { type: "number", description: "Nota de Gestão/Processos" }
                        },
                        required: ["traffic", "sales", "product", "management"]
                    },
                    correctionPlan: {
                        type: "array",
                        items: { type: "string" },
                        description: "Plano de Correção Imediata (3 a 5 itens)."
                    },
                    roadmap: {
                        type: "array",
                        description: "Plano de 4 meses focado em atingir R$ 50k/mês.",
                        items: {
                            type: "object",
                            properties: {
                                month: { type: "string" },
                                title: { type: "string" },
                                focus: { type: "string" },
                                actions: { type: "array", items: { type: "string" } }
                            }
                        }
                    },
                    implementationList: {
                        type: "array",
                        items: { type: "string" },
                        description: "6 entregáveis práticos que a MentorFlow vai instalar."
                    }
                },
                required: [
                    "userName", "userWhatsapp", "userEmail", "currentIncome", "financialGoal",
                    "stage", "executiveSummary", "strengths", "weaknesses", "blindSpots", "pillarScores", "correctionPlan", "roadmap", "implementationList"
                ]
            }
        }
    }
];

// API Route for Chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Convert frontend message history to OpenAI format
        const messages = history.map((msg) => ({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.text
        }));

        // Add current user message
        messages.push({ role: 'user', content: message });

        // Check if system instruction is passed from client
        if (req.body.systemInstruction) {
            messages.unshift({ role: 'system', content: req.body.systemInstruction });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: messages,
            tools: tools,
            tool_choice: "auto",
            temperature: 0.7,
        });

        const choice = response.choices[0];
        const messageContent = choice.message.content;
        const toolCalls = choice.message.tool_calls;

        res.json({
            text: messageContent,
            toolCalls: toolCalls
        });

    } catch (error) {
        console.error('Error in /api/chat:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Serve static files in production - ONLY if not running as a Vercel function
// Vercel handles static files automatically via the 'public' folder or build output
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

// Only listen if run directly (node server.js), not when imported
// Or if we are in development mode independently of how it's run
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    // Check if we are not being imported by another module (like Vercel's wrapper)
    // For Vercel, we just export the app.
    // Ideally we'd use `if (import.meta.url === pathToFileURL(process.argv[1]).href)` but that needs imports.
    // Simplest for now: if not VERCEL, listen.
    const server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });

    // Prevent EADDRINUSE errors in watch mode if needed, though node --watch handles restart process usually
}

export default app;
