import mongoose, { mongo } from "mongoose";

// Variable to check if mongoose is connected
let isConnected = false;


export const connectToDB = async () => {
    // To prevent unknown field queries, set strict
    mongoose.set('strictQuery',true);
    
    // we need url to connect to DB
    // If not found
    if(!process.env.MONGODB_URL){
        return console.log("MONGODB_URL not found");
    }
    // If already connected
    if(isConnected){
        return console.log("Already Connected to MongoDB");
    }
    // Try connecting to instance
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("ERROR - MongoDB connection failed.");
    }
}
