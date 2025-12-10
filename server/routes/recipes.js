const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized' });
};

// Save a recipe to user's favorites
router.post('/save', isAuthenticated, [
    body('recipeId').isMongoId().withMessage('Invalid recipe ID'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { recipeId } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.favoriteRecipes.includes(recipeId)) {
            return res.status(400).json({ message: 'Recipe already saved' });
        }

        user.favoriteRecipes.push(recipeId);
        await user.save();
        return res.status(200).json({ message: 'Recipe saved successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Get user's favorite recipes
router.get('/favorites', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favoriteRecipes');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user.favoriteRecipes);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;