exports.createTempPass = () => {
    let dateVal = Date.now()
    let mathRan = Math.ceil(Math.random()*5)
    let text = "Bla$K9u2s!"
    return text.split("", mathRan+5).join("").trim() + dateVal;
}