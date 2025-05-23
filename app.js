const express = require('express')
const logger = require('morgan')
const cors = require('cors')

const auth = require('./middlewares/auth')

require('dotenv').config()

const usersRouter = require('./routes/api/users')
const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

app.use('/api/users', usersRouter);
app.use('/api/contacts', auth, contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  if(err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message })
  }
  res.status(500).json({ message: err.message })
})

module.exports = app
