import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";
import { CardProductProps } from "../interfaces/CardProductProps";

const CardProduct: React.FC<CardProductProps> = ({
  title,
  price,
  image,
  rating,
  onAddToCart,
  discount,
}) => {
  const fixedRating = parseFloat(Number(rating).toFixed(1)); // Ensure rating is between 0 and 5

  const renderRatingStars = () => {
    const fullStars = Math.floor(fixedRating);
    const hasHalfStar = fixedRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <>
        {/* Full stars */}
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <StarIcon
              key={`full-${i}`}
              className="w-4 h-4 text-yellow-400 fill-current"
            />
          ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative w-4 h-4">
            <StarIcon className="absolute text-gray-300 fill-current" />
            <StarIcon
              className="absolute text-yellow-400 fill-current"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}

        {/* Empty stars */}
        {Array(emptyStars)
          .fill(0)
          .map((_, i) => (
            <StarIcon key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
          ))}
      </>
    );
  };

  return (
    <div className="w-full max-w-[300px] h-[420px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative w-full h-[300px] overflow-hidden">
        <img
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
          src={image}
          alt={title}
          loading="lazy"
        />
        {discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col justify-between h-[120px]">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h2>
          <div className="flex items-center mt-1">
            {renderRatingStars()}
            <span className="text-xs text-gray-500 ml-1">({fixedRating})</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div>
            {discount ? (
              <>
                <span className="text-red-500 font-bold">
                  ${(price * (1 - discount / 100)).toFixed(2)}
                </span>
                <span className="text-gray-400 line-through text-sm ml-2">
                  ${price}
                </span>
              </>
            ) : (
              <span className="text-gray-900 font-bold">${price}</span>
            )}
          </div>

          <button
            onClick={onAddToCart}
            className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors hover:cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
