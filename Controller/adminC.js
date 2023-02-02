const adminS = require("../Service/adminS")

exports.getAllAdmin = async (req, res) => {
    let page = req.query.page
    let limit = req.query.limit
    let foundAdmin = await adminS.findAdmins(page,limit)
    res.status(foundAdmin.status).send(foundAdmin)
}

exports.editAdmin = async (req,res) => {
    let {firstName, lastName, phone, mainAddressText, _id} = req.body
    let editedAdmin = await adminS.editAdmin(_id,{firstName, lastName, phone, mainAddressText})
    res.status(editedAdmin.status).send(editedAdmin)
}

exports.deleteAdmin = async (req,res) => {
    let id = req.query.id
    let editedAdmin = await adminS.deleteAdmin(id)
    res.status(editedAdmin.status).send(editedAdmin)
}