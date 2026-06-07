import OpenAI from "openai";
import {directions} from "./directions";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

class Openai {
    public getCompletion = async (prompt: string) => {
        const completion = await client.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 2500,
        });
        return completion.choices[0].text;
    }

    public getDirectionsFromText = async (text: string) => {
        const condition = `У тебя есть следующие направления: ${directions.join(", ")}
        Определи четко дублируя названия данных тебе направлений и дай ответ в формате массива с двойными ковычками.
        К каким из 3 данных направлениям больше всего относится следующий текст:`;

        let prompt = condition + text;
        prompt = prompt.replace(/\n/g, " ").replace(/\t/g, " ").replace(/\s+/g, " ");
        if (prompt.length > 2048) {
            prompt = prompt.slice(0, 3048);
        }

        const completion = await client.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 500,
            echo: false,
        });

        let result: any = completion.choices[0].text;
        if (!result) return [];

        result = result.replace(/\n/g, " ").replace(/\t/g, " ").replace(/\s+/g, " ");
        result = result.replace(/'/g, '"');
        result = result.slice(result.indexOf("["), result.lastIndexOf("]") + 1);
        result = JSON.parse(result);
        return result.filter((item: string) => directions.includes(item));
    }

    public getDeadlineFromText = async (text: string) => {
        const condition = `Твоя задача вытащить из текста дедлайн в ISO формате, если даты нет то напиши False.
        Исходя из условия проанализируй следующий текст: `;

        let prompt = condition + text;
        prompt = prompt.replace(/\n/g, " ").replace(/\t/g, " ").replace(/\s+/g, " ");
        if (prompt.length > 2048) {
            prompt = prompt.slice(0, 3048);
        }

        const completion = await client.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 500,
            echo: false,
        });

        const result: any = completion.choices[0].text;
        if (!result) throw new Error("Не удалось распознать дедлайн");
        return new Date(result);
    }
}

const openai = new Openai();
export default openai;
