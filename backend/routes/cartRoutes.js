const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by user Id or guest id
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId: guestId });
  }
  return null;
};

// @route POST /api/cart
// @dece Add a product to the cart for a guest or logged in user
// @access public
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ massage: "Product Not found" });

    // Determine if the user is logged in or guest
    let cart = await getCart(userId, guestId);

    // if the cart exists, update it
    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color,
      );

      if (productIndex > -1) {
        // if the product already exists, update the quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // add new product
        cart.products.push({
          productId,
          name: product.name,
          image: product.images[0].url,
          price: product.price,
          size,
          color,
          quantity,
        });
      }

      //   Recalculate the total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );

      await cart.save();
      return res.status(200).json(cart);
    } else {
      // create a new cart for the guest or user
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(),
        products: [
          {
            productId,
            name: product.name,
            image: product.images[0].url,
            price: product.price,
            size,
            color,
            quantity,
          },
        ],
        totalPrice: product.price * quantity,
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("server Error");
  }
});

// @route PUT /api/cart
// @dece Update product quantity in the cart for a guest or logged-in user
// @access public
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body || {};

  // console.log("Searching for - User:", userId, "Guest:", guestId);

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(400).json({ massage: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color,
    );

    if (productIndex > -1) {
      // update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(200).json({ massage: "Product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("server Error");
  }
});

// @route DELETE /api/cart
// @dece remove product from the cart
// @access public
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);

    if (!cart) return res.status(404).json("Product not found");

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color,
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0,
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ massage: "product not found in cart" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ massage: "SServer error" });
  }
});

// @route GET /api/cart
// @dece Get looged-in user's or guest user's cart
// @access public
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ massage: "cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ massage: "server error" });
  }
});

// @route POST /api/cart/merge
// @dece merge guest cart into logged-in cart
// @access private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body || {};
  try {
    // find the guest cart and user cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "GuestCart is empty" });
      }

      // Check if userCart exists before trying to loop through products
      // This prevents the "Cannot read properties of null (reading 'products')" error
      if (userCart) {
        // merge guest card in to user cart
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color,
          );

          if (productIndex > -1) {
            // if the items exists in the user cart, update the quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // otherwise, add the guest item
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0,
        );
        await userCart.save();

        // remove the guest cart after merging
        try {
          await Cart.findOneAndDelete({ guestId });
        } catch (error) {
          console.error("Error deleting guest cart", error);
        }
        res.status(200).json(userCart);
      } else {
        // This part now runs correctly if the user had no existing cart
        // if the user has no existing cart, assign the guest cart to the user
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        res.status(200).json(guestCart);
      }
    } else {
      if (userCart) {
        //  guest cart has already been merged, retain user cart
        return res.status(200).json(userCart);
      }
      res.status(404).json({ message: "Guest cart not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
