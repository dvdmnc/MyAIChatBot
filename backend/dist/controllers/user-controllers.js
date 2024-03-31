import userModel from "../models/user-model.js";
import { hash, compare } from "bcrypt";
import { createToken } from "../utils/token-manager.js";
import { COOKIE_NAME } from "../utils/constants.js";
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({ msg: "OK", users });
    }
    catch (err) {
        return res.status(500).json({ msg: "ERROR", cause: err.message });
    }
};
export const userSignUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await userModel.findOne({ email: email });
        if (userExists) {
            return res.status(409).json({ msg: 'A user with this email already exists' });
        }
        const hashedPassword = await hash(password, 10);
        const user = await userModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ msg: "User created", name, email });
    }
    catch (err) {
        return res.status(500).json({ msg: "ERROR", cause: err.message });
    }
};
export const userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ msg: 'No User with this email' });
        }
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return res.status(403).json({ msg: 'Incorrect Password' });
        }
        res.clearCookie(COOKIE_NAME, { domain: "localhost", httpOnly: true, signed: true, path: '/' });
        const token = createToken(user._id.toString(), user.email, "7d");
        const expires = new Date();
        expires.setDate(expires.getDate() + 7);
        res.cookie(COOKIE_NAME, token, { path: '/', domain: "localhost", expires, httpOnly: true, signed: true });
        return res.status(200).json({ msg: 'You are logged in !', name: user.name, email: user.email });
    }
    catch (err) {
        return res.status(500).json({ msg: "ERROR", cause: err.message });
    }
};
export const verifyUser = async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR token malfunctioned");
        }
        return res.status(200).json({ msg: 'You are logged in !', name: user.name, email: user.email });
    }
    catch (err) {
        return res.status(500).json({ msg: "ERROR", cause: err.message });
    }
};
export const userLogout = async (req, res, next) => {
    try {
        const user = await userModel.findById(res.locals.jwtData.id);
        if (!user) {
            return res.status(401).send("User not registered OR token malfunctioned");
        }
        res.clearCookie(COOKIE_NAME, { domain: "localhost", httpOnly: true, signed: true, path: '/' });
        return res.status(200).json({ msg: 'You logged out successfully !' });
    }
    catch (err) {
        return res.status(500).json({ msg: "ERROR", cause: err.message });
    }
};
//# sourceMappingURL=user-controllers.js.map