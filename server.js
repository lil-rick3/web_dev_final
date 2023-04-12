const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const crypto = require('crypto');

const connection_string = 'mongodb://127.0.0.1/remind';
mongoose.connect(connection_string);
mongoose.connection.on('error', () => {
  console.log('There was a problem connecting to mongoDB');
});

var UserSchema = new mongoose.Schema( {
    username: String,
    salt: Number,
    hash: String,
    tasksCompleted: [mongoose.Schema.Types.ObjectId],
    tasksGiven: [mongoose.Schema.Types.ObjectId],
    pendingTasks: [mongoose.Schema.Types.ObjectId],
    friends: [mongoose.Schema.Types.ObjectId]
    

    
});
var User = mongoose.model('User', UserSchema);
var taskSchema = new mongoose.Schema( {
    name: String,
    Importance: Number,
    status: String,
    category: String,
    dateIssued: Number,
    date: Number,
    issuer: mongoose.Schema.Types.ObjectId,
    recipient: mongoose.Schema.Types.ObjectId

});
var Item = mongoose.model('Item', ItemSchema);
var eventSchema = new mongoose.Schema( {
  name: String,
  dateIssued: Number,
  date: Number,
  issuer: mongoose.Schema.Types.ObjectId,
  invited: [mongoose.Schema.Types.ObjectId]

});
var Event = mongoose.model('Event', eventSchema);
function authenticate(req, res, next) {
  let c = req.cookies;
  if (c && c.login) {
    let result = cm.sessions.doesUserHaveSession(c.login.username, c.login.sid);
    if (result) {
      next();
      return;
    }
  }
  res.redirect('/account/index.html');
}

const app = express();
app.use(cookieParser());    
app.use('/app/*', authenticate);
app.use(express.static('public_html'))

app.use(express.json())

app.use('*', (req, res, next) => {
  let c = req.cookies;
  if (c && c.login) {
    if (cm.sessions.doesUserHaveSession(c.login.username, c.login.sid)) {
      cm.sessions.addOrUpdateSession(c.login.username);
    }
  }
  next();
});


