const nodemailer = require("nodemailer")

exports.sendEmail = async (email, subject, text) => {
    try {
        // let HTML = EmailHTML(subject, text)
        let message
        switch (subject) {
            case "new Password Created":
                message = `Your Request For New BlackNut Password Creation is processed, Your new Password is ${text}`
                break;
            case "password change request otp":
                message = `Your Request For BlackNut Forgot Password is recived, Your Otp is ${text}`
                break;
            case "OTP request for Customer Creation on Blacknut":
                message = `Your Request For New BlackNut Customer Creation is processed, Your Otp is ${text}`
                break;
            case "otp for Agreement Document Submit":
                message = `Your Request For BlackNut Agent Agreement Document Creation is processed, Your Otp is ${text}, Please complete your process of agreement document upload`
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
            text: message
        });
        return true
    } catch (error) {
        return false
    }
};