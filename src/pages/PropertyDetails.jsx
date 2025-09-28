import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import ReviewSection from '../pages/ReviewSection';
import { toast } from 'react-toastify';
import { FaStar } from 'react-icons/fa';
import Slider from 'react-slick';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLoading } from '../context/LoadingContext';
import {
  Building,
  Globe,
  MapPin,
  Home,
  Wallet,
  Ruler,
  Boxes,
  Bed,
  Bath,
  Check,
} from 'lucide-react';

const capitalize = (str) => str && str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const CustomPrevArrow = ({ onClick }) => (
  <div
    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-l-md cursor-pointer group"
    onClick={onClick}
    style={{ width: 40 }}
  >
    <span className="text-white group-hover:text-green-500 text-3xl font-bold transition-colors duration-200">
      &lt;
    </span>
  </div>
);

const CustomNextArrow = ({ onClick }) => (
  <div
    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-l-md cursor-pointer group"
    onClick={onClick}
    style={{ width: 40 }}
  >
    <span className="text-white group-hover:text-green-500 text-3xl font-bold transition-colors duration-200">
      &gt;
    </span>
  </div>
);

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();

  const [property, setProperty] = useState(null);
  // const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [hasAlreadyBooked, setHasAlreadyBooked] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);

  const [formData, setFormData] = useState({
    desiredMoveInDate: '',
    desiredLeaseDuration: '',
    messageFromTenant: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const res = await API.get(`/v1/properties/${id}`);
          const propertyData = res.data.data.data;

          // Capitalize fields
          propertyData.city = capitalize(propertyData.city);
          propertyData.region = capitalize(propertyData.region);
          propertyData.propertyType = capitalize(propertyData.propertyType);
          propertyData.availabilityStatus = capitalize(propertyData.availabilityStatus);
          propertyData.amenities = propertyData.amenities?.map(capitalize);

          setProperty(propertyData);

          if (parsedUser.role === 'tenant') {
            const bookingRes = await API.get(`/v1/bookings/myBooking/${id}`);
            const booking = bookingRes.data.data;

            if (booking) {
              setHasAlreadyBooked(true);
              setBookingStatus(booking.status);

              if (booking.status === 'approved') {
                setOwnerInfo({
                  name: `${capitalize(booking.ownerName?.split(' ')[0])} ${capitalize(
                    booking.ownerName?.split(' ')[1] || ''
                  )}`,
                  email: booking.ownerEmail,
                  phone: booking.ownerPhone,
                });
              }
            }
          }
        } catch (err) {
          console.error(err);
          toast.error('Failed to load property details or booking info.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      const fetchProperty = async () => {
        try {
          setIsLoading(true);
          const res = await API.get(`/v1/properties/${id}`);
          const propertyData = res.data.data.data;

          // Capitalize fields
          propertyData.city = capitalize(propertyData.city);
          propertyData.region = capitalize(propertyData.region);
          propertyData.propertyType = capitalize(propertyData.propertyType);
          propertyData.availabilityStatus = capitalize(propertyData.availabilityStatus);
          propertyData.amenities = propertyData.amenities?.map(capitalize);

          setProperty(propertyData);
        } catch (err) {
          toast.error('Failed to load property details.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/v1/bookings/createBooking/${id}`, formData);
      toast.success('Booking request submitted successfully!');
      setShowBookingForm(false);
      setHasAlreadyBooked(true);
      setFormData({
        desiredMoveInDate: '',
        desiredLeaseDuration: '',
        messageFromTenant: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting booking request.');
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  // if (loading)
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  //   );

  if (!property) return <div className="text-center text-red-600">Property not found</div>;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-2 sm:px-4 lg:px-6">
        <div className="max-w-7xl mb-12 mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-8 sm:p-12 space-y-12">
          {/* Title */}
          <h1 className="text-3xl font-extrabold text-white text-center">{property.title}</h1>

          {/* Property Info Section */}
          <section>
            <div className="flex flex-col justify-between items-center  sm:flex-row mb-4 border-b border-white/10 pb-2">
              <h2 className="text-2xl font-semibold text-green-200">Property Information</h2>

              {user?.role === 'admin' && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {!property.isVerified ? (
                    <button
                      onClick={async () => {
                        try {
                          await API.patch(`/v1/properties/verify/${id}`);
                          toast.success('Property verified successfully!');
                          setProperty({ ...property, isVerified: true });
                        } catch (err) {
                          toast.error('Verification failed. Please try again.');
                        }
                      }}
                      className="bg-white hover:bg-green-100 text-green-900 py-2 px-4 rounded shadow transition"
                    >
                      ✅ Verify Property
                    </button>
                  ) : (
                    <p className="text-1xl text-green-400">✔️ This property is verified</p>
                  )}

                  {/* 🔴 Delete Button if inactive > 90 days */}
                  {new Date(property.createdAt) <
                    new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) && (
                    <button
                      onClick={async () => {
                        if (
                          window.confirm('Are you sure you want to delete this inactive property?')
                        ) {
                          try {
                            await API.delete(`/v1/properties/${id}`);
                            toast.success('Property deleted successfully.');
                            navigate('/admin-dashboard'); // Change this if needed
                          } catch (err) {
                            toast.error('Failed to delete property.');
                          }
                        }
                      }}
                      className="bg-white hover:bg-green-100 text-green-900 py-2 px-4 rounded shadow transition"
                    >
                      🗑️ Delete Inactive Property
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-green-100">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Building size={20} /> City
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  {property.city}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Globe size={20} /> Region
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  {property.region}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <MapPin size={20} /> Address
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  {property.address}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Home size={20} /> Property Type
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  {property.propertyType}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Wallet size={20} /> Rent
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  Rs {property.rentAmount} / {property.currency}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Ruler size={20} /> Area
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                  {property.areaSqFt} sq ft
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                  <Boxes size={20} /> Availability
                </label>
                <div className="border border-green-600 rounded-md px-4 py-3 font-bold text-base text-green-400">
                  {property.availabilityStatus}
                </div>
              </div>

              {property.numberOfBedrooms && (
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                    <Bed size={20} /> Bedrooms
                  </label>
                  <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                    {property.numberOfBedrooms}
                  </div>
                </div>
              )}

              {property.numberOfBathrooms && (
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-semibold text-green-200 flex items-center gap-2">
                    <Bath size={20} /> Bathrooms
                  </label>
                  <div className="border border-green-600 rounded-md px-4 py-3 text-base">
                    {property.numberOfBathrooms}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Description & Amenities */}
          <section className="mt-10">
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-green-200 mb-4 border-b border-white/10 pb-2">
                Description
              </h2>
              <div className="border border-green-600 rounded-md px-4 py-3 text-green-100 text-base whitespace-pre-wrap leading-relaxed">
                {property.description || 'No description provided.'}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold text-green-200 mb-4 border-b border-white/10 pb-2">
                  Available Amenities
                </h2>
                <div className="border border-green-600 rounded-md px-4 py-3 text-green-100 text-base">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {property.amenities.map((a, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="text-green-400 w-4 h-4" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </section>

          {/* Booking Request */}
          {user?.role !== 'owner' &&
            user?.role !== 'admin' &&
            property.availabilityStatus !== 'rented' && (
              <section>
                <h2 className="text-2xl font-semibold text-green-200 mb-4 border-b border-white/10 pb-2">
                  Booking Request
                </h2>
                {!user ? (
                  <p className="text-yellow-400">
                    🔒 Please{' '}
                    <span className="underline cursor-pointer" onClick={() => navigate('/login')}>
                      log in
                    </span>{' '}
                    as a tenant to request a booking.
                  </p>
                ) : user.role !== 'tenant' ? (
                  <p className="text-blue-400 font-medium">👀 Only tenants can request bookings.</p>
                ) : hasAlreadyBooked ? (
                  <div className="text-green-300 font-semibold space-y-2">
                    <p>✅ You have already requested a booking for this property.</p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg font-semibold transition focus:ring-2 focus:ring-green-400"
                  >
                    Request Booking for This Property
                  </button>
                )}
              </section>
            )}

          {/* Image Gallery */}
          <section className="mt-10">
            <div className="text-2xl font-semibold text-green-200 mb-4 border-b border-white/10 pb-4">
              Property Images
            </div>

            {property.images?.length > 0 ? (
              <div className="grid grid-cols-1">
                {property.images.length === 1 ? (
                  <div
                    className="border border-green-600 rounded-md overflow-hidden cursor-pointer pb-4"
                    onClick={() => {
                      setLightboxIndex(0);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <img
                      src={property.images[0]}
                      alt="Single Property"
                      className="w-full h-[300px] sm:h-[500px] object-cover"
                    />
                  </div>
                ) : (
                  <div className="border border-green-600 rounded-md p-2 sm:p-4 pb-12">
                    <Slider {...sliderSettings}>
                      {property.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="cursor-pointer overflow-hidden rounded-xl"
                          onClick={() => {
                            setLightboxIndex(idx);
                            setIsLightboxOpen(true);
                          }}
                        >
                          <img
                            src={img}
                            alt={`Slide ${idx}`}
                            className="w-full h-80 sm:h-[500px] object-cover"
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-green-600 rounded-md px-4 py-6 text-center text-green-300">
                No Images Available
              </div>
            )}
          </section>
        </div>

        {/* Review Section */}
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 space-y-12">
          <ReviewSection property={property} setProperty={setProperty} />
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <Lightbox
            mainSrc={property.images[lightboxIndex]}
            nextSrc={property.images[(lightboxIndex + 1) % property.images.length]}
            prevSrc={
              property.images[(lightboxIndex + property.images.length - 1) % property.images.length]
            }
            onCloseRequest={() => setIsLightboxOpen(false)}
            onMovePrevRequest={() =>
              setLightboxIndex(
                (lightboxIndex + property.images.length - 1) % property.images.length
              )
            }
            onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % property.images.length)}
          />
        )}

        {/* Booking Modal */}
        {showBookingForm && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-md ring-1 ring-white/20 rounded-2xl p-8 sm:p-10 shadow-2xl w-full max-w-lg space-y-6">
              <h3 className="text-2xl font-bold text-white text-center">Booking Request</h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <input
                  name="desiredMoveInDate"
                  value={formData.desiredMoveInDate}
                  onChange={handleFormChange}
                  type="date"
                  required
                  className="w-full bg-white/20 text-white px-4 py-3 rounded-lg border border-white/30 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <input
                  name="desiredLeaseDuration"
                  value={formData.desiredLeaseDuration}
                  onChange={handleFormChange}
                  type="text"
                  placeholder="Lease Duration (e.g., 1 year)"
                  required
                  className="w-full bg-white/20 text-white px-4 py-3 rounded-lg border border-white/30 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <textarea
                  name="messageFromTenant"
                  value={formData.messageFromTenant}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Message to landlord"
                  className="w-full bg-white/20 text-white px-4 py-3 rounded-lg border border-white/30 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <div className="flex justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition focus:ring-2 focus:ring-green-400"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox remains unchanged */}
      </main>
    </>
  );
};

const ReviewSection = ({ property, setProperty }) => {
  const { user } = useContext(AuthContext);
  const id = property._id;

  const [reviewData, setReviewData] = useState({ review: '', rating: 0 });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState({ review: '', rating: 0 });

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.review || !reviewData.rating) {
      return toast.error('Please fill in both review text and rating');
    }

    setSubmittingReview(true);
    try {
      const res = await API.post(`/v1/properties/${id}/createReview`, {
        propertyId: id,
        review: reviewData.review,
        rating: Number(reviewData.rating),
      });

      toast.success('Review submitted!');
      const newReview = res.data.data.review || {
        review: reviewData.review,
        rating: reviewData.rating,
        tenantName: `${capitalize(user.firstName)} ${capitalize(user.lastName)}`,
      };

      setProperty((prev) => ({
        ...prev,
        reviews: [...(prev.reviews || []), newReview],
      }));

      setReviewData({ review: '', rating: 0 });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Submission failed');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await API.delete(`/v1/properties/${id}/createReview/deleteReview/${reviewId}`);
      toast.success('Review deleted successfully');
      setProperty((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((r) => r._id !== reviewId),
      }));
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditedReview({ review: review.review, rating: review.rating });
  };

  const handleUpdateReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/v1/properties/${id}/createReview/updateReview/${editingReviewId}`, {
        review: editedReview.review,
        rating: Number(editedReview.rating),
      });
      toast.success('Review updated');
      setProperty((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) =>
          r._id === editingReviewId ? { ...r, ...editedReview } : r
        ),
      }));
      setEditingReviewId(null);
    } catch (err) {
      toast.error('Failed to update review');
    }
  };

  return (
    <section className="mt-12">
      <h2 className="text-3xl font-extrabold text-white mb-6 border-b border-white/10 pb-2">
        Tenant Reviews
      </h2>

      {/* Review Form for Tenants */}
      {user?.role === 'tenant' && (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-white/5 backdrop-blur-lg ring-1 ring-white/15 p-6 rounded-xl mb-8 space-y-4"
        >
          <textarea
            name="review"
            value={reviewData.review}
            onChange={handleReviewChange}
            placeholder="Write your review..."
            rows={3}
            required
            className="w-full bg-white/10 text-white border border-white/20 rounded-lg px-4 py-3 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex flex-row  items-center gap-4">
              <label className="text-green-200 font-medium">Rating:</label>
              <select
                name="rating"
                value={reviewData.rating}
                onChange={handleReviewChange}
                required
                className="w-full max-w-sm bg-green-900 text-white border border-white/20 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#2A5942] appearance-none"
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg transition focus:ring-2 focus:ring-green-400"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Existing Reviews */}
      {property.reviews?.length > 0 ? (
        <div className="space-y-6">
          {property.reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-md ring-1 ring-white/10 p-5 rounded-xl shadow-sm"
            >
              {editingReviewId === review._id ? (
                <form onSubmit={handleUpdateReviewSubmit} className="space-y-3">
                  <textarea
                    name="review"
                    value={editedReview.review}
                    onChange={(e) => setEditedReview({ ...editedReview, review: e.target.value })}
                    rows="3"
                    className="w-full bg-white/10 text-white px-4 py-2 rounded"
                  />
                  <select
                    name="rating"
                    value={editedReview.rating}
                    onChange={(e) => setEditedReview({ ...editedReview, rating: e.target.value })}
                    className="w-full bg-green-900 text-white px-4 py-2 rounded"
                  >
                    <option value="">Select rating</option>
                    {[1, 2, 3, 4, 5].map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-green-500 px-4 py-2 text-white rounded">
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(null)}
                      className="bg-gray-500 px-4 py-2 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="text-green-100 italic mb-2">"{review.review}"</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-600'}
                      />
                    ))}
                    <span className="ml-2 text-sm text-green-300">{review.rating} / 5</span>
                  </div>
                  {(review.tenantId || review.tenantName) && (
                    <p className="text-sm text-green-200 mt-1">
                      By:{' '}
                      {review.tenantId
                        ? `${review.tenantId.firstName} ${review.tenantId.lastName}`
                        : review.tenantName}
                    </p>
                  )}

                  {/* Admin-only controls */}
                  {user?.role === 'admin' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-green-300">No reviews posted yet.</p>
      )}
    </section>
  );
};

export default PropertyDetails;
