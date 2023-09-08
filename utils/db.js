import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Mongo connection successful");
  } catch (error) {
    throw new Error("Error in connecting to mongodb.");
  }
};

export default connect;
