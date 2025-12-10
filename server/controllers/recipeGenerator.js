const Recipe = require('../models/Recipe'); // Assuming a Recipe model exists
const Ingredient = require('../models/Ingredient'); // Assuming an Ingredient model exists

exports.generateRecipe = async (req, res) => {
    const { ingredients, dietaryPreferences } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients are required and must be an array.' });
    }

    try {
        const availableIngredients = await Ingredient.find({ name: { $in: ingredients } });

        if (availableIngredients.length === 0) {
            return res.status(404).json({ error: 'No matching ingredients found.' });
        }

        const recipes = await Recipe.find({
            ingredients: { $all: availableIngredients.map(ing => ing._id) },
            dietaryRestrictions: { $nin: dietaryPreferences }
        });

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found matching your criteria.' });
        }

        return res.status(200).json(recipes);
    } catch (error) {
        console.error('Error generating recipes:', error);
        return res.status(500).json({ error: 'An error occurred while generating recipes.' });
    }
};