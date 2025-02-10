import express from 'express';
import { createEvent, getEvents } from '../controllers/eventController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/',protect, createEvent);
router.get('/', getEvents);

export default router;
