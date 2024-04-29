import express from 'express';
import Mosque from '../models/mosque.model.js';

const router = express.Router();

// GET /api/mosques
router.get('/', async (req, res) => {
  try {
    const mosques = await Mosque.find();
    res.json(mosques);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// POST /api/mosques
router.post('/', async (req, res) => {
  try {
    const { name, address, contact } = req.body;
    const newMosque = new Mosque({ name, address, contact });
    await newMosque.save();
    res.status(201).json(newMosque);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const mosque = await Mosque.findById(id);
      if (!mosque)
        return res.status(404).json({ msg: "No mosque found with that ID" });
      res.json(mosque);
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
  });

export default router;