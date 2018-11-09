const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const firebase = require('firebase')
const admin = require('firebase-admin')
// const {Storage} = require('@google-cloud/storage')
// const serviceAccount = 'firebase-adminsdk-v0b8g@disintegration-looper.iam.gserviceaccount.com'
module.exports = router

// firebase.initializeApp({
//   apiKey: process.env.FIREBASE_API_KEY
// })

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: `https://disintegration-looper.firebaseio.com`
// })

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname +
        '-' +
        Date.now() +
        path.extname(file.originalname) +
        '.mp3'
    )
  }
})

const upload = multer({
  storage: storage
}).single('soundFile')

// router.get('/',function(req, res){
//     console.log('sending file', req.file)
// });

router.post('/', upload, (req, res) => {
  console.log(res.send)
  res.redirect('/sound')
})
