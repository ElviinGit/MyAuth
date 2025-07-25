import express from "express"
import bodyParser from "body-parser"
const port = 3000
const app = express()
let user = []
var user_is_authorized = false
var current_user;
var all_blogs = [];
var user_blogs; 

app.use(bodyParser.urlencoded( {extended: true} ))
app.use(express.json());

// get homepage
app.get("/", (req, res) => {
  res.render("index.ejs")
})

//user registration
app.post("/register", (req, res) => {
  user.push(req.body)
  res.render("index2.ejs")
})

// user login only supported post request
app.post("/login", (req, res) => {
  let foundUser = null;
  let user_want_login = req.body

for (let person of user) {
  // console.log(user)
  if (
    person.new_username === user_want_login.username &&
    person.new_password === user_want_login.password
  ) {
    foundUser = person;
    break;
  }
}


if (foundUser) {
  
  user_blogs = all_blogs.filter(b => b.author === foundUser.new_username);

  res.render("user_blogs.ejs", {
    userBlog: user_blogs
  });
  user_is_authorized = true
  current_user = user_want_login
} else {
  res.send("Invalid username or password");
}


// if (foundUser.new_password === all_blogs.author) {
//   console.log("it is founded")
// }
// else console.log("somethig goes wrong")

})

//excited user_list in user interface
app.get("/secret", (req,res) => {
  let a = 3
  let my_html_script = "<h1 style='color: blue;'>Hello world </h1>"
  res.render("secret.ejs", {userList: user, blogList: all_blogs, a, my_html_script})
  console.log("Shit happened")
})
// logged-in user dashboard
app.get("/create", check_login, (req, res, next) => {
  res.render("blog_create.ejs")
  // console.log(current_user)
})

app.get("/test", (req, res) => {
  if (current_user) {
    for (let item in all_blogs){
      console.log(`blog author is ${item}`)
  }
}
  else {res.send("not defined")}
})

//blog title and content submit
app.post("/create", (req, res) => {
  // user_blogs.push(req.body)
  if (current_user) {
  req.body.author = current_user.username
  all_blogs.push(req.body)
  res.render("user_blogs.ejs", {userBlog: user_blogs})
  console.log(all_blogs)
  }
})

function check_login(req, res, next) {
  if (user_is_authorized === true){
    next()
  }
  else {
    console.log("unauth user was founded!")
    res.redirect("/")
  }
}

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
