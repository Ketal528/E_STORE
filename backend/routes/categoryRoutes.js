const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");


// @route GET /api/category
// @dece Get all category
// @access public
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/admin/categories
// @dece create category
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
    try {
        const { name, description } = req.body;

        // 1. Validation
        if (!name || !description) {
            return res.status(400).json({ message: "Please add all fields" });
        }

        // 2. Check if category exists
        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }

        // 3. Create category
        // req.user._id is available thanks to the 'protect' middleware
        const newCategory = new Category({
            name,
            description,
            user: req.user._id,
        });

        const createdCategory = await newCategory.save();
        res.status(201).json(createdCategory);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error: " + error.message });
    }
});

// @route Delete /api/admin/categories
// @dece delete category
// @access Private/Admin
router.delete("/:id", protect, admin, async(req, res) =>{
    try {
          const category = await Category.findById(req.params.id);
          
          if(category){
            await category.deleteOne();
            res.json({ message: "category Deleted Successfully"});
          } else {
            res.status(404).json({message: "category not found"});
          }
          
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Server Error"});
        }
});

module.exports = router; 