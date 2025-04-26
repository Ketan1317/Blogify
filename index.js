const express = require("express");
const app = express();
const path = require("path");
const PORT = 4001;
const mongoose =  require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./Models/blog");

const {router} = require("./Routes/user");
const {blogRouter} = require("./Routes/blog")
const { checkForAuthCookie } = require("./Middlewares/auth");

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthCookie("token"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"))

mongoose.connect("mongodb+srv://goyalketan1317:mzWvWBHfSWxM6zfJ@cluster0.xb8czsh.mongodb.net/blog-page").then(() => console.log("MongoDB Connected")).catch((err) => console.log(err));

app.get("/",async (req,res)=>{
    const allBlogs = await Blog.find();
    res.render("homePage",{
        user:req.user,
        blogs:allBlogs
    });
})

app.use("/user",router);
app.use("/blog",blogRouter);

app.listen(PORT,() => console.log(`Server Started at ${PORT}`));