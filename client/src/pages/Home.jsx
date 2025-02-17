import { React, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import bgVideo from "../assets/video/Screen Recording 2025-02-06 212028.mp4";

const testimonials = [
  {
    name: 'John Doe',
    feedback: 'The Gaming Beast is an absolute powerhouse! I couldn\'t be happier with my purchase.',
  },
  {
    name: 'Jane Smith',
    feedback: 'Expertly assembled and runs like a dream! Highly recommend.',
  },
  {
    name: 'Mike Johnson',
    feedback: 'Fantastic performance and top-notch components. Worth every penny!',
  },
];

const reviews = [
  {
    name: 'John Doe',
    rating: 5,
    feedback: 'The Gaming Beast is an absolute powerhouse! I couldn\'t be happier with my purchase.',
  },
  {
    name: 'Jane Smith',
    rating: 4,
    feedback: 'Expertly assembled and runs like a dream! Highly recommend.',
  },
  {
    name: 'Mike Johnson',
    rating: 3,
    feedback: 'Fantastic performance, but had some minor issues with setup.',
  },
  {
    name: 'Emily Davis',
    rating: 5,
    feedback: 'Great customer service and the product exceeded my expectations!',
  },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [dynamicText, setDynamicText] = useState("Welcome to 7HubComputer");
  const [backgroundImage, setBackgroundImage] = useState("https://t3.ftcdn.net/jpg/09/18/42/58/360_F_918425842_Ww2uHj43kH4KP1Agmo6H1nkUciN2kOGo.jpg");

  useEffect(() => {
    const texts = [
      "Personal Computers (Desktops & Laptops)",
      "High-Performance Workstations",
      "Powerful Gaming PCs",
      "Reliable Servers for Your Needs",
      "Compact Mini PCs for Space-Saving",
      "Sleek All-in-One Computers",
      "Efficient Chromebooks for Everyday Use"
    ];

    const images = [
      "https://60a99bedadae98078522-a9b6cded92292ef3bace063619038eb1.ssl.cf2.rackcdn.net/images_CategoryPages_CategoryPromos_Cases_CASES_BuildN.png",
      "https://siriuspowerpc.com/wp-content/uploads/2023/06/CPU-Category-430x430.png",
      "https://www.yankodesign.com/images/design_news/2021/09/this-sci-fi-transparent-pc-case-is-a-symphony-of-performance-and-looks/Crystal-PC-Case-Concept-by-Alex-Casabo_Desktop-10.jpg",
      "https://example.com/image4.jpg",
      "https://example.com/image5.jpg",
      "https://example.com/image6.jpg",
      "https://example.com/image7.jpg",
    ];

    let index = 0;

    const intervalId = setInterval(() => {
      setDynamicText(texts[index]);
      setBackgroundImage(images[index]);
      index = (index + 1) % texts.length;
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchProducts = async (page = 1, limit = 10) => {
      try {
        const response = await fetch(`http://localhost:4000/api/admin/products?page=${page}&limit=${limit}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const allProducts = [
          ...data.prebuildPC,
          ...data.refurbishedProducts,
          ...data.miniPCs,
        ];
        setProducts(allProducts);
      } catch (error) {
        console.error(error);
        setError("Unable to load products. Please try again.");
      }
    };

    fetchProducts(1, 10);
  }, []);

  const renderStars = (rating) => {
    const filledStars = Array(rating).fill('★');
    const emptyStars = Array(5 - rating).fill('☆');
    const stars = [...filledStars, ...emptyStars];

    return (
      <span className="text-yellow-500">
        {stars.map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </span>
    );
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center text-white flex items-center justify-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <motion.div
          className="relative text-center px-6 md:px-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"
            key={dynamicText}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {dynamicText}
          </motion.h1>

          <motion.p
            className="mt-4 text-lg md:text-2xl text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Your one-stop destination for custom PCs, pre-built systems, laptops, and more.
          </motion.p>

          <motion.a
            href="#featured"
            className="mt-8 inline-block bg-gradient-to-r from-blue-500 to-teal-500 hover:from-teal-500 hover:to-blue-600 text-white py-3 px-6 rounded-full text-lg transition-all transform hover:-translate-y-1 shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            Explore Now
          </motion.a>
        </motion.div>
      </section>

      {/* Box Below Hero Section */}
      <section className="relative mt-10 px-4 md:px-20 h-[500px] md:h-[600px] flex items-center justify-center">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src={bgVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for better visibility */}
        <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-lg"></div>

        {/* Content Box */}
        <div className="relative w-full max-w-2xl flex flex-col items-center py-10 px-6 md:py-16 md:px-12 bg-white bg-opacity-90 shadow-lg rounded-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
            Why 7HubComputer?
          </h2>

          <p className="mt-4 text-lg text-gray-700 text-center">
            Discover the best-in-class PC solutions with a 7-step quality check.
          </p>

          {/* Know More Button */}
          <Link
            to="/7hubcomputer-details"
            className="mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-all"
          >
            Know More
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 shadow-md inline-block py-2 px-6 bg-white rounded-lg">
            Pre-Built Desktop PCs
          </h2>
          <p className="text-gray-700 text-lg mb-8">Explore our top selections to get started with the ultimate performance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 container mx-auto px-6">
          {products
            .filter(product => product.type === "Pre-Built PC")
            .slice(0, 3)
            .map((product, index) => {
              const ramPrice = product?.specs?.ramOptions?.[0]?.price || 0;
              const storage1Price = product?.specs?.storage1Options?.[0]?.price || 0;
              const storage2Price = product?.specs?.storage2Options?.[0]?.price || 0;

              const totalPrice = product.finalPrice + ramPrice + storage1Price + storage2Price;
              return (
                <div
                  key={index}
                  className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 duration-300"
                >
                  {/* 🏷️ Product Category Label */}
                  <div className="absolute top-2 left-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2 shadow-md z-10 tracking-wide rounded-md w-auto">
                    {product.category}
                  </div>

                  <img
                    src={`http://localhost:4000/uploads/${product.image[0].split('\\').pop()}`}
                    alt={product.name}
                    className="w-full h-56 object-cover transform transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                    <p className="text-indigo-600 text-2xl font-semibold mt-2">₹{totalPrice}</p>
                    <Link
                      to={`/prebuilt`}
                      className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-5 rounded-full transition-transform transform hover:-translate-y-1 shadow-md duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              )
            })}
        </div>
      </section>

      {/* Refurbished Laptops Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 shadow-md inline-block py-2 px-6 bg-white rounded-lg">
            Refurbished Laptops
          </h2>
          <p className="text-gray-700 text-lg mb-8">Quality refurbished laptops at unbeatable prices.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 container mx-auto px-6">
          {products
            .filter(laptop => laptop.type === "Refurbished Laptop")
            .slice(0, 3)
            .map((laptop, index) => (
              <div
                key={index}
                className="relative bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-2xl transform hover:scale-105 transition duration-300"
              >
                {/* 🏷️ Product Category Label */}
                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2 shadow-md z-10 tracking-wide rounded-md w-auto">
                  {laptop.category}
                </div>

                <img
                  src={`http://localhost:4000/uploads/${laptop.image[0].split('\\').pop()}`}
                  alt={laptop.name}
                  className="w-full h-56 object-cover transform transition-transform duration-300 hover:scale-90"
                  loading="lazy"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">{laptop.name}</h3>
                  <p className="text-indigo-600 text-2xl font-semibold mt-2">₹{laptop.finalPrice}</p>
                  <Link
                    to={`/laptops`}
                    className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-5 rounded-full transition-transform transform hover:-translate-y-1 shadow-md duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Mini PCs Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 shadow-md inline-block py-2 px-4 bg-white rounded-md">
            Mini PCs
          </h2>
          <p className="text-gray-700 text-lg mb-8">
            Compact yet powerful computing solutions for every need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 container mx-auto px-6">
          {products
            .filter(minipc => minipc.type === "Mini PC")
            .slice(0, 3)
            .map((minipc, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 relative"
              >
                {/* 🏷️ Product Category Label */}
                <div className="absolute top-2 left-2 bg-indigo-500 text-white text-sm font-semibold px-4 py-2 shadow-md z-10 tracking-wide rounded-md w-auto">
                  {minipc.category}
                </div>

                <img
                  src={`http://localhost:4000/uploads/${minipc.image[0].split('\\').pop()}`}
                  alt={minipc.name}
                  className="w-full h-56 object-cover transform transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800">{minipc.name}</h3>
                  <p className="text-indigo-600 text-2xl font-semibold mt-2">₹{minipc.finalPrice}</p>
                  <Link
                    to={`/mini-pcs`}
                    className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-blue-600 hover:to-indigo-600 text-white py-2 px-5 rounded-full transition-transform transform hover:-translate-y-1 shadow-md duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Quality Components Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us?</h2>
          <p className="text-gray-600 mb-6">Experience the best in performance and quality with our custom PC builds.</p>
        </div>
        <div className="flex flex-wrap justify-center mb-8">
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">High Performance</h3>
            <p className="text-gray-600">Our PCs are designed to handle the most demanding tasks with ease.</p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">Quality Components</h3>
            <p className="text-gray-600">We use only the best components to ensure reliability and longevity.</p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <h3 className="text-xl font-semibold mb-2">Expert Assembly</h3>
            <p className="text-gray-600">All builds are expertly assembled by professionals to ensure peak performance.</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-xl font-semibold mb-2">Customer Testimonials</h3>
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="mb-4 p-2 border-l-4 border-blue-600">
                <p className="text-gray-600 italic">"{testimonial.feedback}"</p>
                <p className="text-gray-800 font-bold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/2 p-4">
            <h3 className="text-xl font-semibold mb-2">Watch Our Builds</h3>
            <iframe
              width="100%"
              height="215"
              src="https://www.youtube.com/embed/your-video-id" // Replace with your video link
              title="Watch Our Builds"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 bg-gray-200">
        <div className="container mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Customer Reviews</h2>
          <p className="text-gray-600 mb-6">What our customers are saying about us.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 container mx-auto px-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden p-4">
              <h3 className="text-lg font-semibold">{review.name}</h3>
              <div className="flex items-center mb-2">
                {renderStars(review.rating)}
              </div>
              <p className="text-gray-600 italic">"{review.feedback}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
