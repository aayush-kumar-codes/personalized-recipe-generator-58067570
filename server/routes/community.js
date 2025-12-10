const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe'); // Assuming Recipe model is defined in models/Recipe.js
const { body, validationResult } = require('express-validator');

// POST route for submitting a new recipe
router.post('/submit', [
    body('title').notEmpty().withMessage('Title is required'),
    body('ingredients').isArray().withMessage('Ingredients must be an array'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('author').notEmpty().withMessage('Author is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, instructions, author } = req.body;

    try {
        const newRecipe = new Recipe({
            title,
            ingredients,
            instructions,
            author,
            createdAt: new Date()
        });

        await newRecipe.save();
        res.status(201).json({ message: 'Recipe submitted successfully', recipe: newRecipe });
    } catch (error) {
        console.error('Error submitting recipe:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;