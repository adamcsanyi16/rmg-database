const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    jelszo: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (email, jelszo, jelszoismetles) {
  if (!email || !jelszo || !jelszoismetles) {
    throw Error("Nem hagyhatsz üresen cellákat!");
  }
  if (!validator.isEmail(email)) {
    throw Error("Nem jó email formátum!");
  }
  if (jelszo != jelszoismetles) {
    throw Error("Nem egyezik a jelszó!");
  }
  if (!validator.isStrongPassword(jelszo)) {
    throw Error(
      "A jelszónak legalább 6 karakter hosszúságúnak kell lennie, tartalmaznia kell legalább egy nagybetűt, egy számot, egy kisbetűt és egy speciális karaktert!"
    );
  }

  const letezik = await this.findOne({ email });
  if (letezik) {
    throw Error("Az email már létezik!");
  }

  const hashedJelszo = await bcrypt.hash(jelszo, 10);
  const user = this.create({
    email,
    jelszo: hashedJelszo,
  });
  return user;
};

userSchema.statics.login = async function (email, jelszo) {
  if (!email || !jelszo) {
    throw Error("Nem hagyhatsz üresen cellákat!");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Ez az email nincs regisztrálva!");
  }

  const talalat = await bcrypt.compare(jelszo, user.jelszo);

  if (!talalat) {
    throw Error("A jelszó nem egyezik!");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
