import { SYSTEM_INSTRUCTION } from "../constants";

// Define response type that matches what the backend returns
interface AIResponse {
    text?: string;
    toolCalls?: any[];
    options?: string[]; // Parsed from text if present
}

export const sendMessageToAI = async (message: string, history: any[]) => {
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                history,
                systemInstruction: SYSTEM_INSTRUCTION
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.statusText}`);
        }

        const data = await response.json();

        // Check for tool calls
        if (data.toolCalls && data.toolCalls.length > 0) {
            const call = data.toolCalls[0];

            // Handle generateFinalReport
            // OpenAI tool calls have `function` property with `name` and `arguments` (string)
            if (call.function.name === "generateFinalReport") {
                const args = JSON.parse(call.function.arguments);
                return {
                    text: "Compilando dados financeiros e estruturando plano estratégico...",
                    toolCall: {
                        type: "generateFinalReport",
                        data: args
                    },
                    options: undefined
                };
            }
        }

        // Normal text response
        const rawText = data.text || "";
        const parsed = parseResponse(rawText);

        return {
            text: parsed.text,
            toolCall: null,
            options: parsed.options
        };

    } catch (error) {
        console.error("AI Service Error:", error);
        return {
            text: "Erro de conexão com o servidor. Verifique se o backend está rodando.",
            toolCall: null,
            options: undefined
        };
    }
};

const parseResponse = (text: string) => {
    const optionsRegex = /<<<OPTIONS:([\s\S]*?)>>>/;
    const match = text.match(optionsRegex);
    let options: string[] | undefined = undefined;
    let cleanText = text;

    if (match) {
        // Extract options split by pipe |
        options = match[1].split('|').map(o => o.trim());
        // Remove the tag from the visible text
        cleanText = text.replace(match[0], '').trim();
    }

    return { text: cleanText, options };
};
