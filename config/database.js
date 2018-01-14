if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://tony:tony@ds155577.mlab.com:55577/songlist-prop'}
}
else {
  module.exports = {mongoURI: 'mongodb://localhost/songlist-dev'}
}