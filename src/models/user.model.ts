import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username must not exceed 30 characters"],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
      minlength: [3, "Company Name must be at least 3 characters long"],
      maxlength: [30, "Company Name must not exceed 30 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props:any) => `${props.value} is not a valid email address`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    status : {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    }
  },
  {
    timestamps: true,
  }
);

// Export the model
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
