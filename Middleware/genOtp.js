exports.generateOtp = () => {
    let otp = Math.ceil(Math.random() * 1000000)
    if (otp < 100000) {
        otp = "0" + otp
    }
    if (otp < 10000) {
        otp = "0" + otp
    }
    if (otp < 1000) {
        otp = "0" + otp
    }
    if (otp < 100) {
        otp = "0" + otp
    }
    if (otp < 10) {
        otp = "0" + otp
    }
    return otp
}