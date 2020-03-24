const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const questions = require('./models/questions');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
    extended: true
}));

dotenv.config();

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("Server listening on port" + port);
});



//GET METHOD FOR HOMEPAGE
app.get('/', (req, res) => {

    questions.find({}, (err, question) => {
        res.render('questions.ejs', {
            Questions: question
        })
    });

});

//UPDATED GET METHOD FOR ANSWER
app.route('/answer')
    .get((req, res) => {
        res.render('auth.ejs');
    })
    .post((req, res) => {
        var pass = req.body.password;
        if (pass == process.env.AUTH) {
            questions.find({}, (err, question) => {
                res.render('answers.ejs', {
                    Questions: question
                });
            });
        }
    })


//GET METHOD FOR ANSWER
// app.get('/answer',(req,res)=>{

//     questions.find({},(err,question)=>{
//         res.render('answers.ejs',{Questions:question})
//     });

// });


//DELETING A QUESTION
app.route('/remove/:id')
    .get((req, res) => {
        const id = req.params.id;
        questions.findByIdAndRemove(id, err => {
            if (err) res.send(500, err);
            questions.find({}, (err, question) => {
                res.render('answers.ejs', {
                    Questions: question
                });
            });
        });
    });


//ANSWERING A QUESTION 
app.route('/answer/:id')
    .post((req, res) => {
        const id = req.params.id;
        questions.findByIdAndUpdate(id, {
            answer: req.body.answertext
        }, err => {
            if (err) return res.send(500, err);
            questions.find({}, (err, question) => {
                res.render('answers.ejs', {
                    Questions: question
                });
            });
        });
    });





//BOILER PLATE
app.set('view engine', 'ejs');
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public'))


//DATABASE CONNECT
mongoose.set("useFindAndModify", false);
mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("Db COnnected!");
});




//POST METHOD
app.post('/', async (req, res) => {
    const Question = new questions({
        content: req.body.question,
        answer: ''
    });

    try {
        await Question.save();
        res.redirect('/');
    } catch (err) {
        console.log('err');
        res.redirect('/');
    }
});