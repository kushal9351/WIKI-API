const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model("Article", articleSchema);

// **************************************************************Requests targetting all articles*******************************************************************

app.route("/articles")
    .get(async(req, res)=>{
        try{
            const find = await Article.find({});
            res.send(find);
        }
        catch(err){
            res.send(err);
        }
    })
    .post(async(req, res)=>{
        try{
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            newArticle.save();
            res.send("Successfully added a new article");
        }
        catch(err){
            res.send(err);
        }
    })
    .delete(async(req, res)=>{
        try{
            await Article.deleteMany({});
            res.send("successfully deleted all articles");
        }
        catch(err){
            console.log(err);
        }
    });

// ************************************************************Requests targetting a Specific articles*****************************************************************

app.route("/articles/:articleTitle")
    .get(async(req, res)=>{
        try{
            // console.log(req.params.articleTitle);
            const findOne = await Article.findOne({title: req.params.articleTitle});
            if(findOne){
                res.send(findOne);
            } 
            else{
                res.send("No articles matching that title was found");
            }
        }
        catch(err){
            res.send(err);
        }
    })
    .put(async(req, res)=>{
        try{
            await Article.replaceOne({title: req.params.articleTitle}, {
                title: req.body.title,
                content: req.body.content
            });
            res.send("successfully updated article");
        }
        catch(err){
            res.send(err);
        }
    })
    .patch(async(req, res)=>{
        try{
            await Article.updateOne({title: req.params.articleTitle}, {$set: {
                title: req.body.title,
                content: req.body.content
            }});
            res.send("successfully updated article");
        }
        catch(err){
            res.send(err);
        }
    })
    .delete(async(req, res)=>{
        try{
            await Article.deleteOne({title: req.params.articleTitle});
            res.send("deleted successfully");
        }
        catch(err){
            res.send(err);
        }
    });


app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
});