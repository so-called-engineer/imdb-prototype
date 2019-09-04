var express = require("express");
var app = express();
var path = require("path");
var port = process.env.PORT || 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');
app.use(express.static(path.join(__dirname, 'public')));
var multer = require('multer');
ObjectId = require('mongodb').ObjectId;
var fs = require('fs-extra');
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://user:password69@imdb-v6weo.mongodb.net/imdb?retryWrites=true&w=majority",{
    useNewUrlParser: true
},function(err){
    if(err){
        console.log(err);
    }else {
        console.log("connection established");
    }
});

var nameSchema = new mongoose.Schema({
    poster: Buffer,
    movie: String,
    release: String,
    plot: String,
    cast: [String]
});

var nameSchema1 = new mongoose.Schema({
   name: String,
   sex: String,
   dob: String,
   Bio: String 
});

var users = mongoose.model('users', nameSchema);
var casts = mongoose.model('casts', nameSchema1);

upload = multer({limits: {fileSize: 2000000 },dest:'/uploads/'})

app.get("/",(req,res)=>{
    users.find({},(err,result)=>{
       if(err){
           throw err;
       }else{
           res.render('index',{result});
           console.log(result);
       }
    });
});
app.get("/addmovie",(req,res)=>{
    casts.find({},(err,result)=>{
        if(err){
            throw err;
        }else{
            res.render('addmovie',{result});
            console.log(result);
        }
    });    
});
app.post("/addmovie", upload.single('poster'), (req,res)=>{
    var newImg = fs.readFileSync(req.file.path);
    var encImg = newImg.toString('base64');
    var schema = {
        poster: Buffer.from(encImg, 'base64'),
        movie: req.body.movie,
        release: req.body.release,
        plot: req.body.plot,
        cast: req.body.cast
    }
    users(schema).save()
    .then(item => {
        users.find({},(err,result)=>{
            if(err){
                throw err;
            }else{
                res.setHeader('content-type','image/jpeg');
                res.render('index',{result});
            }
        })    
    })
    .catch(err => {
        res.status(400).send("Unable to save to database");
    });
});
app.post("/addcast",(req,res)=>{
    casts(req.body).save()
    .then(item =>{
        casts.find({},(err,result)=>{
            if(err){
                throw err;
            }else{
                res.render('addmovie',{result});
            }
        })
    })
    .catch(err => {
        res.status(400).send("Unable to save to database");
    });
});
app.get("/editmovie",(req,res)=>{
    users.find({},(err,result)=>{
        if(err){
            throw err;
        }else{
            res.render('editmovie');
        }
    });
});
app.listen(port,()=>{
    console.log("listening to port:"+port);
});