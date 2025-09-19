import AuctionItem from "../models/auctionitem.js";
import Bid from "../models/bid.js";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

// CREATE AUCTION ITEM
export const createAuctionItem = async (req, res) => {
  const { title, description, startingBid, endDate } = req.body;
  const userId = req.user.id;

  try {
    const newDate = new Date(new Date(endDate).getTime());
    const now = Date.now();

    if (newDate <= now) {
      return res
        .status(400)
        .json({ message: "End Date must be in the future" });
    }

    const auctionItem = await AuctionItem.create({
      title,
      description,
      startingBid,
      endDate: newDate,
      createdBy: userId,
    });

    return res.status(201).json(auctionItem);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET ALL AUCTIONS
export const getAuctionItems = async (req, res) => {
  try {
    const auctionItems = await AuctionItem.find();
    return res.status(200).json(auctionItems);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET AUCTION BY ID
export const getAuctionItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const auctionItem = await AuctionItem.findById(id);
    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }
    return res.status(200).json(auctionItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET AUCTIONS CREATED BY LOGGED-IN USER
export const getAuctionItemsByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const auctionItems = await AuctionItem.find({ createdBy: userId });
    return res.status(200).json({ auctionItems });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// UPDATE AUCTION ITEM
export const updateAuctionItem = async (req, res) => {
  const { id } = req.params;
  const { title, description, startingBid, endDate } = req.body;
  const userId = req.user.id;

  try {
    const auctionItem = await AuctionItem.findById(id);

    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }

    if (auctionItem.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    auctionItem.title = title || auctionItem.title;
    auctionItem.description = description || auctionItem.description;
    auctionItem.startingBid = startingBid || auctionItem.startingBid;
    auctionItem.endDate = endDate
      ? new Date(new Date(endDate).getTime())
      : auctionItem.endDate;
    auctionItem.updatedAt = new Date();

    await auctionItem.save();

    return res.json(auctionItem);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DELETE AUCTION ITEM
export const deleteAuctionItem = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const auctionItem = await AuctionItem.findById(id);

    if (!auctionItem) {
      return res.status(404).json({ message: "Auction item not found" });
    }

    if (auctionItem.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await Bid.deleteMany({ auctionItemId: id });
    await AuctionItem.findByIdAndDelete(id);

    return res.json({ message: "Auction item removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET AUCTION WINNER
export const getAuctionWinner = async (req, res) => {
  const { id } = req.params;
  try {
    const auctionItem = await AuctionItem.findById(id);
    if (!auctionItem) {
      return res
        .status(404)
        .json({ winner: "", message: "Auction item not found" });
    }

    if (new Date(auctionItem.endDate) > Date.now()) {
      return res
        .status(400)
        .json({ winner: "", message: "Auction has not ended yet" });
    }

    const bids = await Bid.find({ auctionItemId: id });
    if (bids.length === 0) {
      return res.status(200).json({ winner: "", message: "No bids found" });
    }

    let highestBid = bids.reduce(
      (max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
      bids[0]
    );

    const winner = await User.findById(highestBid.userId);
    if (!winner) {
      return res.status(404).json({ winner: "", message: "Winner not found" });
    }

    return res.status(200).json({ winner });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET AUCTIONS WON BY LOGGED-IN USER
export const getAuctionsWonByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const bidsByUser = await Bid.find({ userId });
    const auctionIds = [...new Set(bidsByUser.map((bid) => bid.auctionItemId))];

    let wonAuctions = [];

    for (let auctionItemId of auctionIds) {
      const bids = await Bid.find({ auctionItemId });
      let winningBid = bids.reduce(
        (max, bid) => (bid.bidAmount > max.bidAmount ? bid : max),
        bids[0]
      );

      const auctionItem = await AuctionItem.findById(auctionItemId);
      const isAuctionEnded = new Date(auctionItem.endDate) <= Date.now();

      if (isAuctionEnded && winningBid.userId.toString() === userId) {
        wonAuctions.push({
          auctionId: auctionItemId,
          title: auctionItem.title,
          description: auctionItem.description,
          winningBid: winningBid.bidAmount,
          endDate: auctionItem.endDate,
        });
      }
    }

    return res.status(200).json({ wonAuctions });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
