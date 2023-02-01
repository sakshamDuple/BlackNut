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
            case "OTP request for File Upload & Updation Of quotation To Purchase Order":
                message = `Your Request For Customer Verification for file Purchase Invoice upload will be processed after file upload only, Your Otp is ${text}`
                data = {type:"Customer", Name:details.Name} //done
                break;
            case "Your Admin Account is Registered":
                message = `Cheers, We gladly invite you to as a new admin for administering Blacknut transactions`
                data = {type:"Admin", Name:details.Name}
                break;
            case "Your Agent Account is Registered":
                message = `Cheers, We gladly invite you to as a new agent, now you will be able to create estimates for several customers in your region`
                data = {type:"Agent", Name:details.Name}
                break;
            case "Your Customer Account is Registered":
                message = `Cheers, We gladly invite you to as a new customer, please keep checking your email for further operation in blacknut`
                data = {type:"Customer", Name:details.Name}
                break;
            case "Your Customer Registered":
                message = `Cheers, Your Added Customer is now registered, please keep track of his/her transactions & operations`
                data = {type:"Agent", Name:details.Name}
                break;
            case "You Added New Estimate":
                message = `Cheers, You Added a new estimate, look forward to convert it as Quotations`
                data = {type:"Agent", Name:details.Name}
                break;
            case "Added New Estimate":
                message = `Cheers, An estimate is added on your behalf from admin, look forward to convert it as Quotations`
                data = {type:"Customer", Name:details.Name}
                break;
            case "New Estimate Added":
                message = `Cheers, An estimate is added by an agent, keep track of the conversion of estimates`
                data = {type:"Admin", Name:details.Name}
                break;
            case "You Converted Estimate To Quotation":
                message = `Congratulations, An estimate was added by you is now converted to the quotation, to complete the purchase of order of machine, keep track of the quotation`
                data = {type:"Agent", Name:details.Name}
                break;
            case "Your Machine Quotation Processed":
                message = `Congratulations, We have successful completion of Estimate To Quotation for your order, keep track of the conversion of your orders`
                data = {type:"Customer", Name:details.Name}
                break;
            case "A Quotation is Processed":
                message = `Congratulations, We have successful completion of Estimate To Quotation process, keep track of the same Quotation conversion to Orders`
                data = {type:"Admin", Name:details.Name}
                break;
            case "An Ordered is Processed":
                message = `Congratulations, We have successful Order Placed, find the details below`
                data = {type:"Admin", Name:details.Name}
                break;
            case "Your Machine Is Ordered":
                message = `Congratulations, We have successful placement of your order, find the details below`
                data = {type:"Customer", Name:details.Name}
                break;
            case "You Converted Quotation To Order":
                message = `Congratulations, Your Customer Place Order is successfully completed, find the details below`
                data = {type:"Agent", Name:details.Name}
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