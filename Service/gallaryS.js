const { error } = require('../Middleware/error')
const Gallary = require('../Model/Gallary')

exports.create = async(Content,Title) => {
    if(!Content) return error("Content","missing field")
    if(!Title) return error("Title","missing field")
    let GallaryCreated = await Gallary.create({ Content,Title })
    return { data: GallaryCreated, message: "Gallary created successfully", status: 201 }
}

exports.getAllContent = async(page,limit,search) => {
    let start = (page-1)*limit
    let query = {}
    if(search != ""){
        query.Title = new RegExp(search, 'i')
    }
    let totalCount = await Gallary.count(query)
    let findGal = await Gallary.find(query).skip(start).limit(limit).sort({createdAt:-1})
    return { data: findGal, totalCount, message: "Gallary retrieved successfully", status: 200 }
}

exports.deleteById = async(id) => {
    let deleteGal = await Gallary.deleteOne({_id:id})
    return { deletion: deleteGal.deletedCount>0, message: deleteGal.deletedCount>0?"Gallary deleted successfully":"Deletion failed", status: deleteGal.deletedCount>0?200:400 }
}