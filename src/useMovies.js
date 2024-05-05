import { useState, useEffect } from "react";
const API_KEY = process.env.REACT_APP_API_KEY;

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      //callback?.(); //Optional chaining: if the function exists, then we call it

      const controller = new AbortController(); //browser api (same as fetch)
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //reset the error state everytime the component is re-rendered
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`,
            { signal: controller.signal }
          );

          if (!res.ok) {
            throw new Error("Something went wrong with fetching movies");
          }

          const data = await res.json();

          if (data.Response === "False") throw new Error("❌ Movie not found!");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.log(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        //if the query (# of words in the search box is less than 3, we're not rendering)
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();

      return function () {
        //clean up function
        controller.abort();
      };
    },
    [query] //everytime query changes, we will have a re-render of the components
  );

  return { movies, isLoading, error };
}
