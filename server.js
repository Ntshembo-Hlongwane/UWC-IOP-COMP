const express = require("express");
const { MongoClient } = require("mongodb");
const mongoose = require('mongoose');
const url = "mogodb://localhost:27017/LectureVideos";
const Busboy = require("busboy");
const busboy = require("connect-busboy");
const bodyParser = require("body-parser");
const busboyBodyParser = require("busboy-body-parser");
const app = express();

mongoose.connect("mongodb://localhost:27017/LectureVideos", {
  useNewUrlParser:true,
  useUnifiedTopology:true
})

app.use(busboy());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboyBodyParser());

const lectureSchema = mongoose.Schema({

  lecturer: String,
  module: String,
  video:{
    data:Buffer,
    contentType:String
  }
})

const LectureVideos = mongoose.model('lecturevideos', lectureSchema)

app.post("/upload-video", (request, response) => {
  const lecturerName = request.body.lecturer;
  const moduleName = request.body.module;
  let busboy = new Busboy({ headers: request.headers });

  busboy.on("finish", () => {
    console.log("Upload Finished");
    const file = request.files.video;


    const addLectureVideo = new LectureVideos({
      lecturer:lecturerName,
      module:moduleName,
      video:file
    })

    addLectureVideo.save((error,data)=>{
      if(error){
        return console.log(error)
      }
      console.log(data)
    })

});

app.listen(3001);
