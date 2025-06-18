const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// get the config env
dotenv.config()

// init express app
const mainApp = express();
mainApp.use(express.json());

// init generate Gemini AI
const geminiAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
