import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";

const CreateAuction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    variety: "",
    quantity: "",
    qualityGrade: "",
    basePrice: "",
    location: "",
    endTime: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMode, setUploadMode] = useState("file"); // 'file' or 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
      setImageFile(null);
    } else {
      setImagePreview("");
    }
    setError("");
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration missing");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "arecanut-auctions");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );

    return {
      url: response.data.secure_url,
      publicId: response.data.public_id,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      let imageData = {};

      // Upload image to Cloudinary if file selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadResult = await uploadToCloudinary(imageFile);
        imageData = {
          image: uploadResult.url,
          imagePublicId: uploadResult.publicId,
        };
        setUploadingImage(false);
      }
      // Use URL if provided
      else if (imageUrl) {
        imageData = {
          image: imageUrl,
        };
      }

      await axios.post(API_ENDPOINTS.createAuction, {
        ...formData,
        ...imageData,
      });

      navigate("/farmer/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Error creating auction"
      );
      setUploadingImage(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      <h2 className="text-2xl font-bold font-heading mb-6">
        Create New Auction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1">Arecanut Variety</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Rashi"
              value={formData.variety}
              onChange={(e) =>
                setFormData({ ...formData, variety: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Quantity (kg)</label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1">Quality Grade</label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.qualityGrade}
              onChange={(e) =>
                setFormData({ ...formData, qualityGrade: e.target.value })
              }
              required
            >
              <option value="">Select Grade</option>
              <option value="A+">A+ (Export Quality)</option>
              <option value="A">A (Premium)</option>
              <option value="B">B (Standard)</option>
              <option value="C">C (Low)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">APMC Location</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              placeholder="e.g. Shimoga"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-1">
              Base Price (per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                className="w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Auction End Time</label>
            <input
              type="datetime-local"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-medium">
            Product Image (Optional)
          </label>

          {/* Upload Mode Selector */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setUploadMode("file");
                setImageUrl("");
                if (imageUrl) setImagePreview("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                uploadMode === "file"
                  ? "border-primary bg-green-50 text-primary font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => {
                setUploadMode("url");
                setImageFile(null);
                if (imageFile) setImagePreview("");
              }}
              className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                uploadMode === "url"
                  ? "border-primary bg-green-50 text-primary font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <Link className="w-4 h-4 inline mr-2" />
              Image URL
            </button>
          </div>

          {/* File Upload Mode */}
          {uploadMode === "file" && (
            <>
              {!imagePreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-green-50 transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-gray-400 group-hover:text-primary mb-3 transition-colors" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                    <p className="text-white text-xs truncate">
                      {imageFile?.name || "Image preview"}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* URL Input Mode */}
          {uploadMode === "url" && (
            <div className="space-y-3">
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={handleUrlChange}
                />
              </div>
              {imagePreview && (
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={() => {
                      setError("Invalid image URL");
                      setImagePreview("");
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/farmer/dashboard")}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-800 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || uploadingImage}
          >
            {uploadingImage
              ? "Uploading Image..."
              : loading
              ? "Creating..."
              : "Create Auction"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
