"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type FavoriteProduct = {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  category: string;
  image: string;
  description?: string | null;
  sellerSlug: string;
};

type FavoritesContextType = {
  favorites: FavoriteProduct[];
  getFavorites: (sellerSlug: string) => FavoriteProduct[];
  isFavorite: (sellerSlug: string, id: string) => boolean;
  toggleFavorite: (
    sellerSlug: string,
    product: Omit<FavoriteProduct, "sellerSlug">
  ) => void;
  removeFavorite: (sellerSlug: string, id: string) => void;
  clearFavorites: (sellerSlug: string) => void;
};

const FavoritesContext = createContext<
  FavoritesContextType | undefined
>(undefined);

const STORAGE_KEY = "business-platform-favorites";

export function FavoritesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(
    []
  );

  const [loaded, setLoaded] = useState(false);

  // Load favorites for this browser session
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load favorites:",
        error
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save favorites whenever they change
  useEffect(() => {
    if (!loaded) return;

    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        "Failed to save favorites:",
        error
      );
    }
  }, [favorites, loaded]);

  const getFavorites = (sellerSlug: string) => {
    return favorites.filter(
      (product) => product.sellerSlug === sellerSlug
    );
  };

  const isFavorite = (
    sellerSlug: string,
    id: string
  ) => {
    return favorites.some(
      (product) =>
        product.sellerSlug === sellerSlug &&
        product.id === id
    );
  };

  const toggleFavorite = (
    sellerSlug: string,
    product: Omit<FavoriteProduct, "sellerSlug">
  ) => {
    setFavorites((current) => {
      const alreadyFavorite = current.some(
        (item) =>
          item.sellerSlug === sellerSlug &&
          item.id === product.id
      );

      if (alreadyFavorite) {
        return current.filter(
          (item) =>
            !(
              item.sellerSlug === sellerSlug &&
              item.id === product.id
            )
        );
      }

      return [
        ...current,
        {
          ...product,
          sellerSlug,
        },
      ];
    });
  };

  const removeFavorite = (
    sellerSlug: string,
    id: string
  ) => {
    setFavorites((current) =>
      current.filter(
        (product) =>
          !(
            product.sellerSlug === sellerSlug &&
            product.id === id
          )
      )
    );
  };

  const clearFavorites = (sellerSlug: string) => {
    setFavorites((current) =>
      current.filter(
        (product) => product.sellerSlug !== sellerSlug
      )
    );
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        getFavorites,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(
    FavoritesContext
  );

  if (!context) {
    throw new Error(
      "useFavorites must be used inside FavoritesProvider"
    );
  }

  return context;
}
