import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

const connectToMongoDB = async () => {
    try {
        const mongoURI = process.env.MONGO_DB_URI;
        if (!mongoURI) {
            throw new Error("MONGO_DB_URI is not defined ");
        }

        await mongoose.connect(mongoURI);
        console.log("Connected to MONGODB");

      } catch (error) {
        console.error(`Error in connection of MONGODB: ${error.message}`);
    }
};

export default connectToMongoDB;
