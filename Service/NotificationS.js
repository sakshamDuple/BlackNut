const Notification = require('../Model/Notification')

exports.create = async (Content,navigation) => {
    try {
        let notificationNumber = await getValueForNextSequence()
        let createdNotification
        if(navigation != null || navigation != undefined){
            createdNotification = await Notification.create({ notificationNumber, notification:Content, navigation })
        } else {
            createdNotification = await Notification.create({ notificationNumber, notification:Content })
        }
        console.log("createdNotification",createdNotification)
        return { data: createdNotification, message: "Notification created successfully", status: 201 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "Notification can't be created, got in some issue", status: 400 }
    }
}

exports.getOneNotify = async ({notificationNumber, _id}) => {
    try {
        let foundNotify
        if(_id!=null || _id!=undefined) foundNotify = await Notification.findById(_id)
        if(notificationNumber!=null || notificationNumber!=undefined) foundNotify = await Notification.findOne({notificationNumber})
        return { data: foundNotify, message: foundNotify?"Notification retrieved successfully":"Notification not found", status: foundNotify? 200:404 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "Notification can't be retrieved, got in some issue", status: 400 }
    }
}

exports.readTheNotification = async (_id) => {
    try {
        let updateNotification = await Notification.updateOne({_id},{read:true})
        return { data: updateNotification.nModified>0, message: updateNotification.nModified>0?"Notification was read":"Notification was not updated", status: updateNotification.nModified>0? 200:400 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "Notification can't be retrieved, got in some issue", status: 400 }
    }
}

exports.getAllNotify = async (read,page,limit) => {
    try {
        let Notifications, query
        let start = (page-1)*limit
        let totalCount
        if(read){
            query = {read}
            totalCount = await Notification.count(query)
            Notifications = await Notification.find(query).skip(start).limit(limit).sort({createdAt:-1})
        }else{
            totalCount = await Notification.count()
            Notifications = await Notification.find().skip(start).limit(limit).sort({createdAt:-1})
        }
        return { data: Notifications, totalCount, message: Notifications.length>0?"Notifications retrieved successfully":"No Notifications found", status: Notifications.length>0?200:404 }
    } catch (e) {
        console.log(e)
        return { error:e,message: "Notification can't be retrieved, got in some issue", status: 400 }
    }
}

async function getValueForNextSequence() {
    let MaxNo = { $max: "$notificationNumber" };
    let foundNotifications = await Notification.count();
    if (foundNotifications == 0) return 1;
    let agg = [
      {
        $group: {
          _id: null,
          MaxNo,
        },
      },
    ];
    let findMax = await Notification.aggregate(agg);
    return findMax[0].MaxNo + 1;
  }