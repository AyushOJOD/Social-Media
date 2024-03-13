import { Message } from "../models/messageModel.js";

export const addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.json({ message: "Message added to database", status: true });
    } else {
      return res.json({ message: "Message failed ", status: false });
    }
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.query;

    const messages = await Message.find({
      users: { $all: [from, to] },
    }).sort({ updatedAt: 1 });

    const projectMessages = messages.map((message) => {
      return {
        fromSelf: message.sender.toString() === from,
        messages: message.message.text,
      };
    });

    res.json(projectMessages);
  } catch (error) {
    next(error);
  }
};
