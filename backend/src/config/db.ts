import mongoose  from "mongoose";
import { MONGO_URI } from "../constants/env";

const connectDB = async ()=>{
    try {
       await mongoose.connect(MONGO_URI )
       console.log(`Connected to the database`);
       
    }
        catch (error) {
        console.log(`Coudn't connect to the database `)
        process.exit(1)
    }
}
export default connectDB;