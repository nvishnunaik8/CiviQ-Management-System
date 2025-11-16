import * as React from 'react';
import { useState, useEffect, useContext } from "react";
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Camera,
  MapPin,
  Mic,
  House,
  Send,
  User,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import toast from "react-hot-toast";

import Navigation from "../components/Navigation";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from '../Context/ThemeContext'; // using ThemeContext

export default function ReportPage() {
  const navigate = useNavigate();
  const { isDark } = useContext(ThemeContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    photo: null,
    photoPreview: null,
    latitude: null,
    longitude: null,
    address: "",
    reporter_name: "",
    reporter_email: "",
    reporter_phone: "",
    is_anonymous: false,
  });
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      toast.error("Login required");
      navigate("/login");
      return;
    }
  }, [])
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);

  const categories = [
    { value: "Roads", label: "Roads & Potholes", icon: "🚧" },
    { value: "Lighting", label: "Street Lighting", icon: "💡" },
    { value: "Sanitation", label: "Garbage & Waste", icon: "🗑️" },
    { value: "Parks", label: "Parks & Recreation", icon: "🌳" },
    { value: "Traffic", label: "Traffic & Parking", icon: "🚦" },
    { value: "Water", label: "Water & Utilities", icon: "💧" },
    { value: "Other", label: "Other Issues", icon: "❗" },
  ];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 300000 },
      );
    }
  }, []);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      );
      const data = await response.json();
      if (data.locality) {
        const address = `${data.locality}, ${data.principalSubdivision}, ${data.countryName}`;
        setFormData(prev => ({ ...prev, address }));
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const handlePhotoCapture = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationRefresh = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          reverseGeocode(position.coords.latitude, position.coords.longitude);
        },
        (error) => setError("Could not get your location. Please enable location services."),
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        toast.error("User Have To Login");
        navigate("/login");
        return;
      }
      if (!formData.title) { setSnackbarMessage("⚠️ Title is required!"); setOpen(true); return; }
      if (!formData.description) { setSnackbarMessage("⚠️ Description is required!"); setOpen(true); return; }
      if (!formData.category) { setSnackbarMessage("⚠️ Category is required!"); setOpen(true); return; }
      if (!formData.photo) { setSnackbarMessage("📷 Please upload a photo!"); setOpen(true); return; }

      const submitData = { ...formData };
      const file = submitData.photo;
      if (!file.type.startsWith("image/")) { setSnackbarMessage("❌ Please upload a valid image file (jpg, png, jpeg)"); setOpen(true); return; }

      const data = new FormData();
      data.append("file", formData.photo);
      data.append("upload_preset", import.meta.env.VITE_APP_API_UPLOAD_NAME);
      data.append("cloud_name", import.meta.env.VITE_APP_API_CLOUDINARY_NAME);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_APP_API_CLOUDINARY_NAME}/image/upload`, {
        method: "POST",
        body: data,
      });
      const uploadImage = await res.json();
      if (!uploadImage.url) throw new Error("Image upload failed");
      submitData.photo = uploadImage.url;

      if (isAnonymous) {
        submitData.is_anonymous = true;
      }

      const response = await fetch("https://hackathon-r2yi.onrender.com/api/Generateissue", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: token },
        body: JSON.stringify(submitData),
      });
      if (!response.ok) throw new Error("Failed to submit issue");

      toast.success("Issue successfully submitted!");
      setShowSuccess(true);

      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          category: "",
          photo: null,
          photoPreview: null,
          latitude: null,
          longitude: null,
          address: "",
          reporter_name: "",
          reporter_email: "",
          reporter_phone: "",
          is_anonymous: false,
        });
        setShowSuccess(false);
        setIsAnonymous(false);
      }, 3000);

    } catch (error) {
      console.error("Error submitting issue:", error);
      setSnackbarMessage("❌ " + error.message);
      setOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        message={snackbarMessage}
        action={action}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <div className={`absolute top-5 left-5 cursor-pointer p-2 border ${isDark?'border-white':'border-black'} rounded-full`}>
          <House color={`${isDark?'white':'black'}`} size={18} onClick={()=>navigate("/user-home")}/>
      </div>
      <div className={`min-h-screen py-4 px-4 ${isDark ? "bg-[#0A0A0A]" : "bg-[#F3F3F3]"}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-t-2xl p-6 ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"} border`}>
            <h1 className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-black"}`}>Report Civic Issue</h1>
            <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>Help improve your community by reporting problems quickly and easily</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`p-6 space-y-6 border-x ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"}`}>
            {error && <div className={`bg-red-50 dark:bg-red-900/20 border rounded-lg p-4 ${isDark ? "border-red-800" : "border-red-200"}`}>
              <p className={isDark ? "text-red-400" : "text-red-600"}>{error}</p>
            </div>}

            {/* Title */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Issue Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Brief description of the problem"
                className={`w-full p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
              />
            </div>

            {/* Category */}
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Category *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-3 rounded-lg border text-left transition-all duration-150 ${formData.category === cat.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : `${isDark ? "border-[#404040] bg-[#262626] text-gray-300 hover:border-gray-500" : "border-[#D9D9D9] bg-white text-gray-700 hover:border-gray-300"}`
                      }`}
                  >
                    <div className="text-xl mb-1">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Description *</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed information about the issue"
                rows={4}
                className={`w-full p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Photo Evidence</label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${isDark ? "border-[#404040]" : "border-[#D9D9D9]"}`}>
                {formData.photoPreview ? (
                  <div className="space-y-4">
                    <img src={formData.photoPreview} alt="Preview" className="max-w-full h-48 object-cover rounded-lg mx-auto" />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: null, photoPreview: null }))}
                      className={`font-medium ${isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-800"}`}
                    >Remove Photo</button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <Camera size={32} className={`mx-auto mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                    <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>Click to capture or upload a photo</p>
                    <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Address will be auto-detected"
                  className={`flex-1 p-3 border rounded-lg ${isDark ? "bg-[#262626] border-[#404040] text-white placeholder-gray-500" : "bg-white border-[#D9D9D9] text-black placeholder-gray-400"}`}
                />
                <button type="button" onClick={handleLocationRefresh} className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MapPin size={20} />
                </button>
              </div>
              {formData.latitude && formData.longitude && (
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}</p>
              )}
            </div>

            {/* Anonymous Toggle */}
            <div className={`flex items-center justify-between p-4 rounded-lg ${isDark ? "bg-[#262626]" : "bg-gray-50"}`}>
              <div className="flex items-center gap-3">
                {isAnonymous ? <EyeOff size={20} /> : <Eye size={20} />}
                <div>
                  <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Anonymous Report</p>
                  <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>Report without providing personal information</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous(!isAnonymous)}
                className={`w-12 h-6 rounded-full transition-colors ${isAnonymous ? "bg-blue-600" : (isDark ? "bg-gray-600" : "bg-gray-300")}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isAnonymous ? "translate-x-6" : "translate-x-0.5"}`} />
              </button>
            </div>
          </form>

          {/* Submit Button */}
          <div className={`p-6 rounded-b-2xl border ${isDark ? "bg-[#1E1E1E] border-[#333]" : "bg-white border-[#E6E6E6]"}`}>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
