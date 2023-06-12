const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbID } = require('../utils/validateMongodbID');

//Crear Brand
const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

//Update Brand
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deletedBrand = await Brand.findByIdAndDelete(id);
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a Brand
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      res.statusCode = 404;
      throw new Error('No existe marca de producto con esta ID');
    }
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

//Get Brands
const getBrands = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.find();
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getBrands,
};
