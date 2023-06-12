const Category = require('../models/prodCatModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbID } = require('../utils/validateMongodbID');

//Crear categoria
const createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

//Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a category
const getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const category = await Category.findById(id);
    if (!category)
      throw new Error('No existe Categoria de producto con esta ID');
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

//Get categories
const getCategories = asyncHandler(async (req, res) => {
  try {
    const category = await Category.find();
    res.json(category);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
  getCategories,
};
