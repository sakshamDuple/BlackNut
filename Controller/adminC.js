const adminS = require("../Service/adminS")
const gallaryS = require("../Service/gallaryS")

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

exports.addToGallary = async (req,res) => {
    let Content = req.body.Content
    let Title = req.body.Title
    let addedToGal = await gallaryS.create(Content,Title)
    res.status(addedToGal.status).send(addedToGal)
}

exports.getGallary = async (req,res) => {
    let page = req.query.page?parseInt(req.query.page):1
    let limit = req.query.limit?parseInt(req.query.limit):10
    let addedToGal = await gallaryS.getAllContent(page,limit)
    res.status(addedToGal.status).send(addedToGal)
}

exports.deleteGal = async (req,res) => {
    let id = req.query.id
    let deletedGal = await gallaryS.deleteById(id)
    res.status(deletedGal.status).send(deletedGal)
}