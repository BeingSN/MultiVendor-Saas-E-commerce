import WishlistHeartIcon from "@/assets/svgs/heart-icon";
import ProfileIcon from "@/assets/svgs/profile-icon";
import { HeartIcon, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="w-full bg-white">
      <div className="w-[80%] py-5 m-auto flex items-center justify-between">
        <div>
          <Link href={"/"}>
            <span className="text-2xl font-[600] ">Eshop</span>
          </Link>
        </div>
        <div className="w-[50%] relative">
          <input
            className="w-full px-6 font-poppins font-medium border-[0.2px] border-black outline-none h-[55px]"
            type="text"
            placeholder="Search for products..."
          />
          <div className="w-[60px] cursor-pointer flex justify-center items-center  h-[55px] bg-[#3489FF] absolute top-0 right-0">
            <Search color="#fff" />
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Link
              href={"/login"}
              className="border-2 w-[50px] h-[50px] flex items-center justify-center rounded-full border-[#010f1c1a]"
            >
              <ProfileIcon />
            </Link>

            <Link href={"/login"}>
              <span className="block font-medium">Hello,</span>
              <span>Sign In</span>
            </Link>
          </div>
          <div className="flex items-center gap-5 ">
            <Link href={"wishlist"} className="relative">
              <WishlistHeartIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
