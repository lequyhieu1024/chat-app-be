import express from "express";
import {getMessages, postMessage} from "../controllers/message.controller";

const router = express.Router();

router.get('/:id', getMessages)
router.post('/:id', postMessage)

export default router