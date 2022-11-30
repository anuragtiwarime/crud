## BACKEND Notes

Let us create 2 files `app.js` and `server.js`

Next let's initialize a `package.json` file, to do so we need to run `npm init -y`

Now we have our `package.json` file, let's add a couple of scripts in here so that we can run our server

As you see we already have a start and test script, we will now add another script which will help us in our development.

```json
  "dev": "nodemon server.js"
```

After adding the above script inside your `package.json` your scripts section should look something like this

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

Now lets start by installing a couple of dependencies that we need

To install these dependencies run the following command inside your terminal

```bash
  npm i express mongoose dotenv
```

We also need a dev dependency that is nodemon, to install a dev dependency we add an additional flag -D

```bash
npm i -D nodemon
```

Now let us start by opening our `app.js` and add the following lines of code in `app.js`

```js
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;
```

We are importing express, adding a get home route which will send Hello World and exporting the app variable.

Now lets go to `server.js` and import the app that we just exported.

```js
const app = require("./app");

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
```

As you can see we have process.env.PORT so lets import dotenv and invoke config method in it so our environment variables get populated in process.env and we can then access them in our app.

Lets go to our `app.js` file and at the top of this file lets import dotenv as such

```js
require("dotenv").config();
```

Now create a `.env` file in the root of your backend folder and add `PORT = 8000`

Now lets run our server, open your terminal in your backend root directory and run `npm run dev`

Our server should be running at http://localhost:8000/

Next lets create a user model where we will define our userschema

Create a file `userModel.js` under a folder called models

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [20, "Name must be less than 20 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
```

In the above code we are importing mongoose and creating a user schema and at the end we are generating a model from the user schema and exporting it so we can use it in other files.

Now lets create a connection to DB

Create a folder named config and create a file `db.js` inside it

```js
const mongoose = require("mongoose");

const connectToDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`Connecte DB: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
};

module.exports = connectToDB;
```

We are importing mongoose and creating a connection to our database and if successful then will run else the catch will run and exporting the connectToDB()

Now lets import connectToDB() in our `app.js` and invoke it

In our `app.js` import connectToDB and after const app = express() write

```js
// Initialising connection to DB
connectToDB();
```

Now the final step inside our `.env` file let us add another variable MONGO_URI of our DB. In my case I will be using MongoDB local instance. For local MongoDB instance the URL is `mongodb://127.0.0.1:27017/mernCrud`

Finally if we restart our server we should have something like this printed in our terminal

```bash
App is running at http://localhost:8000
Connecte DB: 127.0.0.1
```

This means our app is connected successfully to DB

Now lets start creating some routes and write some logic, YAY!!!

Go to `app.js` and cut the / route we created and create a new folder called routes and inside routes folder create a new file `userRoutes.js` and write the following code

```js
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from Backend");
});

module.exports = router;
```

Now go back to app.js and import this file as follows

```js
const userRoutes = require("./routes/userRoutes");

app.use("/", userRoutes);
```

Since we exported router as default we can name it anything. Hence I have named it as userRoutes for sake of simplicity

As of now we only have one route but imagine we have 10s of routes then, this file will get too big and would be hard to handle later.

So to prevent that from happening let us break the logic from routes and create a new folder called controllers and inside that create a file `userController.js`

Now from the routes copy the callback inside the router.get and paste it in userController.js file as shown below

```js
exports.home = (req, res) => {
  res.send("Hello from Backend");
};
```

We are exporting the controller as home now let us go back to the `userRoutes.js` file and add home in place of the callback and make sure that it is also imported at the top.

Now our userRoutes.js file should look something like this

```js
const express = require("express");
const { home } = require("../controllers/userController");

const router = express.Router();

router.get("/", home);

module.exports = router;
```

We do not have to do any other change and everything should work as it should

Before we forget let us add some built in express middlewares so we can parse the incoming data properly.

In `app.js` add the folowing after the const app = express()

```js
// Express middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

Now lets create a route for user creation

In our `userController.js` write the following code

```js
exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      throw new Error("Name and Email are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      throw new Error("Email already exists");
    }

    const user = await User.create({
      name,
      email,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

Next create a route inside `userRoutes.js` as follows

```js
router.post("/createUser", createUser);
```

Also make sure you are importing createUser at the top

Now you can check this by making a post request using postman or any other software of your choice. If everything is correct then all the validations must be kicking in and we should be able to register the user

Now lets create another route where we can get all the users info

First lets code the controller logic in `userController.js`

```js
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

Now in `userRoutes.js` file create a route as follows

```js
router.get("/getUsers", getUsers);
```

Do not forget to import getUsers at the top

This is a get request since we just want to get the users.

Next up lets create the edit users route, to do that navigate to `userController.js` file and do the following

```js
exports.editUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

Now we need to create a route for edit users controller so back in our `userRoutes.js` file

```js
router.put("/editUser/:id", editUser);
```

Also import the controller at the top

We can see something new in the route i.e.., /:id, this is a param that has to be passed with the id and we can get it via `req.params.id` as we saw in the editUser controller. We need to add it in the route

Now we are done with `CRU`D, next up lets complete the `D`

In `userController.js`

```js
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
```

In `userRoutes.js` add a route for deleteUser

```js
router.delete("/deleteUser/:id", deleteUser);
```

Now our backend in finished
