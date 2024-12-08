import axios from "axios";

const api = axios.create({
    baseURL: "https://api.groq.com/openai/v1/chat/completions",
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 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",
    },
});

export default api;
