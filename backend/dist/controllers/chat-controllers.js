import userModel from "../models/user-model.js";
import { configureOpenAI } from "../config/openai-config.js";
import { OpenAIApi } from "openai";
export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        }
        const chats = user.chats.map(({ role, content }) => ({ role, content }));
        chats.push({ content: message, role: 'user' });
        user.chats.push({ content: message, role: "user" });
        const config = configureOpenAI();
        const openai = new OpenAIApi(config);
        const chatResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: chats
        });
        user.chats.push(chatResponse.data.choices[0].message);
        await user.save();
        return res.status(200).json({ chats: user.chats });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const sendChatsToUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        }
        return res.status(200).json({ message: "OK", chats: user.chats });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
export const deleteChats = async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).json({ message: "User not registered or Token malfunctioned" });
        }
        //@ts-ignore
        user.chats = [];
        await user.save();
        return res.status(200).json({ message: "OK" });
    }
    catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
};
//# sourceMappingURL=chat-controllers.js.map