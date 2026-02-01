const soundModel = require('../models/soundModel');

exports.logSound = async (req, res) => {
    try {
        const { userId, soundLabel, confidence, timestamp } = req.body;

        if (!userId || !soundLabel || !confidence) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newLog = await soundModel.createSoundLog(userId, soundLabel, confidence, timestamp || new Date());
        res.status(201).json({ message: 'Sound logged', log: newLog });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await soundModel.getSoundHistory(userId);
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};
