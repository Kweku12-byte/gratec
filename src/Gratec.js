import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, PlayCircle, Star, BookOpen, Film, 
  Twitter, Instagram, Linkedin, Users, Award, Smile, Lock 
} from 'lucide-react';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from './firebase'; 
import AuthModal from './AuthModal'; 
import CoursePage from './CoursePage'; 

// DUMMY DATA
const testimonials = [
  { name: "Sarah L.", role: "Freelance Developer", quote: "This course is a game-changer. I went from zero to building professional client websites in weeks. The 8-hour video is pure gold!", stars: 5, type: 'text' },
  { name: "Michael B.", role: "Entrepreneur", quote: "I wanted to build my own e-commerce site without hiring a dev. GRATEC gave me the confidence and skills. Highly recommended.", stars: 5, type: 'text' },
  { name: "Alex Johnson", role: "Aspiring Developer", videoUrl: "https://videos.pexels.com/video-files/857251/857251-hd_1280_720_25fps.mp4", thumbnail: `https://images.pexels.com/photos/196655/pexels-photo-196655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`, type: 'video' },
  { name: "Emily R.", role: "Marketing Manager", quote: "The clarity and depth of the content are unparalleled. I can now manage my company's WordPress site with ease.", stars: 5, type: 'text' },
  { name: "David Chen", role: "Student", videoUrl: "https://videos.pexels.com/video-files/854251/854251-hd_1280_720_30fps.mp4", thumbnail: `https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`, type: 'video' },
];

// HELPER COMPONENTS
const StarRating = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
      />
    ))}
  </div>
);

const VideoPlayerModal = ({ videoUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-black rounded-lg overflow-hidden shadow-2xl w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <video className="w-full h-auto" src={videoUrl} controls autoPlay>
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

// MAIN UI COMPONENTS
const Header = ({ user, onLoginClick, onLogoutClick, onNavigate, currentPage, hasCourseAccess }) => (
  <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md">
    <div className="container mx-auto px-6 py-4 flex justify-between items-center">
      <button onClick={() => onNavigate('home')} className="text-3xl font-bold text-gray-900 tracking-tighter">
        GRATEC Course
      </button>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {hasCourseAccess && currentPage !== 'course' && (
              <button onClick={() => onNavigate('course')} className="font-bold py-2 px-6 rounded-full text-gray-900 bg-yellow-400 hover:bg-yellow-500 transition-all">
                My Course
              </button>
            )}
            <button onClick={onLogoutClick} className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-full hover:bg-gray-300 transition-all">
              Logout
            </button>
          </>
        ) : (
          <button onClick={onLoginClick} className="bg-gray-900 text-white font-bold py-2 px-6 rounded-full hover:bg-black">
            Login
          </button>
        )}
        {currentPage === 'home' && (
          <a href="#purchase" className="bg-yellow-400 text-gray-900 font-bold py-2 px-6 rounded-full hover:bg-yellow-500 transform hover:scale-105">
            Get The Course
          </a>
        )}
      </div>
    </div>
  </header>
);

const HeroSection = () => (
  <section
    className="min-h-screen bg-white flex items-center justify-center pt-20 relative bg-cover bg-center"
    style={{ backgroundImage: "url('https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" }}
  >
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative text-center px-6">
      <div className="relative inline-block">
        <div className="absolute -inset-2 bg-yellow-400 rounded-lg blur-xl opacity-50"></div>
        <h2 className="relative text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tighter leading-tight">
          Become a WordPress Pro.
        </h2>
      </div>
      <p className="max-w-3xl mx-auto mt-6 text-lg md:text-xl text-gray-200">
        Go from beginner to expert with over 14 hours of masterclass content. Build stunning, professional websites for clients or your own business. Your journey starts here.
      </p>
      <div className="mt-10">
        <a href="#purchase" className="bg-yellow-400 text-gray-900 font-bold py-4 px-10 rounded-full text-lg hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 inline-block">
          Start Learning Now
        </a>
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="bg-white py-12">
    <div className="container mx-auto px-6">
      <div className="bg-gray-100 rounded-3xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="text-4xl font-bold text-gray-900">1,200+</p>
            <p className="text-gray-600">Students Trained</p>
          </div>
          <div className="flex flex-col items-center">
            <Award className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="text-4xl font-bold text-gray-900">5+</p>
            <p className="text-gray-600">Years of Experience (Since 2019)</p>
          </div>
          <div className="flex flex-col items-center">
            <Smile className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="text-4xl font-bold text-gray-900">98%</p>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// NEW INTRO VIDEO SECTION
const IntroVideoSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Video Player */}
        <div className="lg:w-1/2 w-full">
          <div className="relative aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://youtu.be/u-6RyW_IG8A" // IMPORTANT: Replace with your YouTube video ID
              title="GRATEC Course Introduction"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        {/* Text Content */}
        <div className="lg:w-1/2 w-full">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tighter leading-tight">
            Your Path to a New Career Starts Here.
          </h3>
          <p className="mt-4 text-lg text-gray-600">
            This isn't just another course; it's a life-changing skill. We've seen students go from complete beginners to confident, employed web developers. This course is designed to give you the practical, real-world skills you need to build professional websites and start a new career.
          </p>
          <p className="mt-4 text-gray-600">
            For a single, one-time fee of $99, you get two complete courses. The first 8 hours teach you everything, including how to practice locally on your computer at no cost. The second 2-hour course is a powerful summary to reinforce your knowledge before you start reaching out to clients.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CourseBanner = () => (
  <section className="py-20 bg-gray-50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter leading-tight">
          Two Courses. One Goal. <span className="text-yellow-400">Mastery.</span>
        </h3>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We've structured the learning path for maximum impact. Start with the fundamentals and progress to advanced techniques seamlessly.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
          <div className="relative aspect-video">
            <img src="gratecbanner2.png" alt="WordPress Foundation Course Banner" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1280x720/333/FFF?text=Foundation+Course'; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-sm font-bold py-1 px-3 rounded-full">8 HOURS</div>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-yellow-500" />
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">The Foundation</h4>
            </div>
            <p className="mt-3 text-gray-600">
              Master the WordPress dashboard, themes, plugins, and build your first complete website from scratch.
            </p>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
          <div className="relative aspect-video">
            <img src="gratecbanner3.png" alt="WordPress Pro Toolkit Course Banner" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/1280x720/111/FFF?text=Pro+Toolkit+Course'; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 text-sm font-bold py-1 px-3 rounded-full">2 HOURS</div>
          </div>
          <div className="p-8">
            <div className="flex items-center gap-3">
              <Film className="w-8 h-8 text-yellow-500" />
              <h4 className="text-2xl font-bold text-gray-900 tracking-tight">The Pro Summary</h4>
            </div>
            <p className="mt-3 text-gray-600">
              A powerful summary course to reinforce your knowledge before reaching out to clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ReviewsSection = () => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const scrollContainerRef = useRef(null);
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.offsetWidth * 0.8;
      current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="reviews" className="bg-white py-20 overflow-hidden">
      <div className="container mx-auto">
        <div className="px-6 text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tighter">Loved by thousands.</h3>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. See what our students have built and hear their stories.
          </p>
        </div>
        <div className="relative mt-12">
          <div ref={scrollContainerRef} className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 reviews-scrollbar">
            <div className="flex pl-6 md:pl-24">
              {testimonials.map((item, index) => (
                <div key={index} className="snap-start shrink-0 w-[85vw] md:w-[450px] mr-6">
                  {item.type === 'text' ? (
                    <div className="bg-gray-100 rounded-3xl p-8 h-full flex flex-col justify-between border border-transparent hover:border-yellow-400 transition-all duration-300">
                      <div>
                        <StarRating rating={item.stars} />
                        <p className="text-gray-800 mt-4 text-lg font-medium">"{item.quote}"</p>
                      </div>
                      <div className="mt-6">
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.role}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative bg-black rounded-3xl h-full flex flex-col justify-end text-white overflow-hidden cursor-pointer group shadow-lg" onClick={() => setCurrentVideo(item.videoUrl)}>
                      <img src={item.thumbnail} alt={`Video review by ${item.name}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/000/FFF?text=Video+Review'; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <PlayCircle className="w-20 h-20 text-white/80 transform transition-transform duration-300 group-hover:scale-110 drop-shadow-lg" />
                      </div>
                      <div className="relative z-10 p-8">
                        <p className="font-bold text-lg">{item.name}</p>
                        <p className="text-sm opacity-80">{item.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 md:px-8 pointer-events-none">
            <button onClick={() => scroll(-1)} className="pointer-events-auto bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white" aria-label="Scroll left"><ChevronLeft className="h-6 w-6 text-gray-900"/></button>
            <button onClick={() => scroll(1)} className="pointer-events-auto bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white" aria-label="Scroll right"><ChevronRight className="h-6 w-6 text-gray-900"/></button>
          </div>
        </div>
      </div>
      {currentVideo && <VideoPlayerModal videoUrl={currentVideo} onClose={() => setCurrentVideo(null)} />}
    </section>
  );
};

const PurchaseSection = () => (
  <section id="purchase" className="py-20 bg-yellow-400">
    <div className="container mx-auto px-6 text-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-16 max-w-4xl mx-auto">
        <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tighter">
          Ready to Build Your Future?
        </h3>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Get lifetime access to both courses, all future updates, and our exclusive student community. One payment, endless possibilities.
        </p>
        <div className="my-8">
          <span className="text-6xl font-bold text-gray-900 tracking-tight">$99</span>
          <span className="text-gray-500 ml-2">One-time payment</span>
        </div>
        <a 
          href="https://paystack.shop/pay/9v0iznffk6"
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-gray-900 text-white font-bold py-4 px-12 rounded-full text-lg hover:bg-black transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
        >
          Enroll Now & Get Instant Access
        </a>
        <p className="text-sm text-gray-500 mt-4">30-Day Money-Back Guarantee</p>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-900 text-white">
    <div className="container mx-auto px-6 pt-16 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="md:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold tracking-tighter text-white">GRATEC</h2>
          <p className="mt-4 text-gray-400">Become the developer you were meant to be.</p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="text-gray-400 hover:text-yellow-400"><Twitter/></a>
            <a href="#" className="text-gray-400 hover:text-yellow-400"><Instagram/></a>
            <a href="#" className="text-gray-400 hover:text-yellow-400"><Linkedin/></a>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-white tracking-wide">Explore</h3>
          <ul className="mt-4 space-y-3">
            <li><a href="#purchase" className="text-gray-400 hover:text-yellow-400">Courses</a></li>
            <li><a href="#reviews" className="text-gray-400 hover:text-yellow-400">Reviews</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-400">Careers</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-white tracking-wide">Community</h3>
          <ul className="mt-4 space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-yellow-400">Success Stories</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-400">Our Graduates</a></li>
            <li><a href="#" className="text-gray-400 hover:text-yellow-400">Affiliate Program</a></li>
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl">
          <h3 className="font-semibold text-white tracking-wide">Earnings Showcase</h3>
          <p className="mt-3 text-gray-400 text-sm">
            See what our graduates are earning as freelance WordPress developers.
          </p>
          <div className="mt-4">
            <span className="text-3xl font-bold text-yellow-400">$75k+/year</span>
            <p className="text-xs text-gray-500">Average first year</p>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} GRATEC. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const NoAccessPage = ({onNavigate}) => (
  <div className="bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="text-center p-8 bg-white shadow-xl rounded-3xl max-w-lg mx-auto">
      <Lock className="w-16 h-16 text-yellow-500 mx-auto mb-4"/>
      <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>
      <p className="mt-4 text-lg text-gray-600">
        You are logged in, but you don't have access to this course yet. Please enroll to unlock the content.
      </p>
      <div className="mt-8">
        <button onClick={() => onNavigate('home')} className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition-all">
          Back to Homepage
        </button>
      </div>
    </div>
  </div>
);

const LandingPage = () => (
  <>
    <HeroSection />
    <StatsSection />
    <IntroVideoSection />
    <CourseBanner />
    <ReviewsSection />
    <PurchaseSection />
  </>
);

// Main App Component
export default function Gratec() {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home'); 
  const [hasCourseAccess, setHasCourseAccess] = useState(false);
  const [isLoadingAccess, setIsLoadingAccess] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsLoadingAccess(true);
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().has_access === true) {
          setHasCourseAccess(true);
        } else {
          setHasCourseAccess(false);
        }
        setIsLoadingAccess(false);
      } else {
        setHasCourseAccess(false);
        setCurrentPage('home');
        setIsLoadingAccess(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error('Logout Error:', error));
  };
  
  const renderContent = () => {
    if (isLoadingAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }
    
    if (currentPage === 'course') {
      if (user && hasCourseAccess) {
        return <CoursePage user={user} />;
      } else {
        return <NoAccessPage onNavigate={setCurrentPage} />;
      }
    }
    
    return <LandingPage />;
  };

  return (
    <div className="bg-white font-sans">
      <Header 
        user={user} 
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        hasCourseAccess={hasCourseAccess}
      />
      <main>
        {renderContent()}
      </main>
      <Footer />
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
