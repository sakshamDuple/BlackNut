const nodemailer = require("nodemailer");
const { EmailHTML } = require("./html");

exports.sendEmail = async (email, subject, text, details) => {
    try {
        // let HTML = EmailHTML(subject, text)
        let message
        let data
        console.log(email, subject, text)
        switch (subject) {
            case "new Password Created":
                message = `Your Request For New BlackNut Password Creation is processed, Your new Password is ${text}`
                data = {type:"User", Name:details.Name}
                break;
            case "password change request otp":
                message = `Your Request For BlackNut Forgot Password is recived, Your Otp is ${text}`
                data = {type:"User", Name:details.Name}
                break;
            case "OTP request for Customer Creation on Blacknut":
                message = `Your Request For New BlackNut Customer Creation is processed, Your Otp is ${text}`
                data = {type:"Agent", Name:details.Name}
                break;
            case "otp for Agreement Document Submit":
                message = `Your Request For BlackNut Agent Agreement Document Creation is processed, Your Otp is ${text}, Please complete your process of agreement document upload`
                data = {type:"Agent", Name:details.Name}
                break;
            case "OTP request for Existing Customer Verify on Blacknut":
                message = `Your Request For Existing Customer Verify is processed, Your Otp is ${text}`
                data = {type:"Customer", Name:details.Name} //done
                break;
            default:
                break;
        }
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: '587',
            auth: { user: "blacknut.2023@gmail.com", pass: "mjmzjaoouytjvscv" }, // todo in process.env //ocqetthgfvshotmy //flfcxkpnpymbcaju
            secure: false,
            logger: true
        });
        await transporter.sendMail({
            from: "blacknut.2023@gmail.com",
            to: email,
            subject: subject,
            html: EmailHTML(subject,message,data)
        });
        return true
    } catch (error) {
        return false
    }
};