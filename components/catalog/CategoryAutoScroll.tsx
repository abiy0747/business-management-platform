"use client";

import { useEffect } from "react";

type CategoryAutoScrollProps = {
  selectedCategory: string;
};

export default function CategoryAutoScroll({
  selectedCategory,
}: CategoryAutoScrollProps) {
  useEffect(() => {
    // Don't scroll when viewing all products
    if (!selectedCategory || selectedCategory === "All") {
      return;
    }

    // Wait for the catalog UI to render first
    const timer = setTimeout(() => {
      const productsSection = document.getElementById("products");

      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [selectedCategory]);

  return null;
}