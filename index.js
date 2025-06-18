const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// get the config env
dotenv.config()

// init express app
const mainApp = express();
mainApp.use(express.json());

// init Gemini AI
const aiAgent = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = aiAgent.getGenerativeModel({ model: 'models/gemini-2.5-flash' });

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

// running express app
const portApp = process.env.PORT;
mainApp.listen(portApp, () => {
  console.log(`Session 3 is running in PORT: ${portApp}`);
});
