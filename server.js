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
if (!apiKey) {
    console.error('CRITICAL ERROR: OPENAI_API_KEY is not defined in .env.local');
    process.exit(1);
}

const openai = new OpenAI({ apiKey });

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

        // Add System Instruction as the first message
        const systemInstruction = `
        VOCÊ É UM MENTOR DE ELITE DE NEGÓCIOS DIGITAIS E CONSULTOR ESTRATÉGICO SÊNIOR.
        SEU NOME É MENTORFLOW IA.
        SUA MISSÃO: DIAGNOSTICAR O MOMENTO DO ESPECIALISTA E VENDER A MENTORIA "MENTORFLOW".
        
        ... (Resto das instruções do sistema serão passadas pelo frontend ou hardcoded aqui, 
        mas por segurança e limpeza, vou importar de constants ou receber do body, 
        mas a melhor prática é manter no backend ou receber do client se for dinâmico. 
        Vou assumir que o client manda ou vou botar um placeholder aqui e o client manda na primeira msg como system).
        
        Para simplificar, vou aceitar que o "systemInstruction" venha no body ou vou usar um default aqui.
    `;

        // Check if system instruction is passed from client (it was in the Gemini implementation plan)
        // If client sends it, use it. Otherwise use default.
        if (req.body.systemInstruction) {
            messages.unshift({ role: 'system', content: req.body.systemInstruction });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o", // Or "gpt-3.5-turbo" if preferred for cost
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

// Serve static files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
