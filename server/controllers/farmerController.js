const Auction = require("../models/Auction");
const { uploadImage, deleteImage } = require("../utils/uploadImage");

// Create New Auction
exports.createAuction = async (req, res) => {
  try {
    const { variety, quantity, qualityGrade, basePrice, location, endTime } =
      req.body;

    let imageUrl = null;
    let imagePublicId = null;

    // If file is uploaded via multer
    if (req.file) {
      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const uploadResult = await uploadImage(dataURI, "arecanut-auctions");
      imageUrl = uploadResult.url;
      imagePublicId = uploadResult.publicId;
    }
    // If image URL is provided directly (from client-side upload)
    else if (req.body.image) {
      imageUrl = req.body.image;
      imagePublicId = req.body.imagePublicId;
    }

    const auction = new Auction({
      farmer: req.user.id, // From auth middleware
      variety,
      quantity,
      qualityGrade,
      basePrice,
      currentHighestBid: basePrice, // Start with base price
      location,
      endTime,
      image: imageUrl,
      imagePublicId: imagePublicId,
      status: "active",
    });

    await auction.save();
    res.status(201).json({ message: "Auction created successfully", auction });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Get My Auctions (For Farmer Dashboard)
exports.getMyAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find({ farmer: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
