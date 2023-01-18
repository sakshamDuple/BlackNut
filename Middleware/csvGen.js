const csvFilePathNew = './matinetNew.csv'
const csv = require('csvtojson')

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