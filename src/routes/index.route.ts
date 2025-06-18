import express from "express";
import userRoute from "./conversation.route";
import messageRoute from "./message.route";
import authRoute from "./auth.route";
const router = express.Router();

router.use('/conversations', userRoute)
router.use('/messages', messageRoute)
router.use('/auth', authRoute)
export default router