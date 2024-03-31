import { body, validationResult } from "express-validator";
const validate = (validations) => {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() });
    };
};
const loginValidators = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password should contain at least 6 characters"),
];
const signUpValidators = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidators
];
const chatCompletionValidators = [
    body("message").notEmpty().withMessage("Message is required"),
];
export { validate, signUpValidators, loginValidators, chatCompletionValidators };
//# sourceMappingURL=validators.js.map