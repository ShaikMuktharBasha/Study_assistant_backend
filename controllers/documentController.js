const fs = require('fs');
const pdfParse = require('pdf-parse');
const Document = require('../models/Document');
const { chunkText } = require('../utils/chunking');
const { generateSummary, generateQuiz, chatWithDocument } = require('../utils/gemini');

exports.uploadDocument = async (req, res) => {
  try {
    console.log('Upload request received');
    const file = req.file;
    let content = '';

    if (file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(file.path);
      const data = await pdfParse(dataBuffer);
      content = data.text;
    } else {
      content = fs.readFileSync(file.path, 'utf8');
    }

    const chunks = chunkText(content);
    const document = new Document({
      user: req.user.id,
      filename: file.originalname,
      content,
      chunks
    });
    await document.save();

    fs.unlinkSync(file.path);
    res.status(201).json({ message: 'Document uploaded', documentId: document._id });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getDocuments = async (req, res) => {
  try {
    console.log('Get documents for user:', req.user.id);
    const documents = await Document.find({ user: req.user.id });
    console.log('Found documents:', documents.length);
    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.summarizeDocument = async (req, res) => {
  try {
    console.log('Summarize request for doc:', req.params.id);
    const document = await Document.findById(req.params.id);
    if (!document || document.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const summary = await generateSummary(document.content);
    res.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document || document.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const quiz = await generateQuiz(document.content);
    res.json({ quiz });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.chatWithDocument = async (req, res) => {
  try {
    const { question } = req.body;
    const document = await Document.findById(req.params.id);
    if (!document || document.user.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Document not found' });
    }
    const answer = await chatWithDocument(question, document.chunks);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};