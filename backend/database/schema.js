import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const saltRounds = 10

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return !/\s/.test(v); // no spaces
            },
            message: props => `${props.value} should not contain spaces`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    video_root: {
        type: String,
        required: [true, "Video root is required"],
        trim: true,
        default: function () {
            return `${process.env.VIDEO_ROOT_DIR}/video/${this.username}`
        }
    }
});

console.log("Adding command hooks for User...")
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

console.log("Adding command comparePassword method...")
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};


const User = mongoose.model('user', userSchema);

export default User