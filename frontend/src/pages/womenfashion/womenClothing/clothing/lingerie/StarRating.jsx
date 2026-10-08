// src/components/StarRating.jsx
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating = 0, setRating = null, size = "text-sm" }) {
  const handleClick = (starValue) => {
    if (setRating) setRating(starValue);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <FaStar
            key={`full-${i}`}
            className={`cursor-pointer text-yellow-500 ${size}`}
            onClick={() => handleClick(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <FaStarHalfAlt
            key={`half-${i}`}
            className={`cursor-pointer text-yellow-500 ${size}`}
            onClick={() => handleClick(i - 0.5)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={`empty-${i}`}
            className={`cursor-pointer text-yellow-500 ${size}`}
            onClick={() => handleClick(i)}
          />
        );
      }
    }

    return stars;
  };

  return <div className="flex space-x-1">{renderStars()}</div>;
}
