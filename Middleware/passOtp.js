const axios = require("axios");

exports.CustomerLink = (otp,phone) => {
    return(`https://pgapi.vispl.in/fe/api/v1/send?username=blacknpg.trans&password=PVkst&unicode=false&from=BAMPL&to=${phone}&dltPrincipalEntityId=1301167629235243000&dltContentId=1307167654311060270&text=Your mobile number verification OTP is ${otp}. Thank you from BlackNut team.`)
}

exports.sendOTPonPhone = async (field,otp,phone) => {
    let Link
    switch (field) {
        case "CustomerLink":
            Link = this.CustomerLink(otp,phone)
            break;
        default:
            break;
    }
    let sent = await axios.get(Link)
    if(sent.data.statusCode == 200) {
        sent.data.status = 200
        sent.data.message = "otp sent"
    } else {
        sent.data.status = 400
        sent.data.message = "otp not sent"
    }
    return sent.data
}