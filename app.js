const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()

// Map global promise - get rid of warning
mongoose.Promise= global.Promise
// connect to mongoose
mongoose.connect('mongodb://localhost/songlist-dev', {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

// Load song model 
require('./models/Songs')
const Song = mongoose.model('songs')

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Method Overrider middleware
app.use(methodOverride('_method'))

//index route
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  })
})

app.get('/about', (req, res) => {
  res.render('about')
})

// song index page
app.get('/songs', (req, res) => {
  Song.find({})
    .sort({date: 'desc'})
    .then(songs => {
      res.render('songs/index', {
        songs: songs
      })
    })
})

// Add song form
app.get('/songs/add', (req, res) => {
  res.render('songs/add')
})

// Edit Song form
app.get('/songs/edit/:id', (req, res) => {
  Song.findOne({
    _id: req.params.id
  })
  .then(song => {
    res.render('songs/edit', {
      song: song
    })
  })
})

// Process Form
app.post('/songs', (req, res) => {
  let errors = []

  if (!req.body.title) errors.push({text: 'Please add a title'})
  if (!req.body.artist) errors.push({text: 'Please add an artist'})
  if (!req.body.songKey) errors.push({text: 'Please add a key'})

  if (errors.length) {
    res.render('songs/add', {
      errors: errors,
      title: req.body.title,
      artist: req.body.artist,
      key: req.body.songKey
    })
  } 
  else {
    const newUser = {
      title: req.body.title,
      artist: req.body.artist,
      songKey: req.body.songKey
    }
    new Song(newUser)
      .save()
      .then(song => {
        res.redirect('/songs')
      })
  }
})

// Edit form process
app.put('/songs/:id', (req, res) => {
  Song.findOne({
    _id: req.params.id
  })
  .then(song => {
    //new values
    song.title = req.body.title
    song.artist = req.body.artist
    song.songKey = req.body.songKey

    song.save()
      .then(song => {
        res.redirect('/songs')
      })
  })
})

app.delete('/songs/:id', (req, res) => {
  Song.remove({_id: req.params.id})
    .then(() => {
      res.redirect('/songs')
    })
})

const port = 5000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})