import Product from "../models/Products";
import schedule from "node-schedule";
import connect from "./db";

const discountJob = schedule.scheduleJob("20 16 * * *", async function () {
  try {
    await connect();

    const products = await Product.find({});
    const currentDate = new Date().getTime();

    for (const product of products) {
      if (
        product.discount &&
        product.discount.startDate &&
        product.discount.endDate
      ) {
        const endDate = new Date(product.discount.endDate).getTime();
        if (currentDate >= endDate) {
          console.log(`Updating product ${product._id}`);
          product.discount.percentage = 0;
          product.discount.startDate = "";
          product.discount.endDate = "";
          await product.save();
        }
      }
    }
  } catch (error) {
    console.error("Scheduler Error:", error);
  }
});
