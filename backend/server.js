const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("mongoDb is connected");
    app.listen(process.env.PORT, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

const userSchema = mongoose.Schema({
  userId: String,
  questionId: String,
  category: String,
  question: String,
  optionType: String,
  options: [
    {
      id: String,
      value: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const specificUserSchema = mongoose.Schema({
  userId: String,
  fullName: String,
  dob: String,
  gender: String,
  userName: String,
  email: String,
  password: String,
});

const postedPollSchema = mongoose.Schema({
  questionId: String,
  userId: String,
  selectedOptionId: {
    type: [String],
  },
  votedAt: String,
});

const postedPollModel = new mongoose.model("postedPolls", postedPollSchema);
const userModel = new mongoose.model("polls", userSchema);
const userListModel = new mongoose.model("users", specificUserSchema);

const authenticateToken = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token");
  } else {
    jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token");
      } else {
        request.username = payload.username;
        request.userid = payload.userid;
        next();
      }
    });
  }
};

app.post("/sign-up", async (req, res) => {
  const { userId, fullName, dob, gender, userName, email, password } = req.body;
  const isUserNameExists = await userListModel.find(
    { userName: `${userName}` },
    { userName: 1 }
  );
  const isEmailExists = await userListModel.find(
    { email: email },
    { email: 1 }
  );

  const encryptPassword = await bcrypt.hash(req.body.password, 10);

  if (
    isUserNameExists.length !== 0 &&
    isUserNameExists[0].userName === userName
  ) {
    res.status(400).send({ msg: "username already exists!" });
  } else if (isEmailExists.length !== 0 && isEmailExists[0].email === email) {
    res.status(400).send({ msg: "Email already exists!" });
  } else {
    try {
      await userListModel.insertOne({
        userId,
        fullName,
        dob,
        gender,
        userName,
        email,
        password: encryptPassword,
      });
      res.status(200).send({ msg: "User has been added!!" });
    } catch (e) {
      console.log(e);
      res.status(400).send(e);
    }
  }
});

app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const isUserExists = await userListModel.find({ userName: userName });

  if (isUserExists.length === 0) {
    res.status(400).send({ msg: "Invalid Username!!" });
  } else {
    const loggedUserId = isUserExists[0].userId
    const isCorrectPassword = await bcrypt.compare(
      password,
      isUserExists[0].password
    );
    if (isCorrectPassword) {
      const payload = {
        username: userName,
        userid: loggedUserId,
      };
      const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
      res.send({ jwtToken });
    } else {
      res.status(400).send({ msg: "Incorrect password!!" });
    }
  }
});

// app.get("/sign-up", async (req, res) => {
//   await userListModel.insertOne({
//     fullName: "cdcb",
//     dob: "2025-06-03",
//     gender: "MALE",
//     userName: "swadefv",
//     email: "22ec137@stjosephs.ac.in",
//     password: "ftgyhujkhgvfc",
//   });
//   res.send({ msg: "successfull" });
// });

app.post("/add-poll", authenticateToken, async (req, res) => {
  const { questionId, category, question, optionType, options, createdAt } =
    req.body;
  try {
    await userModel.insertOne({
      userId: req.userid,
      questionId,
      category,
      question,
      optionType,
      options,
      createdAt,
    });
    res.status(200).send({ message: "Poll Has Been Added!" });
  } catch (e) {
    res.status(401).send(e);
  }
});

////////////////////////////// delete /////////////////
app.get("/delete", async (req, res) => {
  await postedPollModel.deleteMany({});
  res.send("ok");
});
////////////////////////////////////////////////////////

app.get("/get-polls", authenticateToken, async (req, res) => {
  try {
    const currentUser = req.userid;

    const livePollDetails = await userModel.find();
    const postedPollDetails = await postedPollModel.find({
      userId: currentUser,
    });

    let filteredPolls;

    if (postedPollDetails.length === 0) {
      filteredPolls = livePollDetails;
    } else {
      filteredPolls = livePollDetails.filter(
        (livePoll) =>
          !postedPollDetails.some(
            (postedPoll) => postedPoll.questionId === livePoll.questionId
          )
      );
    }
    res.send(filteredPolls); // ✅ Send the correctly filtered polls
  } catch (e) {
    res.status(400).send({ message: "Something went wrong" });
  }
});

app.post("/answered-polls", authenticateToken, async (req, res) => {
  const { questionId, selectedOptionId, votedAt } = req.body;
  const pollData = {
    questionId,
    userId: req.userid,
    selectedOptionId,
    votedAt,
  };
  try {
    if (pollData === null) {
      res.status(400).send({ msg: "Something went wrong" });
    } else {
      await postedPollModel.insertOne({
        ...pollData,
      });
      res.status(200).send({ msg: "Your response is added!!" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.get("/my-polls", authenticateToken, async (req, res) => {
  const createdPolls = await userModel.find({ userId: req.userid });
  res.send(createdPolls);
});

app.get("/my-polls/poll/:qnsid", async (req, res) => {
  const { qnsid } = req.params;

  try {
    const questionDetail = await userModel.findOne({ questionId: qnsid });

    const results = await postedPollModel.aggregate([
      { $match: { questionId: qnsid } },
      { $unwind: "$selectedOptionId" },
      {
        $group: {
          _id: "$selectedOptionId",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          optionId: "$_id",
          votes: "$count",
          _id: 0,
        },
      },
    ]);

    res.send({
      questionDetails: questionDetail,
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Failed to fetch poll data" });
  }
});

app.get("/voted-polls", authenticateToken, async (req, res) => {
  try {
    const votedPolls = await postedPollModel.find({
      userId: req.userid,
    });

    const questionIds = votedPolls.map((poll) => poll.questionId);
    const allVotesDetail = await postedPollModel.find({
      questionId: { $in: questionIds },
    });
    const questionDetails = await userModel.find({
      questionId: { $in: questionIds },
    });

    const result = {
      questionDetails,
      votedDetails: votedPolls,
      allVotesDetail,
    };
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error });
  }
});

app.delete("/delete-poll/:qnsid", authenticateToken, async (req, res) => {
  const { qnsid } = req.params;

  try {
    // Ensure the poll belongs to the logged-in user
    const poll = await userModel.findOne({ questionId: qnsid, userId: req.userid });

    if (!poll) {
      return res.status(404).send({ msg: "Poll not found or you are not authorized" });
    }

    // Delete poll
    await userModel.deleteOne({ questionId: qnsid, userId: req.userid });

    // (Optional) Delete votes related to that poll
    await postedPollModel.deleteMany({ questionId: qnsid });

    res.status(200).send({ msg: "Poll deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: "Something went wrong while deleting poll" });
  }
});

