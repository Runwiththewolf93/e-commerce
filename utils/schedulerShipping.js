import Order from "../models/Orders";
import schedule from "node-schedule";
import connect from "./db";

const shippingJob = schedule.scheduleJob("30 16 * * *", async function () {
  try {
    await connect();

    const currentDate = new Date().getTime();
    const orders = await Order.find({
      orderStatus: "Processed",
      isDelivered: false,
      deliveryTime: { $lte: currentDate },
    });

    for (const order of orders) {
      console.log(`Updating order ${order._id} to Delivered`);
      order.isDelivered = true;
      order.deliveredAt = currentDate;
      order.orderStatus = "Delivered";
      await order.save();
    }
  } catch (error) {
    console.error("Scheduler Error:", error);
  }
});
