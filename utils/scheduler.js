import Product from "../models/Products";
import schedule from "node-schedule";
import connect from "./db";

const job = schedule.scheduleJob("0 12 * * *", async function () {
  try {
    await connect();

    const products = await Product.find({});
    const currentDate = new Date();

    products.forEach(async product => {
      if (
        product.discount &&
        product.discount.startDate &&
        product.discount.endDate
      ) {
        if (currentDate >= new Date(product.discount.endDate)) {
          product.discount.percentage = 0;
          await product.save();
        }
      }
    });
  } catch (error) {
    console.error("Scheduler Error:", error);
  }
});
