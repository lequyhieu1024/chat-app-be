import express from "express";
import userRoute from "./conversation.route";
import messageRoute from "./message.route";
const router = express.Router();

router.use('/conversations', userRoute)
router.use('/messages', messageRoute)

export default router