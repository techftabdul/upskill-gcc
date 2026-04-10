import { Router } from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { adminDb } from '../firebase/admin.js';

const router = Router();

// ════════════════════════════════════════════════════════════════
// GET /api/history — Fetch user's AI generations
// Query params:  ?limit=20  (default 50, max 100)
// ════════════════════════════════════════════════════════════════
router.get('/', verifyToken, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);

    const snapshot = await adminDb
      .collection('ai_generations')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const generations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp → ISO string for JSON serialization
      createdAt: doc.data().createdAt?.toDate?.().toISOString() || null,
    }));

    res.json({ generations });
  } catch (error) {
    console.error('history GET error:', error.message);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// ════════════════════════════════════════════════════════════════
// DELETE /api/history/:id — Delete a single generation
// ════════════════════════════════════════════════════════════════
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const docRef = adminDb.collection('ai_generations').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Generation not found' });
    }

    // Ensure the user owns this document
    if (doc.data().userId !== req.user.uid) {
      return res.status(403).json({ error: 'You do not own this generation' });
    }

    await docRef.delete();
    res.json({ success: true });
  } catch (error) {
    console.error('history DELETE error:', error.message);
    res.status(500).json({ error: 'Failed to delete generation' });
  }
});

export default router;
