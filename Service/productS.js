const product = require("../Model/Product");

exports.create = async (data) => {
    try{
        let foundPrd
        if (data.crop) foundPrd = await product.findOne({ crop: data.crop })
        if (foundPrd != null) {
            // let prevProduct = foundPrd.products
            let prevProduct = foundPrd.products.find((o, i) => {
                if (o.Product_name === data.products[0].Product_name) return o
            });
            if (prevProduct != null) {
                let prevMachine = prevProduct.machines.find((p, i) => {
                    if (p.Machine_name === data.products[0].machines[0].Machine_name) return p
                })
                if (prevMachine != null) {
                    let prevProductDetail = prevMachine.productDetail
                    prevProductDetail.push(data.products[0].machines[0].productDetail[0])
                    prevMachine.productDetail = prevProductDetail
                } else {
                    prevMachine = []
                    prevMachine.push(data.products[0].machines[0])
                }
                prevProduct.machines = prevMachine
            } else {
                prevProduct = []
                console.log(prevProduct)
                prevProduct.push(data.products[0])
            }
            foundPrd.products = prevProduct
            let updateProduct = await product.updateOne({_id:foundPrd._id}, { $set: foundPrd })
            return { data: updateProduct.modifiedCount>0 && foundPrd, message: updateProduct.modifiedCount>0 && "updated Successfully", status: updateProduct.modifiedCount>0 && 200 }
        } else {
            return { data: await product.create(data), message: "created Successfully", status: 201 }
        }
    }catch(e){
        console.log(e)
        return { error: e, message: "creation / updation unsuccessful" }
    }
}

exports.createVariant = async (prevProduct, data) => {
    let prevProduct_variants = prevProduct.productDetail
    console.log(prevProduct_variants)
    prevProduct_variants.push(data)
    prevProduct.productDetail = prevProduct_variants
    let updatePrdtVar = await product.updateOne({ _id: prevProduct._id }, { $set: prevProduct })
    return { data: updatePrdtVar.modifiedCount > 0, message: updatePrdtVar.modifiedCount > 0 ? "variant creatred Successfully" : "some issue while creation", status: updatePrdtVar.modifiedCount > 0 ? 201 : 400 }
}

exports.findOneById = async (id) => {
    return await product.findOne({ _id: id })
}

exports.deleteOnly = async (id) => {
    return await product.deleteOne(id)
}