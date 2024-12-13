import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http";
import { z } from "zod";
import AppError from "../utils/AppError";
import { clearAuthCookies, REFRESH_PATH } from "../utils/cookies";

const handleZodError = (res: Response, err: z.ZodError) => {
    const errors = err.issues.map((e)=>({
        path : e.path.join('.'),
        message : e.message
    }))
    return res.status(BAD_REQUEST).json({
        message : err.message,
        errors
    })
}
const handleAppError = (res: Response, err: AppError) => {
    return res.status(err.statusCode).json({
        message : err.message,
        errorCode : err.errorCode
    })
}


const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.error(`PATH: ${req.path}`, error);

    if(req.path=== REFRESH_PATH){
        clearAuthCookies(res)
    }

    if(error instanceof z.ZodError){
         handleZodError(res,error)
         return
    }
    if(error instanceof AppError){
         handleAppError(res,error)
         return
    }

     res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error");
};

export default errorHandler;