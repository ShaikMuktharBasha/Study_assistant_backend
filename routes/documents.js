const express = require('express');
const { uploadDocument, getDocuments, summarizeDocument, generateQuiz, chatWithDocument } = require('../controllers/documentController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/upload', auth, upload.single('file'), uploadDocument);
router.get('/', auth, getDocuments);
router.get('/:id/summarize', auth, summarizeDocument);
router.get('/:id/quiz', auth, generateQuiz);
router.post('/:id/chat', auth, chatWithDocument);

module.exports = router;