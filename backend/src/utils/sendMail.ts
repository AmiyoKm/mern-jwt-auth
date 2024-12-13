import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

type Params = {
    to : string;
    subject : string;
    html : string;
    text : string;
}

const getFromEmail = ()=>{
 return   NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER
}
const getToEmail =(to : string)=>{
    return NODE_ENV === "development" ? "delivered@resend.dev" : to
}
export const sendMail =async ({to , subject , text , html} : Params)=>{
    return await resend.emails.send({
        from : getFromEmail(),
        to : getToEmail(to),
        subject,
        text,
        html
    })
}