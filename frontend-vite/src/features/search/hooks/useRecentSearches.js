import { useEffect, useState } from "react";

export default function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const stored =
      JSON.parse(localStorage.getItem("recentSearches")) || [];
    setRecentSearches(stored);
  }, []);

  const saveRecentSearch = (newSearch) => {
    const stored =
      JSON.parse(localStorage.getItem("recentSearches")) || [];

    const filtered = stored.filter(
      s =>
        s.source !== newSearch.source ||
        s.destination !== newSearch.destination ||
        s.date !== newSearch.date
    );

    const updated = [newSearch, ...filtered].slice(0, 3);

    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  return { recentSearches, saveRecentSearch };
}