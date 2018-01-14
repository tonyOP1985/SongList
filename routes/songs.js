const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const {ensureAuthenticated} = require('../helpers/auth')

// Load song model 
require('../models/Songs')
const Song = mongoose.model('songs')

// /songs urls
// song index page
router.get('/', ensureAuthenticated, (req, res) => {
  Song.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then(songs => {
      res.render('songs/index', {
        songs: songs
      })
    })
})

// Add song form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('songs/add')
})

// Edit Song form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Song.findOne({
    _id: req.params.id
  })
    .then(song => {
      if (song.user != req.user.id) {
        req.flash('error_msg', 'Not authorized')
        res.redirect('/songs')
      }
      else {
        res.render('songs/edit', {
          song: song
        })
      }
    })
})

// Process Form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = []

  if (!req.body.title) errors.push({ text: 'Please add a title' })
  if (!req.body.artist) errors.push({ text: 'Please add an artist' })
  if (!req.body.songKey) errors.push({ text: 'Please add a key' })

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
      songKey: req.body.songKey,
      user: req.user.id
    }
    new Song(newUser)
      .save()
      .then(song => {
        req.flash('success_msg', 'Song added')
        res.redirect('/songs')
      })
  }
})

// Edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
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
          req.flash('success_msg', 'Song updated')
          res.redirect('/songs')
        })
    })
})

// Delete Song
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Song.remove({ _id: req.params.id })
    .then(() => {
      req.flash('success_msg', 'Song removed')
      res.redirect('/songs')
    })
})

module.exports = router