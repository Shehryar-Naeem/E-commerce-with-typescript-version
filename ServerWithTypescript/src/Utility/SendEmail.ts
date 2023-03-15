import nodemailer from "nodemailer"
interface MailOption{
    email:string,
    subject:string;
    message:string
}
const sendEamil=async (options:MailOption)=>{
    const transporter= nodemailer.createTransport({
        service:process.env.SMPT_SERVICE,
        auth:{
            user: process.env.SMPT_EMAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
    
    const mailOption={
        from:process.env.SMPT_EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    
    await transporter.sendMail(mailOption)
}

export default sendEamil