import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import {
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

export default function Gallery() {
  // Sample gallery images
  const images = [
    {
      src: "/gallery/event1.jpg",
      alt: "Community clean-up drive",
      caption: "Members participating in a community clean-up drive",
    },
    {
      src: "/gallery/event2.jpg",
      alt: "Financial literacy workshop",
      caption: "Financial literacy workshop for members",
    },
    {
      src: "/gallery/event3.jpg",
      alt: "Tree planting initiative",
      caption: "Tree planting initiative for a greener Colombo",
    },
    {
      src: "/gallery/event4.jpg",
      alt: "Personal development seminar",
      caption: "Personal development seminar for youth members",
    },
    {
      src: "/gallery/event5.jpg",
      alt: "Health awareness camp",
      caption: "Health awareness camp in partnership with local clinics",
    },
    {
      src: "/gallery/event6.jpg",
      alt: "Cultural event",
      caption: "Members showcasing local arts & culture",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <Fragment>
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] bg-indigo-700 flex items-center justify-center overflow-hidden">
        <img
          src="/gallery/event3.jpg"
          alt="Gallery Banner"
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay"
        />
        <h1 className="relative text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center">
          Our Gallery
        </h1>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">
          Moments from Our Initiatives
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              className="relative cursor-pointer overflow-hidden rounded-xl shadow-lg"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-3 text-sm">
                {img.caption}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- CONNECT WITH US ---------- */}
      <section className="w-full py-14 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">

          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            CONNECT WITH US
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-8 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Stay connected with the Tholangamuwa Central College Colombo Group
            through our social media and community channels.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">

            {/* YouTube */}
            <motion.a
              href="https://www.youtube.com/@TCC--ColomboGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-red-600 text-white rounded-xl shadow-md
                         hover:bg-red-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaYoutube className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  FOLLOW OUR
                </p>
                <p className="font-bold text-lg">
                  YouTube Channel
                </p>
              </div>
            </motion.a>


            {/* Facebook */}
            <motion.a
              href="https://www.facebook.com/groups/1477262159163235"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-blue-600 text-white rounded-xl shadow-md
                         hover:bg-blue-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFacebook className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  FOLLOW OUR
                </p>
                <p className="font-bold text-lg">
                  Facebook Page
                </p>
              </div>
            </motion.a>


            {/* WhatsApp */}
            <motion.a
              // href="https://wa.me/YOUR_WHATSAPP_NUMBER"
              href="https://chat.whatsapp.com/GcBIDhnANgaBWfB5f8VjBR"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-green-600 text-white rounded-xl shadow-md
                         hover:bg-green-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaWhatsapp className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  JOIN OUR
                </p>
                <p className="font-bold text-lg">
                  WhatsApp Group
                </p>
              </div>
            </motion.a>

          </div>
        </div>
      </section>      

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full">
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <p className="text-white text-center mt-4">{selectedImage.caption}</p>
          </div>
        </div> 
      )}
      <footer className="w-full bg-gray-900 text-white py-8 px-4 text-center text-sm">
        <p>© 2025 Tholangamuwa Central College Past Students Colombo Group</p>
        <p className="opacity-75">Powered by nSoft Technologies</p>
      </footer>
    </Fragment>   
  );
}
