
import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import SessionModel from "../model/session.model";
import appAssert from "../utils/appAsserts";
import catchErrors from "../utils/catchErrors";


export const getSessionHandler = catchErrors(
    async (req, res) => {
        const sessions = await SessionModel.find(
            { userId: req.userId, expiresAt: { $gt: new Date() } },
            { _id: 1, userAgent: 1, createdAt: 1, expiresAt: 1 },
            { sort: { createdAt: -1 } }
        )

        appAssert(sessions, NOT_FOUND, "No active sessions found")

        return res.status(OK).json(
            // mark the current session
            sessions.map((session) => ({
                ...session.toObject(),
                ...(session.id === req.sessionId && {
                    isCurrent: true,
                }),
            }))
        );
    });

export const deleteSessionHandler = catchErrors(
    async(req,res)=>{
        const sessionId = z.string().parse(req.params.id)

        const deleted = await SessionModel.findOneAndDelete({_id : sessionId , userId : req.userId})
        appAssert(deleted , NOT_FOUND , "Session not found")
        return res.status(OK).json({message : "Session Removed"})
    }
)