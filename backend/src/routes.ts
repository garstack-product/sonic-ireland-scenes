import { Router } from 'express';
import { query } from './db';

const router = Router();

// Get all concert reviews
router.get('/reviews', async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Add a new concert review
router.post('/reviews', async (req, res) => {
  const { title, artist, venue, date, imageUrl, content } = req.body;
  
  try {
    const { rows } = await query(
      'INSERT INTO reviews (title, artist, venue, date, image_url, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, artist, venue, date, imageUrl, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;