// routes/chatRoutes.js
import express from 'express';
import { postChat } from '../controllers/tanya.controller.js';

const router = express.Router();

router.post('/chat', postChat);

export default router;
