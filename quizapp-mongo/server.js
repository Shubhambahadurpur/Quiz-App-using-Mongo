let express = require('express');
let app = express();
let fs = require('fs');
let multer = require('multer');
let ejs = require('ejs');
let path = require('path');
const db = require('./models/db.js');
const quizModel = require(__dirname+"/models/quiz_data.js");

let globalArray = [];
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const upload = multer({ dest: 'uploads/' })

app.use(express.static('public'));
app.use(express.json());

db.init()
.then(function(){
    console.log("Database Connected");
    app.listen(4000, () => {
        console.log("server initiated");
    })
}).catch(function(err){
    console.log(err);
})



app.get("/", async (req, res) => {    // home page route to show the quiz // done
    let quizArray = await quizModel.find();
    console.log(quizArray);
    res.render("quiz",{quizArray});
})



app.get("/uploadfile", (req, res) => {          // route for uploading the file //done
    res.sendFile(__dirname + "/public/as.html");    // send the as.html file
})
app.post("/uploadfile", upload.single("qus"), (req, res) => {   // route for handling the post request from the as.html
  const Quiz = {
        _id:req.file.filename,
        highScore:0,
        currentScore:0
   }
   quizModel.create(Quiz).then(function(){
    res.sendFile(__dirname + "/public/success.html"); 
   })
});


let key;
// app.get("/quizdash", (req, res) => {        // handling the request on '/quizdash' route
//     let qfile = `uploads/${req.query.filename}`;    // getting the pathname of the specific file 
//     let nfile = `${req.query.filename}`;            // getting the file name
//     fs.readFile(qfile, "utf-8", (err, data) => {    // reading the file having questions
//         if (err) throw err;
//         else {
//             let array = JSON.parse(data);           // getting the questions and storing into the 'array' named array
//             res.render("question", { array, nfile });   // rendering the question.ejs 
//         }
//     })
// })

app.get("/question", (req, res) => {    // handling the request on the '/question' route
    res.send("ok");

})
app.post("/question", (req, res) => {   // handling the post request on '/question' route
    key = req.body.id;
    res.send("ok");

})

app.get("/score", (req, res) => {   // for handling the request on '/score' route
    res.send("ok");
})
app.post("/score", async (req, res) => {  // for handling the post request on '/score' route
   console.log(req.body.score);
   let answerArray = req.body.score;
   const data = await readFile(`./uploads/${req.body.myFile}`);
   const array = JSON.parse(data);
    // console.log(data);
    console.log(answerArray[1].id);
    let score = 0;
    for(let i = 0;i < answerArray.length;i++)
    {
        for(let j = 0;j < array.length;j++)
        {
            if(array[j].id === answerArray[i].id)
            {
                if(array[j].ans === answerArray[i].answer)
                {
                    score++;
                }
            }
        }
    }
    const temp = await quizModel.findOne({_id:req.body.myFile});
    console.log(temp);
    let h = temp.highScore;
    if(h < score){
        h = score;
    }
   await quizModel.updateOne({_id:req.body.myFile},{$set:{highScore:h}});
   await quizModel.updateOne({_id:req.body.myFile},{$set:{currentScore:score}});
    res.send({status:200});
})





app.get("/abc", async (req, res) => {         // handling the request on the '/abc' request
                let hs = await quizModel.findOne({_id:req.query.file});
                            res.render("score", { marks:hs.currentScore });  

})





function _readFile(filename, callback) {
    let trimedFile = filename.trim();
    fs.readFile(__dirname+`/${trimedFile}`, "utf-8", (err, data) => {
       if(err)
       {
        throw err;
       }
       else{
        callback(err, data);
       }
        

    })
}


app.get("/quizdash", async (req, res) => {        // handling the request on '/quizdash' route
    let filePath = `uploads/${req.query.filename}`;    // getting the pathname of the specific file 
    let fileName = `${req.query.filename}`;            // getting the file name
    console.log(fileName,filePath);
    const data = await readFile(filePath);
    // console.log(data);
    let dataArray = JSON.parse(data);
    let a = [],b = [],nArr = [];
    for(let i = 0;i < 5;i++)
        {
            a[i] = dataArray[(Math.floor(Math.random() * dataArray.length))];
            b = [... new Set(a)];
        }

       
        res.render("question", { b, fileName });   // rendering the question.ejs 
    // _readFile(qfile, (err, data) => {
    //     let array = JSON.parse(data);  // getting the questions and storing into the 'array' named array
    //     // console.log(array);
    //     let a=[],b=[];
    //     let nArr = [];
    //     for(let i = 0;i < 5;i++)
    //     {
    //         a[i] = array[(Math.floor(Math.random() * array.length))];
    //         b = [... new Set(a)];
    //     }
    //     for (let i = 0; i < b.length; i++) {
    //         nArr[i] = b[i];
            
    //     }
        
    //     console.log(nArr);
    //     res.render("question", { nArr,array, nfile });   // rendering the question.ejs 

    // })

})

const readFile = (path)=>
    new Promise((resolve,reject)=>{
        fs.readFile(path,"utf-8",(err,data)=>{
            if(err){
                // console.log(data);
                reject(err);
            }
            else{
                // console.log(data);
                resolve(data);
            }
        })
    })


app.get('/*', (req, res) => {       // handling the unhandled request
    res.send("404 not found")
})



