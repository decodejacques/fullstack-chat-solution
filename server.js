let express = require("express")
let multer = require("multer")
let upload = multer()
let app = express()
let cookieParser = require('cookie-parser')
app.use(cookieParser());
let reloadMagic = require('./reload-magic.js')
let passwords = { admin: "pwd123" }
let sessions = {}
let messages = []
reloadMagic(app)
app.use('/', express.static('build'));
app.get("/messages", function (req, res) {
  if (sessions[req.cookies.sid] === undefined) {
    res.send(JSON.stringify({ loggedOut: true }))
    return
  }
  let msgs = [...messages]
  while (msgs.length > 20) msgs.shift()
  res.send(JSON.stringify(msgs))
})
app.post("/newmessage", upload.none(), (req, res) => {
  console.log("*** inside new message")
  console.log("body", req.body)
  let sessionId = req.cookies.sid
  let username = sessions[sessionId]
  console.log("username", username)
  let msg = req.body.msg
  let newMsg = { username: username, message: msg, timestamp: new Date() / 1 }
  console.log("new message", newMsg)
  messages = messages.concat(newMsg)
  console.log("updated messages", messages)
  res.send(JSON.stringify({ success: true }))
})



app.post("/kickout", upload.none(), (req, res) => {
  console.log("*** inside new message")
  console.log("body", req.body)
  let sessionId = req.cookies.sid
  let username = sessions[sessionId]
  if (username !== "admin") {
    res.send(JSON.stringify({ success: false }))
    return
  }
  console.log("username", username)
  let victim = req.body.name
  let allSids = Object.keys(sessions)
  allSids.forEach(sid => {
    if (sessions[sid] === victim) {
      sessions[sid] = undefined
    }
  })
})









app.post("/check-login", upload.none(), (req, res) => {
  let sessionId = req.cookies.sid
  let username = sessions[sessionId]
  if (username !== undefined) {
    res.send(JSON.stringify({ success: true }))
    return
  }
  res.send(JSON.stringify({ success: false }))
})

app.post("/login", upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint")
  console.log("this is the parsed body", req.body)
  let username = req.body.username
  let enteredPassword = req.body.password
  let expectedPassword = passwords[username]
  console.log("expected password", expectedPassword)
  if (enteredPassword === expectedPassword) {
    messages.push({ username: username, message: "I've entered the chat!", timestamp: new Date() / 1 })
    console.log("password matches")
    let sessionId = generateId()
    console.log("generated id", sessionId)
    sessions[sessionId] = username
    res.cookie('sid', sessionId);
    res.send(JSON.stringify({ success: true }))
    return
  }
  res.send(JSON.stringify({ success: false }))
})
let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000)
}

app.post("/instant-regret", (req, res) => {
  let sessionId = req.cookies.sid
  let username = sessions[sessionId]
  messages = messages.filter(m => {
    return m.username !== username
  })
  res.send(JSON.stringify({ success: true }))
})




app.post("/logout", (req, res) => {
  let sessionId = req.cookies.sid
  sessions[sessionId] = undefined // bugfix
  console.log(sessions)
  res.send(JSON.stringify({ success: true }))
})

app.post("/signup", upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint")
  console.log("this is the body", req.body)
  let username = req.body.username
  let enteredPassword = req.body.password
  if (passwords[username] !== undefined) {
    res.send(JSON.stringify({ success: false }))
    return
  }
  passwords[username] = enteredPassword
  console.log("passwords object", passwords)

  let sessionId = generateId()
  console.log("generated id", sessionId)
  sessions[sessionId] = username
  res.cookie('sid', sessionId);
  messages.push({ username: username, message: "I've entered the chat!", timestamp: new Date() / 1 })

  res.send(JSON.stringify({ success: true }))
})
app.all('/*', (req, res, next) => {
  res.sendFile(__dirname + '/build/index.html');
})
app.listen(4000) 