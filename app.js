const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

// load routes
const songs = require('./routes/songs')
const users = require('./routes/users')

// Passport config
require('./config/passport')(passport)

// Map global promise - get rid of warning
mongoose.Promise= global.Promise
// connect to mongoose
mongoose.connect('mongodb://localhost/songlist-dev', {
  useMongoClient: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err))

// Handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Body-Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

// Method Overrider middleware
app.use(methodOverride('_method'))

// Express-Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware  
app.use(passport.initialize());
app.use(passport.session());

// Connect-Flash Middleware
app.use(flash())

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null  // if user hide login and register links
  next()
})

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

// Songs routes
app.use('/songs', songs)

// Users routes
app.use('/users', users)

const port = 3000

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})