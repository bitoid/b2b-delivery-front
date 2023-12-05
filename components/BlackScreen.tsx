"use client";
import { useEffect } from "react";

export default function BlackScreen({
  setIsBlackScreen,
  isBlackScreen,
}: {
  setIsBlackScreen: (isBlackScreen: boolean) => void;
  isBlackScreen: boolean;
}) {
  let body = document.querySelector("body");

  useEffect(() => {
    if (body)
      if (isBlackScreen) {
        body.style.overflow = "hidden";
      }

    return () => {
      if (body) body.style.overflow = "";
    };
  }, []);

  return (
    <div
      onClick={() => setIsBlackScreen(false)}
      className="w-[100vw] h-[100vh] fixed bg-black top-0 z-5 left-0 opacity-60 overflow-hidden"
    ></div>
  );
}
