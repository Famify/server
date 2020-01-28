const { Schema, model } = require("mongoose");
const { hashPassword, checkPassword } = require("../helpers/bcrypt");
const uuidv1 = require("uuid/v1");

const parentSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "nama pengguna wajib diisi"],
      validate: [
        {
          validator: isUsernameUnique,
          message: "nama pengguna telah digunakan",
        },
      ],
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, "email wajib diisi"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "format email invalid",
      ],
      validate: [
        { validator: isEmailUnique, message: "email telah teregistrasi" },
      ],
    },
    password: {
      type: String,
      required: [true, "kata sandi wajib diisi"],
      minlength: [8, "kata sandi minimal 8 karakter"],
    },
    childrens: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    familyId: {
      type: String,
      default: function genUUID() {
        return uuidv1();
      },
    },
    avatar: String,
    role: {
      type: String,
      default: "parent",
    },
    tokenExpo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//validation
function isEmailUnique(value) {
  return Parent.findOne({ email: value }).then(found => {
    if (found) return false;
    else return true;
  });
}

function isUsernameUnique(value) {
  return Parent.findOne({ username: value }).then(found => {
    if (found) return false;
    else return true;
  });
}

//hashPassword
parentSchema.pre("save", function(next) {
  this.password = hashPassword(this.password);
  next();
});

const Parent = model("Parent", parentSchema);

module.exports = Parent;
