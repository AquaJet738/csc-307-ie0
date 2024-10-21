import express from "express";
import cors from "cors";
import UserService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING)
  .catch((error) => console.log(error));


const app = express();
const port = 8000;

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor"
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer"
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor"
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress"
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender"
    },
	{
      id: "asd248",
      name: "plant",
      job: "plant"
    }
  ]
};

const findUserByName = (name) => {
  return users["users_list"].filter(
    (user) => user["name"] === name
  );
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

const deleteUser = (id) => {
	users["users_list"] = users["users_list"].filter((user) => user["id"] != id);
};
 

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// get all users
app.get("/users", (req, res) => {
	const name = req.query.name;
	const job = req.query.job;
	UserService.getUsers(name, job).then(req.send(users)).catch((error) => {console.log(error)});
});

// get users by name (and job)
app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  
  UserService.findUserByName(name).then(UserService.findUserByJob(job).then((result) => {
	  res.send(result)})
  ).catch((error) => {console.log(error)});
  
  if (name != undefined) {
    let promise = UserService.findUserByName(name);
	if (job != undefined) {
		result = result.filter((user) => user["job"] === job);
	}
	
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

// get users by ID
app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let promise = UserService.findUserById(id).then( {
	if (result === undefined) {
      res.status(404).send("Resource not found.");
	} else {
      res.send(result);
	}
  }).catch((error) => {console.log(error)});
});

// POST request code
app.post("/users", (req, res) => {
  const userToAdd = req.body;
  let promise = UserService.addUser(userToAdd)
	.then(res.status(201).send(userToAdd))
	.catch((error) => {console.log(error)});
});

// DELETE request code
app.delete("/users/:id", (req, res) => {
	const id = req.params["id"];
	deleteUser(id);
	res.send();
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});