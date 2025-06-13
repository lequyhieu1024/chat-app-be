import express from "express";
import {getMessages} from "../controllers/message.controller";

const router = express.Router();

router.use('/:id', getMessages)

export default router