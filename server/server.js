require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Race = require("./models/Competition");
const jwt = require("jsonwebtoken");
const requireAuth = require("./middlewares/requireAuth");

//TOKEN CREATION
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//MAIN PAGE
app.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    console.log(users);
    res.render("admin.ejs", { users });
  } catch (error) {
    res.status(500).json({ msg: "Felhasználó hiba" });
  }
});

app.post("/regisztral", async (req, res) => {
  try {
    const { email, jelszo, jelszoismetles } = req.body;
    const user = await User.signup(email, jelszo, jelszoismetles);

    const token = createToken(user._id, user.isAdmin);
    console.log({ email, jelszo, token });
    res.status(200).json({ msg: "Sikeres regisztráció", email, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

//USER
app.post("/belepes", async (req, res) => {
  try {
    const { email, jelszo } = req.body;
    const user = await User.login(email, jelszo);
    const token = createToken(user._id);
    console.log(email, token);
    res.status(200).json({ msg: "Sikeres belépés", email, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

app.use(requireAuth);

//RACE
app.get("/verseny", async (req, res) => {
  try {
    const race = await Race.find({});
    res.status(200).json({ msg: race });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt" + error.message });
  }
});

app.post("/verseny", async (req, res) => {
  try {
    const {
      nev,
      vtipus,
      vszint,
      verseny,
      agazat,
      vforma,
      helyezes,
      tanulok,
      tanarok,
    } = req.body;
    console.log(req.body);
    const newRace = new Race({
      nev,
      vtipus,
      vszint,
      verseny,
      agazat,
      vforma,
      helyezes,
      tanulok,
      tanarok,
    });
    await newRace.save();
    res.status(200).json({ msg: "Sikeres adat létrehozás!" });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt" + error.message });
  }
});

app.put("/verseny", async (req, res) => {
  try {
    const {
      paramId,
      nev,
      vtipus,
      vszint,
      verseny,
      agazat,
      vforma,
      helyezes,
      tanulok,
      tanarok,
    } = req.body;

    await Race.findOneAndUpdate(
      { _id: paramId },
      {
        nev,
        vtipus,
        vszint,
        verseny,
        agazat,
        vforma,
        helyezes,
        tanulok,
        tanarok,
      },
      { new: true }
    );
    res.status(201).json({ msg: "Sikeres adat módosítás!" });
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt!" });
  }
});

app.delete("/verseny", async (req, res) => {
  try {
    const body = req.body;
    const toroltAdat = await Race.findOneAndDelete({ _id: body.id }).exec();
    console.log(toroltAdat);
    if (toroltAdat) {
      res.status(200).json({ msg: "Sikeres adat törlés!" });
    } else {
      res.status(404).json({ msg: "A felhasználó nem található!" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Valami hiba történt!" });
  }
});

const port = process.env.PORT || 3500;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Sikeres adatbázis elérés!"))
  .catch(() => console.log(error.message));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
