import "dotenv/config";
import express from "express";
import connectDB from "./config/db";
import cors from "cors";
import { APP_ORIGIN, NODE_ENV, PORT } from "./constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler";
import catchErrors from "./utils/catchErrors";
import { OK } from "./constants/http";
import authRoutes from "./routes/auth.route";
import authenticate from "./middleware/authenticate";
import userRouter from "./routes/user.route";
import sessionRouter from "./routes/session.route";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        origin: APP_ORIGIN,
        credentials: true,
    })
)
app.use(cookieParser())
app.get("/",(req, res ) => {

    
    res.status(OK).json({ status: "healthy", message: "Server is running" });
}) 
    
app.use("/api/v1/auth" , authRoutes)   
;

app.use("/api/v1/user" , authenticate , userRouter)
app.use("/api/v1/session" , authenticate , sessionRouter)


app.use(errorHandler)
app.listen(PORT , async()=>{
    await connectDB()
    console.log(`Server is running on port ${PORT} in ${NODE_ENV} environment`);
    
})

