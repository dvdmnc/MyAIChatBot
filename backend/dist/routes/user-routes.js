import { Router } from "express";
import { getAllUsers, userSignUp, userLogin, verifyUser, userLogout } from "../controllers/user-controllers.js";
import { validate, signUpValidators, loginValidators } from "../utils/validators.js";
import { verifyToken } from "../utils/token-manager.js";
const userRoutes = Router();
userRoutes.route('/').get(getAllUsers);
userRoutes.route('/signup').post(validate(signUpValidators), userSignUp);
userRoutes.route('/login').post(validate(loginValidators), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get('/logout', verifyToken, userLogout);
export default userRoutes;
//# sourceMappingURL=user-routes.js.map