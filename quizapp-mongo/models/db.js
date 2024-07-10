const mongoose = require('mongoose');

module.exports.init = async function(){
    await mongoose.connect("mongodb+srv://quizApplication:mmMa2JcFYOv16Qhm@cluster0.tz4bxdn.mongodb.net/quiz");
    
}
