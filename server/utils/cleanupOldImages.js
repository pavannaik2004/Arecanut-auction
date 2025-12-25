const Auction = require("../models/Auction");
const { deleteImage } = require("./uploadImage");

/**
 * Delete old auction images from Cloudinary
 * Removes images from auctions older than specified days
 * @param {number} daysOld - Number of days to consider as old (default: 90)
 */
const cleanupOldImages = async (daysOld = 90) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Find auctions older than cutoff date with images
    const oldAuctions = await Auction.find({
      createdAt: { $lt: cutoffDate },
      imagePublicId: { $exists: true, $ne: null },
    });

    console.log(
      `Found ${oldAuctions.length} auctions with images older than ${daysOld} days`
    );

    let deletedCount = 0;
    let failedCount = 0;

    for (const auction of oldAuctions) {
      try {
        // Delete from Cloudinary
        await deleteImage(auction.imagePublicId);

        // Remove image references from database
        auction.image = null;
        auction.imagePublicId = null;
        await auction.save();

        deletedCount++;
        console.log(`Deleted image for auction ${auction._id}`);
      } catch (error) {
        failedCount++;
        console.error(
          `Failed to delete image for auction ${auction._id}:`,
          error.message
        );
      }
    }

    console.log(
      `Cleanup complete: ${deletedCount} deleted, ${failedCount} failed`
    );

    return {
      total: oldAuctions.length,
      deleted: deletedCount,
      failed: failedCount,
    };
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
};

/**
 * Delete image when auction is deleted
 * @param {string} auctionId - Auction ID
 */
const deleteAuctionImage = async (auctionId) => {
  try {
    const auction = await Auction.findById(auctionId);

    if (auction && auction.imagePublicId) {
      await deleteImage(auction.imagePublicId);
      console.log(`Deleted image for auction ${auctionId}`);
    }
  } catch (error) {
    console.error(
      `Failed to delete image for auction ${auctionId}:`,
      error.message
    );
    // Don't throw - allow auction deletion to proceed even if image deletion fails
  }
};

module.exports = {
  cleanupOldImages,
  deleteAuctionImage,
};
