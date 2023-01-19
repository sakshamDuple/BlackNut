const csvFilePathNew = './matinetNew.csv'
const csvtojson = require("csvtojson");
const multer = require("multer");

async function readCsv() {
    csv().fromFile(csvFilePathNew).then(async (jsonObj) => {
        let data = [];
        for (let i = 0; i < 2; i++) {
            if (jsonObj[i].field8) {
                let user = await User.findOne({ email: jsonObj[i].field8.toLowerCase() });
                console.log("user 1:", user)
                if (!user) {
                    let element = jsonObj[i].field8.replace(/ /g, "?");
                    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
                    var regex = new RegExp(expression);
                    var t = element;
                    if (element && t.match(regex)) {
                        let comanyData = { companyName: jsonObj[i].field7, email: jsonObj[i].field8, password: "12345678", companyType: "company", dateEstablished: 1664476200, location: "demo", bio: "demo", inviteCode: "ZJRA31", role: "C", userType: "web", isAutomatedUser: true }
                        console.log("comanyData :", comanyData);
                        await createCompany(comanyData)
                    }
                }
            }
        }
    })
}

const uploadCsv = multer({ dest: "./csv_files/uploaded/" });

router.post("/bulkProduct", uploadCsv.single("csv"), async (req, res) => {
    var file = req.file;
    let products = await csvtojson().fromFile(file.path);
    console.log(products)
    // let reportData = [];
    // for (product of products) {
    //   let reportObj = _.clone(product);
    //   var { error } = validateProductBulk(product);
    //   if (!error) {
    //     let newProduct = new Product(
    //       _.pick(product, ["title", "price", "oldPrice", "description", "category", "subCategory", "coverImage", "offerText", "calories", "weight", "unit"])
    //     );
    //     newProduct.vendorId = req.jwtData.userId;
    //     await newProduct.save();
  
    //     if (product.topping.length > 0) {
    //       let toppingArray = [];
    //       for (i = 0; i < product.topping.length; i++) {
    //         product.topping[i].productId = newProduct._id;
    //         if (product.topping[i].checkbox.toLowerCase == "false") {
    //           product.topping[i].checkbox = false;
    //         } else {
    //           product.topping[i].checkbox = true;
    //         }
    //         toppingArray.push(product.topping[i]);
    //       }
    //       await Topping.insertMany(toppingArray);
    //     }
    //     reportObj.status = "success";
    //     reportObj.message = "Product added successfully.";
    //   } else {
    //     reportObj.status = "failure";
    //     reportObj.message = valMsgFormatter(error.details[0].message);
    //   }
    //   reportData.push(reportObj);
    // }
    // const csv = new ObjectsToCsv(reportData);
    // await csv.toDisk("./test.csv");
    // console.log("download", download);
    // res.download("./test.csv");
    return res.send({ statusCode: 200, message: "Success", data: { products } });
  
    // let data = await properData(successArray, failureArray);
    // console.log(".........", data);
    // console.log("222", properData.bulkSuccessData);
    // await generateBulkRequest(data.bulkSuccessData, data.bulkFailureData, data.status, "CREATE");
    // const csv = new ObjectsToCsv(bulkFailureData);
    // await csv.toDisk("./test.csv");
    // // console.log(await csv.toString());
    // res.send({
    //   addedProducts: successArray,
    //   rejectedProducts: failureArray
    // });
  });