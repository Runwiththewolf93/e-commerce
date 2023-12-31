import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log("Mongo connection successful");
  } catch (error) {
    throw new Error("Error connecting to mongodb.");
  }
};

export default connect;
