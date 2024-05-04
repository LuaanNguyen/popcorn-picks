import { useEffect, useState } from "react";
import StarRating from "./components/StarRating";
import tempMovieData from "./TempData";
import Search from "./components/Search";
import Navbar from "./components/Navbar";
import WatchedMovieList from "./components/WatchedMoviesList";
import WatchedSummary from "./components/WatchedSummary";
import Loader from "./components/Loader";
import MovieDetails from "./components/MovieDetails";

export const KEY = "72c7a217";

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

// function WatchBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMovieList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }

function Main({ children }) {
  return <main className="main">{children}</main>;
}

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const tempQuery = "interstellar";

  const handleSelectMovie = (id) => {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  };

  const handleCloseMovie = () => {
    setSelectedId(null);
  };

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(
    function () {
      const controller = new AbortController(); //browser api (same as fetch)
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError(""); //reset the error state everytime the component is re-rendered
          const res = await fetch(
            `http://www.omdbapi.com/?s=${query}&apikey=${KEY}`,
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
          if (err.name !== "AbprtError") {
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

  // useEffect(function () {
  //   fetch(`http://www.omdbapi.com/?s=interstellar&apikey=${KEY}`)
  //     .then((res) => res.json())
  //     .then((data) => setMovies(data.Search));

  //   return () => console.log("Clean Up");
  // }, []);

  return (
    <>
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>

      <Main>
        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectMovie={handleSelectMovie} movies={movies} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList
                  watched={watched}
                  onDeleteWatched={handleDeleteWatched}
                />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
