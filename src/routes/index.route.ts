import express from "express";
import userRoute from "./conversation.route";
import messageRoute from "./message.route";
import authRoute from "./auth.route";
import {authMiddleware} from "../middlewares/auth.middleware";
import friendRoute from "./friend.route";
const router = express.Router();

router.use('/auth', authRoute)
router.use(authMiddleware);
router.use('/conversations', userRoute)
router.use('/messages', messageRoute)
router.use('/friends', friendRoute)

export default router