const express = require("express");
const router = express.Router();

const { ensureAuthenticated } = require("../utils/validations/index");

const Notification = require("../models/Notification");

// Get user notifications
router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      attributes: ["text"],
      where: {
        userId: req.user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!notifications.length) {
      return res.status(404).json({
        statusCode: 404,
        msg: "You do not have new notifications!",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: notifications,
    });
  } catch (error) {
    return next("Error trying to get all notifications from a user");
  }
});

module.exports = router;
