import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api/axios';

const ListPropertyPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    region: '',
    propertyType: '',
    rentAmount: '',
    currency: 'PKR',
    numberOfBedrooms: '',
    numberOfBathrooms: '',
    areaSqFt: '',
    amenities: [],
    images: [],
  });

  const [message, setMessage] = useState('');
  const [previewImages, setPreviewImages] = useState([]);

  const amenitiesList = [
    'Air Conditioning',
    'Parking',
    'Furnished',
    'Security',
    'Balcony',
    'Internet',
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      amenities: checked ? [...prev.amenities, value] : prev.amenities.filter((a) => a !== value),
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, images: files }));

    // For preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      // Append text fields
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'amenities') return; // handle separately
        if (key === 'images') return; // handle separately
        formData.append(key, value);
      });

      // Append amenities array
      form.amenities.forEach((a) => formData.append('amenities', a));

      // Append image files
      form.images.forEach((img) => formData.append('images', img));

      const res = await API.post('/v1/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status === 'success') {
        toast.success('Property listed successfully!');
        setTimeout(() => navigate('/owner-dashboard'), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Listing failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url('/images/hero1.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/60 to-black/80 backdrop-blur-sm" />

      {/* Glass Card */}
      <div
        className="
      relative z-10 w-full
      max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl
      bg-white/10 backdrop-blur-lg ring-1 ring-white/10
      p-8 sm:p-10 rounded-2xl shadow-2xl space-y-6
    "
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-center">Add Property</h2>
        <p className="text-center text-green-300 text-sm sm:text-base">
          Fill in the property details to list it on Rentofix
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Details */}
          <input
            name="title"
            placeholder="Property Title"
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
            className="w-full h-24 resize-none bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <input
            name="address"
            placeholder="Street Address"
            onChange={handleChange}
            required
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              name="region"
              placeholder="Region"
              onChange={handleChange}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* Property Type */}
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            required
            className="w-full max-w-sm bg-green-900 text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
          >
            <option value="" disabled>
              Select Property Type
            </option>
            <option value="house">House</option>
            <option value="office">Office</option>
            <option value="shop">Shop</option>
          </select>

          {/* Rent and Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="rentAmount"
              type="number"
              placeholder="Rent (PKR)"
              onChange={handleChange}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <input
              name="areaSqFt"
              type="number"
              placeholder="Area (sqft)"
              onChange={handleChange}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

          {/* Bedrooms & Bathrooms */}
          {form.propertyType === 'house' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                name="numberOfBedrooms"
                type="number"
                placeholder="Bedrooms"
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
              <input
                name="numberOfBathrooms"
                type="number"
                placeholder="Bathrooms"
                onChange={handleChange}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              />
            </div>
          )}

          {/* Amenities */}
          <div>
            <label className="block text-white font-semibold mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenitiesList.map((item) => (
                <label
                  key={item}
                  className="flex items-center p-2 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition space-x-2"
                >
                  <input
                    type="checkbox"
                    value={item}
                    checked={form.amenities.includes(item)}
                    onChange={handleAmenityChange}
                    className="h-4 w-4 accent-green-500"
                  />
                  <span className="text-white text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-white font-semibold mb-2">Property Images</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full bg-white/10 border border-white/20 text-white file:bg-green-500 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-none hover:file:bg-green-600 file:cursor-pointer rounded-lg p-2"
            />
            {previewImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previewImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Preview"
                    className="h-20 w-full object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:ring-2 focus:ring-green-400"
          >
            List Property
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-green-300 hover:underline"
              onClick={() => navigate('/owner-dashboard')}
            >
              Back to Dashboard
            </button>
          </div>

          {message && (
            <p className="text-center text-sm text-red-400 mt-4 animate-fade-in">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListPropertyPage;
