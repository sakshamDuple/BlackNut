const { getAllNotify, readTheNotification, getOneNotify } = require("../Service/NotificationS")

exports.getAll = async (req,res) => {
    let read = req.query.read
    let page = req.query.page?parseInt(req.query.page):1
    let limit = req.query.limit?parseInt(req.query.limit):10
    let AllNotifications = await getAllNotify(read,page,limit)
    res.status(AllNotifications.status).send(AllNotifications)
}

exports.readTheNotification = async (req,res) => {
    let _id = req.query.id
    let readThisNotification = await readTheNotification(_id)
    res.status(readThisNotification.status).send(readThisNotification)
}

exports.getOneNotify = async (req,res) => {
    let _id = req.query.id
    let notificationNumber = req.query.notificationNumber
    let readThisNotification = await getOneNotify({_id,notificationNumber})
    res.status(readThisNotification.status).send(readThisNotification)
}