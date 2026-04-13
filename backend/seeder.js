const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");

const products = require("./data/products");

dotenv.config();

// connect to mongoDB
mongoose.connect(process.env.MONGO_URL);

// Function to seed data

const seedData = async () => {
    try {
        // clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        // Create a defult admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "admin123",
            role: "admin",
        });


        // assign the defult user Id to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: userID};
        });

        // Insert the products into the database
        await Product.insertMany(sampleProducts);

        console.log("projrct data seeded successfully!")
        process.exit();

    } catch (error) {
        console.error("Error seeding the data :", error);
        process.exit(1);        
    }
};

seedData();