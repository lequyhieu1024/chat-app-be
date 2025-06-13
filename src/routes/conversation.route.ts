import express from "express";
import { getConversations } from "../controllers/conversation.controller";

const router = express.Router();

router.get('/', getConversations);

export default router