import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import session from "express-session";

// Load environment variables
dotenv.config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Database connection
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/blogDB";
mongoose.connect(mongoURI);

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const User = mongoose.model("User", userSchema);

// Post Schema
const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", {
  title: String,
  content: String,
  createdAt: Date
});

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
};

const requireAdmin = (req, res, next) => {
  if (req.session.userId && req.session.userRole === 'admin') {
    next();
  } else {
    res.redirect('/login');
  }
};

app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts,
    user: req.session
  });
});

app.get("/compose", requireAuth, async (req, res) => {
  res.render("compose", { user: req.session });
});

// Login routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.userRole = user.role;
      res.redirect('/');
    } else {
      res.render("login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", { error: "Login failed" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Registration routes
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      role: role || 'user'
    });
    
    await user.save();
    res.render("register", { success: "User registered successfully! You can now login." });
  } catch (error) {
    console.error("Registration error:", error);
    res.render("register", { error: "Registration failed. Username might already exist." });
  }
});

// Create demo users on startup
const createDemoUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      const admin = new User({
        username: 'admin',
        password: adminPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Demo admin user created: admin/admin123');
    }
    
    const userExists = await User.findOne({ username: 'user' });
    if (!userExists) {
      const userPassword = await bcrypt.hash('user123', 10);
      const user = new User({
        username: 'user',
        password: userPassword,
        role: 'user'
      });
      await user.save();
      console.log('Demo user created: user/user123');
    }
  } catch (error) {
    console.error('Error creating demo users:', error);
  }
};

// Create demo users
createDemoUsers();

// User profile route
app.get("/profile", requireAuth, (req, res) => {
  res.render("profile", { user: req.session });
});

// Protected admin route
app.get("/admin", requireAdmin, async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.render("admin", { posts: posts, user: req.session });
});

app.post("/compose", requireAuth, async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    createdAt: new Date()
  });

  await post.save();

  res.redirect("/");
});




app.get("/posts/:postId", async (req, res) => {
  const requestedPostId = req.params.postId;

  const post = await Post.findOne({_id: requestedPostId});

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  res.render("post", {
    title: post.title,
    content: post.content,
    postId: post._id
  });
});

// DELETE route - Admin only
app.post("/posts/:postId/delete", requireAdmin, async (req, res) => {
  const requestedPostId = req.params.postId;
  
  try {
    await Post.findByIdAndDelete(requestedPostId);
    res.redirect("/admin");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Error deleting post");
  }
});

// EDIT route - show edit form (Admin only)
app.get("/posts/:postId/edit", requireAdmin, async (req, res) => {
  const requestedPostId = req.params.postId;
  
  try {
    const post = await Post.findOne({_id: requestedPostId});
    
    if (!post) {
      res.status(404).send("Post not found");
      return;
    }
    
    res.render("edit", {
      title: post.title,
      content: post.content,
      postId: post._id,
      user: req.session
    });
  } catch (err) {
    console.error("Error finding post:", err);
    res.status(500).send("Error finding post");
  }
});

// UPDATE route - handle edit form submission (Admin only)
app.post("/posts/:postId/edit", requireAdmin, async (req, res) => {
  const requestedPostId = req.params.postId;
  const { postTitle, postBody } = req.body;
  
  try {
    await Post.findByIdAndUpdate(requestedPostId, {
      title: postTitle,
      content: postBody
    });
    res.redirect("/admin");
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Error updating post");
  }
});

app.get("/about", async (req, res) => {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", async (req, res) => {
  res.render("contact", {
    contactContent: contactContent
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server started on port ${PORT}`);
});
