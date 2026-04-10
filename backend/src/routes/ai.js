import { Router } from 'express';
import OpenAI from 'openai';
import multer from 'multer';
import fs from 'fs';
import dotenv from 'dotenv';
import { verifyToken } from '../middleware/authMiddleware.js';
import { adminDb } from '../firebase/admin.js';
import {
  CV_OPTIMIZER_PROMPT,
  LINKEDIN_OPTIMIZER_PROMPT,
  SKILL_GAP_PROMPT,
} from '../prompts.js';

dotenv.config();

const router = Router();
const upload = multer({ dest: 'uploads/' });

// ─── OpenAI lazy init ─────────────────────────────────────────
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set in backend/.env');
  return new OpenAI({ apiKey });
};

// ─── Credits helper ───────────────────────────────────────────
async function checkAndDeductCredit(uid) {
  const userRef = adminDb.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw { status: 404, code: 'USER_NOT_FOUND', message: 'User profile not found' };
  }

  const userData = userDoc.data();
  const credits = userData.credits ?? 0;

  if (credits <= 0) {
    throw {
      status: 403,
      code: 'NO_CREDITS',
      message: 'You have no credits remaining. Please upgrade your plan.',
    };
  }

  // Decrement credit
  await userRef.update({ credits: credits - 1 });

  return { creditsRemaining: credits - 1, userData };
}

// ─── File text extraction ─────────────────────────────────────
async function extractTextFromFile(file) {
  const buffer = fs.readFileSync(file.path);

  try {
    if (file.mimetype === 'application/pdf' || file.originalname?.endsWith('.pdf')) {
      const { PDFParse } = await import('pdf-parse');
      const data = await PDFParse(buffer);
      return data.text;
    }

    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname?.endsWith('.docx')
    ) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    // Plain text fallback
    return buffer.toString('utf-8');
  } catch (parseErr) {
    console.error('File parsing error:', parseErr.message);
    throw new Error('Failed to extract text from uploaded file. Please paste your CV text instead.');
  } finally {
    // Cleanup uploaded file
    fs.unlink(file.path, () => {});
  }
}

// ════════════════════════════════════════════════════════════════
// ROUTES — all protected by verifyToken
// ════════════════════════════════════════════════════════════════

// ─── POST /api/ai/generate-cv ─────────────────────────────────
router.post('/generate-cv', verifyToken, upload.single('cvFile'), async (req, res) => {
  try {
    const { targetRole, targetCountry } = req.body;
    let cvText = req.body.cvText || '';

    // If a file was uploaded, extract text from it
    if (req.file) {
      const extractedText = await extractTextFromFile(req.file);
      cvText = extractedText || cvText;
    }

    if (!cvText.trim()) {
      return res.status(400).json({ error: 'Please provide CV text or upload a file.' });
    }

    // Check & deduct credit
    const { creditsRemaining } = await checkAndDeductCredit(req.user.uid);

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: CV_OPTIMIZER_PROMPT },
        {
          role: 'user',
          content: `Target Role: ${targetRole || 'General Professional'}\nTarget Country: ${targetCountry || 'GCC'}\n\nOriginal CV:\n${cvText}`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      result: response.choices[0].message.content,
      creditsRemaining,
    });
  } catch (error) {
    if (error.code === 'NO_CREDITS' || error.code === 'USER_NOT_FOUND') {
      return res.status(error.status).json({ error: error.message, code: error.code });
    }
    console.error('generate-cv error:', error.message);
    res.status(500).json({ error: 'Failed to generate CV' });
  }
});

// ─── POST /api/ai/optimize-linkedin ──────────────────────────
router.post('/optimize-linkedin', verifyToken, async (req, res) => {
  try {
    const { headline, role, careerGoal, targetCountry } = req.body;

    // Check & deduct credit
    const { creditsRemaining } = await checkAndDeductCredit(req.user.uid);

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: LINKEDIN_OPTIMIZER_PROMPT },
        {
          role: 'user',
          content: `Current Headline: ${headline}\nCurrent Role: ${role}\nCareer Goal: ${careerGoal}\nTarget Country: ${targetCountry}`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      result: response.choices[0].message.content,
      creditsRemaining,
    });
  } catch (error) {
    if (error.code === 'NO_CREDITS' || error.code === 'USER_NOT_FOUND') {
      return res.status(error.status).json({ error: error.message, code: error.code });
    }
    console.error('optimize-linkedin error:', error.message);
    res.status(500).json({ error: 'Failed to optimize LinkedIn profile' });
  }
});

// ─── POST /api/ai/skill-gap ───────────────────────────────────
router.post('/skill-gap', verifyToken, async (req, res) => {
  try {
    const { currentSkills, targetRole, targetCountry } = req.body;

    // Check & deduct credit
    const { creditsRemaining } = await checkAndDeductCredit(req.user.uid);

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SKILL_GAP_PROMPT },
        {
          role: 'user',
          content: `Current Skills: ${currentSkills}\nTarget Role: ${targetRole}\nTarget Country: ${targetCountry}`,
        },
      ],
      temperature: 0.7,
    });

    res.json({
      result: response.choices[0].message.content,
      creditsRemaining,
    });
  } catch (error) {
    if (error.code === 'NO_CREDITS' || error.code === 'USER_NOT_FOUND') {
      return res.status(error.status).json({ error: error.message, code: error.code });
    }
    console.error('skill-gap error:', error.message);
    res.status(500).json({ error: 'Failed to analyze skill gap' });
  }
});

export default router;
