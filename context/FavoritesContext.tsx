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
};

type FavoritesContextType = {
  favorites: FavoriteProduct[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
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

  const isFavorite = (id: string) => {
    return favorites.some(
      (product) => product.id === id
    );
  };

  const toggleFavorite = (
    product: FavoriteProduct
  ) => {
    setFavorites((current) => {
      const alreadyFavorite = current.some(
        (item) => item.id === product.id
      );

      if (alreadyFavorite) {
        return current.filter(
          (item) => item.id !== product.id
        );
      }

      return [...current, product];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((current) =>
      current.filter(
        (product) => product.id !== id
      )
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
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