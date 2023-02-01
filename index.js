require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const socket = require('socket.io')

const login = require("./Routes/login")
const signUp = require("./Routes/signup")
const product = require("./Routes/product")
const agent = require("./Routes/agent")
const customer = require("./Routes/customer")
const estimate = require("./Routes/estimate")
const quotation = require("./Routes/quotation")

const PO = require("./Routes/PO")
const upload = require("./Routes/upload")
const dashboard = require("./Routes/dashboard")
const cors = require("cors")

let app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const port = process.env.PORT || 8000;

// app.use((req, res, next) => {
//     var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
//     ACCESSLOG.info(`Request [From:${ip}] ${req.path}`)
//     next();
// });

// app.use("/", (req,res)=>{
//     res.send("hii")
// });
app.use("/login", login)
app.use("/signUp", signUp)
app.use("/product", product)
app.use("/agent", agent)
app.use("/customer", customer)
app.use("/estimate",estimate)
app.use("/quotation",quotation)
app.use("/purchaseOrder",PO)
app.use("/upload",upload)
app.use("/dashboard",dashboard)

let server = app.listen(port, () => console.log('Listening on http://localhost:' + port))
let io = socket(server)
io.on('connection', (socket) => {
    console.log("Connected Socked Id: ", socket.id)
    socket.on("chatMessage", chatData => {
        console.log(chatData);
    })
})
