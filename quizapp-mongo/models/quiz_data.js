const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
                _id:String,
                highScore:Number,
                currentScore:Number,
})

const quiz = mongoose.model("quiz",quizSchema);

module.exports = quiz;