const mongoose = require("mongoose");
// const { connect } = require("./server");

function connect(callback){
    let connectionString = `mongodb+srv://DawsonNielson:Dawsonp44@cluster0.08nxx.mongodb.net/forum?retryWrites=true&w=majority`;
    console.log("connet to db...");

    mongoose
        .connect(connectionString,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .catch((err)=>{
            console.log(err);
        });

    mongoose.connection.once("open", callback);
}



module.exports = connect;