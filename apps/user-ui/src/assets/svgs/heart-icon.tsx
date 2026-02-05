import React from "react";

type WishlistHeartIconProps = {
  size?: number;
  color?: string;
  className?: string;
};

const WishlistHeartIcon: React.FC<WishlistHeartIconProps> = ({
  size = 24,
  color = "currentColor",
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-6.5-4.4-9-7.8C1 10 2.5 6.5 6 6c2-.3 3.7.8 6 3 2.3-2.2 4-3.3 6-3 3.5.5 5 4 3 7.2-2.5 3.4-9 7.8-9 7.8z" />
    </svg>
  );
};

export default WishlistHeartIcon;
