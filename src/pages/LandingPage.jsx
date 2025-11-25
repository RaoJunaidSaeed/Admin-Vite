import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/Card';
import {
  Search,
  Shield,
  Clock,
  Users,
  MessageSquare,
  CreditCard,
  Key,
  Home,
  Star,
  CheckCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import API from '../api/axios'; // your axios instance
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import FramerMotion from '../components/framerMotion';

const features = [
  {
    icon: Shield,
    title: 'Verified Users & Secure OTP',
    desc: 'Signup includes OTP verification to ensure trust for both tenants and owners.',
    image: '/images/secure.svg',
  },
  {
    icon: CreditCard,
    title: 'Owner Plan Selection',
    desc: 'Owners select from Basic, Standard, or Premium plans and pay via Stripe.',
    image: '/images/payment.svg',
  },
  {
    icon: Clock,
    title: 'Fast Property Listings',
    desc: 'List properties instantly after payment — visible to all tenants.',
    image: '/images/listing.svg',
  },
  {
    icon: Search,
    title: 'Smart Search for Tenants',
    desc: 'Find properties using filters like city, region, rent, or type (shop, house, office).',
    image: '/images/search.svg',
  },
];

const steps = [
  {
    icon: Users,
    title: 'Signup & Verify OTP',
    desc: 'Register and confirm your identity via email OTP.',
  },
  {
    icon: Shield,
    title: 'Choose Your Role',
    desc: 'Select whether you are a Tenant or Property Owner.',
  },
  {
    icon: CreditCard,
    title: 'Select Plan & Pay',
    desc: 'Owners pick a plan and complete payment via Stripe.',
  },
  {
    icon: Key,
    title: 'List or Search Properties',
    desc: 'Owners can list, tenants can search by filters.',
  },
  {
    icon: MessageSquare,
    title: 'Send Booking Request',
    desc: 'Tenants send booking requests to property owners.',
  },
  {
    icon: Shield,
    title: 'Owner Approval & Contact Exchange',
    desc: 'Once approved, both parties gain contact access.',
  },
  {
    icon: Star,
    title: 'Leave a Review',
    desc: 'After successful rental, tenants can leave feedback.',
  },
];

const LandingPage = () => {
  const role = localStorage.getItem('role');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await API.get('/v1/reviews');
        setReviews(res.data.data.data);
        console.log(res);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background via-light-sage to-white text-charcoal">
        {/* Hero Section */}
        <FramerMotion>
          <section
            className="relative h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-center px-4"
            style={{ backgroundImage: `url('/images/hero1.jpg')` }}
          >
            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-green-900/50 to-black/70 backdrop-blur-md" />

            {/* Hero Content */}
            <div className="relative z-10 max-w-4xl mx-auto animate-fade-in space-y-6">
              <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight">
                Find & Rent Your{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                  Perfect Property
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
                From secure signup to booking — RentoFix simplifies your rental journey with modern
                tech and trusted verification.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/signup">
                  <button className="bg-white/90 text-green-900 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-white transition">
                    Get Started
                  </button>
                </Link>
                <Link to="/admin-dashboard">
                  <button className="border-2 border-white text-white py-3 px-8 rounded-lg hover:bg-white/10 transition">
                    Browse Properties
                  </button>
                </Link>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-float" />
            <div
              className="absolute bottom-32 right-16 w-16 h-16 bg-yellow-300/20 rounded-full backdrop-blur-sm animate-float"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute top-1/3 right-20 w-12 h-12 bg-green-500/20 rounded-full backdrop-blur-sm animate-float"
              style={{ animationDelay: '2s' }}
            />
          </section>
        </FramerMotion>

        {/* Features Section */}
        <FramerMotion>
          <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-4">
                Why Choose RentoFix
              </h2>
              <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                Experience the future of property rental with our cutting-edge features designed for
                modern living.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {features.map(({ icon: Icon, title, desc, image }, index) => (
                <Card
                  key={title}
                  variant="elevated"
                  className="group hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
                >
                  <CardContent className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <img src={image} alt={title} className="w-20 h-20 object-contain" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <CardTitle className="mb-4 group-hover:text-primary transition-colors duration-200">
                        {title}
                      </CardTitle>
                      <CardDescription className="text-lg leading-relaxed">{desc}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FramerMotion>

        {/* How It Works Section */}
        <FramerMotion>
          <section className="py-24 px-6 bg-gradient-to-r from-light-sage to-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-gradient mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                  Simple steps to find your perfect rental or list your space.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map(({ icon: Icon, title, desc }, idx) => (
                  <Card
                    key={title}
                    variant="glass"
                    className="group hover-lift relative overflow-hidden"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-8 h-8 bg-butter rounded-full flex items-center justify-center font-heading font-bold text-charcoal">
                          {idx + 1}
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200">
                        {title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">{desc}</CardDescription>
                    </CardContent>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </FramerMotion>

        {/* Tenant Reviews Section */}
        <FramerMotion>
          <section className="py-24 px-6 bg-white text-charcoal">
            <div className="max-w-7xl  mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                  What Tenants Are Saying
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Real stories from tenants who found their perfect rental through RentoFix.
                </p>
              </div>

              <div className="reviews-section max-w-4xl mx-auto">
                {reviews.length > 0 ? (
                  <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    loop={true} // infinite loop
                    autoplay={{
                      delay: 6000,
                      disableOnInteraction: false, // keeps looping even if user interacts
                      pauseOnMouseEnter: true, // optional: prevent pause when hovering
                    }}
                  >
                    {reviews.map((r, i) => (
                      <SwiperSlide key={i}>
                        <div className="bg-[rgba(75,110,86,1)] text-white border border-green-100 rounded-2xl p-8 shadow-md flex flex-col gap-6">
                          {/* Top: Image & Name */}
                          <div className="flex items-center gap-4">
                            <img
                              src={r.tenantId?.photo || '/default-user.png'}
                              alt="User"
                              className="w-16 h-16 rounded-full object-cover border border-green-200"
                            />
                            <div className="flex flex-col">
                              <h4 className="text-lg font-semibold">
                                {r.tenantId
                                  ? `${r.tenantId.firstName} ${r.tenantId.lastName}`
                                  : 'Anonymous'}
                              </h4>
                              <span className="text-sm opacity-80">
                                {r.createdAt?.slice(0, 10)}
                              </span>
                            </div>
                          </div>

                          {/* Review Text */}
                          <p className="text-base text-[rgba(219,224,234,0.85)] italic">
                            "{r.review}"
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mt-auto">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                className={`w-5 h-5 ${
                                  index < r.rating ? 'text-green-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-300 font-medium">({r.rating})</span>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <p className="text-center text-gray-500">No reviews yet.</p>
                )}
              </div>
            </div>
          </section>
        </FramerMotion>

        {/* Final CTA */}
        <FramerMotion>
          <section className="py-24 px-4 text-center relative overflow-hidden text-white ">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-green-900 backdrop-blur-sm" />

            <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full animate-float" />
            <div
              className="absolute bottom-16 right-16 w-24 h-24 bg-butter/10 rounded-full animate-float"
              style={{ animationDelay: '1.5s' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-[#2A5942]">
                Start Your Rental Journey Today
              </h2>
              <p className="text-xl sm:text-2xl max-w-3xl mx-auto text-white/90 leading-relaxed">
                Join thousands of users already enjoying the modern, secure, and efficient RentoFix
                experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link to="/signup">
                  <button
                    variant="outline"
                    size="lg"
                    className="rounded-md flex bg-white/90 backdrop-blur-sm text-[#2A5942]
 border-2 border-white hover:bg-white hover:shadow-hover px-12 py-4 text-xl font-semibold group"
                  >
                    Start Now
                    <Home className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    variant="outline"
                    size="lg"
                    className="rounded-md text-[rgb(186 226 206)] 
 border-2 border-white/80 hover:bg-white/10 backdrop-blur-sm px-12 py-4 text-xl font-semibold"
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            </div>
          </section>{' '}
        </FramerMotion>
      </div>
    </>
  );
};

export default LandingPage;
