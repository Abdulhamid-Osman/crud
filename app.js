const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded(
    {extended:true}
));
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/crud", {useNewUrlParser: true});

const articleSchema = {
    title: String,
    content: String
}
//////////////////////targeting all articles
const Article = mongoose.model("Article", articleSchema);
app.route('/article').
get((req,res)=>{
    Article.find({},(err, foundArticles)=>{
        if(!err){
            res.send(foundArticles)
        }
    })
    
})
.post((req,res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })
    newArticle.save((err)=>{
        if(!err){
            res.send('/article')
        }
    })
})
.delete((req,res)=>{
    Article.deleteMany({},(err)=>{
        if(!err){
            res.send("Deleted all successfully!!");
        }else{
            res.send(err)
        }
    })
});
//////////////////////targeting specific articles
app.route('/article/:articleTitle')
.get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err, foundArticle)=>{
        if(foundArticle){
            res.send(foundArticle)
        }else{
            res.send("No articles Mayched")
        }
    })
})
.put((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title, content:req.body.content},
        {overwrite: true},(err)=>{
            if(!err){
                res.send("Successfully updated")
            }else{
                res.send("Error occured")
            }
        }
        )
})
.patch((req,res)=>{
    Article.update({title:req.params.articleTitle},{$set:req.body},(err)=>{
        if(!err){
            res.send("successfully changed!!")
        }else{
            res.send("error occured again!!!")
        }
    });
})
.delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(!err){
            res.send("successfully deleted")
        }else{
            res.send("Error occured please!!!");
        }
    })
})


app.listen(3000,()=>{
    console.log("server started well");
})