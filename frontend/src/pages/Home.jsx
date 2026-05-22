import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const slideBanner = [
  { id: 1, img: "https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/74._CB783716748_.jpg", link: "/fashion" },
  { id: 2, img: "https://images-eu.ssl-images-amazon.com/images/G/31/2025/GW/UNREC/PC/78269._CB785061629_.jpg", link: "/women-dress" },
  { id: 3, img: "https://images-eu.ssl-images-amazon.com/images/G/31/img21/Books/May26/Desktop_tall_Hero_3000x1200_Books-for-SSC-UPSC--more_rec._CB762894798_.jpg", link: "/book" },
  { id: 4, img: "https://images-eu.ssl-images-amazon.com/images/G/31/2025/GW/UNREC/PC/78270._CB785061629_.jpg", link: "/shoes" },
];

// Cloned list: [last, ...original, first]
const slides = [slideBanner[slideBanner.length - 1], ...slideBanner, slideBanner[0]];

const Home = () => {
  const [current, setCurrent] = useState(1); // start at index 1 (first real slide)
  const [transitioning, setTransitioning] = useState(true);
  const timeoutRef = useRef(null);

  const goTo = (index) => {
    setTransitioning(true);
    setCurrent(index);
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // Auto-slide every 2s
  useEffect(() => {
    timeoutRef.current = setInterval(next, 4000);
    return () => clearInterval(timeoutRef.current);
  }, [current]);

  // When we land on clone — instantly jump to real slide (no animation)
  const handleTransitionEnd = () => {
    if (current === slides.length - 1) {
      // landed on cloned first → jump to real first
      setTransitioning(false);
      setCurrent(1);
    } else if (current === 0) {
      // landed on cloned last → jump to real last
      setTransitioning(false);
      setCurrent(slides.length - 2);
    }
  };

  // Real dot index (0-based for original array)
  const realIndex = current === 0
    ? slideBanner.length - 1
    : current === slides.length - 1
    ? 0
    : current - 1;

  return (
    <div className="relative w-full overflow-hidden select-none">

      {/* Slides */}
      <div
        className="flex"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transitioning ? "transform 500ms ease-in-out" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {slides.map((item, i) => (
          <Link key={i} to={item.link} className="shrink-0 w-full">
            <img
              src={item.img}
              alt="banner"
              className="w-full object-cover"
              draggable={false}
            />
          </Link>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/4 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1 transition-colors cursor-pointer z-10"
      >
        <IoIosArrowBack size={36} className="text-white" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 top-1/4 -translate-y-1/2 bg-black/30 hover:bg-black/50 rounded-full p-1 transition-colors cursor-pointer z-10"
      >
        <IoIosArrowForward size={36} className="text-white" />
      </button>

      {/* Dots */}
      {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slideBanner.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i + 1)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              i === realIndex ? "bg-white scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div> */}

    </div>
  );
};

export default Home;