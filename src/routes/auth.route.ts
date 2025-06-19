import express from "express";
import {login, logout, me, register, updateProfile} from "../controllers/auth.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {upload} from "../libs/multer";

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

router.use(authMiddleware)
router.get('/me', me);
router.post('/update-profile',upload.single('avatar'), updateProfile);

export default router