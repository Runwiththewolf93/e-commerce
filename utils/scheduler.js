import Product from "../models/Products";
import schedule from "node-schedule";

const job = schedule.scheduleJob("0 12 * * *", async function () {
  const products = await Product.find({});

  products.forEach(async product => {
    if (
      product.discount &&
      product.discount.startDate &&
      product.discount.endDate
    ) {
      if (
        new Date(product.discount.startDate) >=
        new Date(product.discount.endDate)
      ) {
        product.discount.percentage = 0;
        await product.save();
      }
    }
  });
});
