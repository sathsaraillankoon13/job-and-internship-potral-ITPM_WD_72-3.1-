const Notification = require("../models/Notification");

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({}).sort({ sentAt: -1, createdAt: -1 }).limit(20);
    const unreadCount = await Notification.countDocuments({ isRead: false });

    res.json({
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getNotifications,
  markNotificationRead,
};