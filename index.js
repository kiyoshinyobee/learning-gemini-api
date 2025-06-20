const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');


// get the config env
dotenv.config()

// init upload file
const uploadFile = multer({ dest: 'uploads/' });

// init express app
const mainApp = express();
mainApp.use(express.json());

// init Gemini AI
const aiAgent = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = aiAgent.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

// get file part
const getFileToGenerativePart = (filePath, mimeType) => ({
  inlineData: {
    data: fs.readFileSync(filePath).toString('base64'),
    mimeType: mimeType,
  },
});

// Route API: generate-text
mainApp.post('/generate-text', async (req, res) => {
  try {
    const { prompt } = req.body;
    const agentJob = await aiModel.generateContent(prompt);
    const agentResponse = await agentJob.response;
    res.json({ result: agentResponse.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route API: generate-from-image
mainApp.post('/generate-text-from-image', uploadFile.single('image'),  async (req, res) => {
  try {
    const { prompt } = req.body;
    const { path, mimetype } = req.file;
    const imageFile = getFileToGenerativePart(path, mimetype);
    const agentJob = await aiModel.generateContent([prompt, imageFile]);
    const agentResponse = await agentJob.response;
    res.json({ result: agentResponse.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(path);
  }
});

// Route API: generate-from-document
mainApp.post('/generate-text-from-document', uploadFile.single('file'),  async (req, res) => {
  try {
    const { prompt } = req.body;
    const { path, mimetype } = req.file;
    const docFile = getFileToGenerativePart(path, mimetype);
    const agentJob = await aiModel.generateContent([prompt, docFile]);
    const agentResponse = await agentJob.response;
    res.json({ result: agentResponse.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(path);
  }
});

// Route API: generate-from-audio
mainApp.post('/generate-text-from-audio', uploadFile.single('audio'),  async (req, res) => {
  try {
    const { prompt } = req.body;
    const { path, mimetype } = req.file;
    const audioFile = getFileToGenerativePart(path, mimetype);
    const agentJob = await aiModel.generateContent([prompt, audioFile]);
    const agentResponse = await agentJob.response;
    res.json({ result: agentResponse.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fs.unlinkSync(path);
  }
});

// running express app
const portApp = process.env.PORT;
mainApp.listen(portApp, () => {
  console.log(`Session 3 is running in PORT: ${portApp}`);
});
