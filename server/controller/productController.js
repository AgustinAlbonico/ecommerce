const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const { validateMongodbID } = require('../utils/validateMongodbID');

//Create one product
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Update product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Delete produc
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
  } catch (error) {
    throw new Error(error);
  }
});

//Get one product
const getOneProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (error) {
    throw new Error(error);
  }
});

//Get all products
const getProducts = asyncHandler(async (req, res) => {
  try {
    //Filtro
    const queryObj = { ...req.query };
    const exludeFields = ['page', 'sort', 'limit', 'fields'];
    exludeFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    //Ordeno
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    //Limitando los campos
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    //Pagination
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) throw new Error('Esta pagina no existe');
    }

    const products = await query;
    res.json(products);
  } catch (error) {
    throw new Error(error);
  }
});

//Agregar cosas a la lista de deseo
const addToWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { prodId } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    if (alreadyAdded) {
      const user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: prodId },
        },
        { new: true }
      );
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: prodId },
        },
        {
          new: true,
        }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});

//Rating de un producto
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;
  validateMongodbID(_id);
  try {
    const prod = await Product.findById(prodId);
    if (!prod) res.json('No se encontro ningun producto').status(420);
    let alreadyRated = prod.ratings.find(
      (rating) => rating.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        { $set: { 'ratings.$.star': star, 'ratings.$.comment': comment } },
        { new: true }
      );
    } else {
      await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star,
              comment,
              postedby: _id,
            },
          },
        },
        {
          new: true,
        }
      );
    }
    const getallratings = await Product.findById(prodId);
    let totalRating = getallratings.ratings.length;
    let ratingsum = getallratings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingsum / totalRating);
    let finalproduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalrating: actualRating,
      },
      { new: true }
    );
    res.json(finalproduct);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getOneProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
};
