const EnvisionModule = require('envision-sdk')
const express = require('express')
const multer = require('multer')
const fs = require('fs')

const localRouter = express.Router()

localRouter.get('/', (req, res) => {
  res.sendFile(__dirname + '/local.html')
})

localRouter.get('/video.mp4', (req, res) => {
  res.sendFile(process.env.HOME + '/video.mp4')
})


const remoteRouter = express.Router()

var upload = multer({ dest: process.env.HOME + '/' })

remoteRouter.get('/', (req, res) => {
  res.sendFile(__dirname + '/remote.html')
})

remoteRouter.post('/upload', upload.single('file'), function(req, res) {
  let source = fs.createReadStream(req.file.path)
  let destination = fs.createWriteStream(process.env.HOME + '/video.mp4')

  source.pipe(destination, { end: false });
  source.on("end", function(){
      fs.unlinkSync(req.file.path)
      res.send('Good!')
  })
})


class EnvisionVideo extends EnvisionModule {
  onStart (server, cb) {
    console.log('started')
    this.onLocal = localRouter
    this.onRemote = remoteRouter
    return cb()
  }

  onStop (cb) {
    console.log('Good bye!')
    return cb()
  }
}

exports = new EnvisionVideo()
