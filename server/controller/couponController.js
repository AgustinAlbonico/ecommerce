const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const { validateMongodbID } = require('../utils/validateMongodbID');

//Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Update Coupon
const updateCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    res.json(deletedCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Get a Coupon
const getCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbID(id);
  try {
    const getCoupon = await Coupon.findById(id);
    res.json(getCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

//Get Coupons
const getCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCoupon,
  getCoupon,
  getCoupons,
  deleteCoupon,
  updateCoupon,
};
