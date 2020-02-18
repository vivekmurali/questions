const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const questions = require('./models/questions');

dotenv.config();

let port = 3000;

app.listen(port,()=>{
    console.log("Server listening on port" + port);
});



//GET METHOD
app.get('/',(req,res)=>{

    questions.find({},(err,question)=>{
        res.render('questions.ejs',{Questions:question})
    });
    
});


//BOILER PLATE
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'))


//DATABASE CONNECT
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log("Db COnnected!");
});




//POST METHOD
app.post('/',async (req,res)=>{
    const Question = new questions({
        content: req.body.question,
        answer: ''
    });

    try{
        await Question.save();
        res.redirect('/');
    }
    catch(err){
        console.log('err');
        res.redirect('/');
    }
});



