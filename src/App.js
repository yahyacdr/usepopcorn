import { useState, useEffect } from "react";
import StarRating from "./components/starRating";
import "./index.css";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
const KEY = "65165805";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [qry, setQry] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;

      setIsLoading(true);
      setErr("");
      fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${qry}`, {
        signal: signal,
      })
        .then((res) => res.json())
        .then((result) => {
          const resp = result.Response.toLowerCase() === "true";
          if (!resp) {
            let errMsg = qry.length < 3 ? "Type to Search" : result.Error;
            throw new Error(errMsg);
          }
          setMovies(result.Search);
        })
        .catch((e) => {
          console.error(e);
          if (e.name !== "AbortError") {
            setErr(e.message);
            setMovies([]);
          }
        })
        .finally(function () {
          setIsLoading(false);
        });
      return function () {
        controller.abort();
      };
    },
    [qry]
  );

  function handleSelected(id) {
    setSelectedId((sId) => (sId === id ? null : id));
  }

  function closeMovie() {
    setSelectedId(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...new Set([...watched, movie])]);
    closeMovie();
  }

  function handleDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search qry={qry} setQry={setQry} />
        <NumResults count={movies.length} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !err && (
            <MovieList movies={movies} onSelectMovie={handleSelected} />
          )}
          {err && <ErrMsg msg={err} />}
        </Box>
        <Box>
          {!selectedId ? (
            <>
              <Summary watched={watched} />
              <WatchedList watched={watched} onDelete={handleDelete} />
            </>
          ) : (
            <SelectedMovie
              selectedId={selectedId}
              onCloseMovie={closeMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          )}
        </Box>
      </Main>
    </>
  );
}

function SelectedMovie({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [selectedMovie, setSelectedMovie] = useState({});
  const [userRating, setUserRating] = useState("");

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genres: genres,
  } = selectedMovie;
  useEffect(
    function () {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`, {
        signal: signal,
      })
        .then((res) => res.json())
        .then((result) => {
          const resp = result.Response.toLowerCase() === "true";
          if (!resp) {
            throw new Error(result.Error);
          }
          setSelectedMovie(result);
        })
        .catch((e) => {})
        .finally(function () {});
      return function () {
        controller.abort();
      };
    },
    [selectedId]
  );

  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "usePopcorn";
    };
  });
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const currUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: +imdbRating,
      runtime: +runtime.split(" ").at(0),
      userRating,
    };

    onAddWatched(newWatchedMovie);
  }
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          &larr;
        </button>
        <img src={poster} alt={`Poster of ${title} movie`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genres}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDB rating
          </p>
        </div>
      </header>
      <section>
        {!isWatched ? (
          <>
            <StarRating maxRating={10} size={28} onSetRating={setUserRating} />
            {userRating > 0 && (
              <button className="btn-add" onClick={handleAdd}>
                + Add to list
              </button>
            )}
          </>
        ) : (
          <p>
            You rated this movie {currUserRating} <span>⭐</span>
          </p>
        )}
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrMsg({ msg }) {
  return (
    <p className="error">
      <span>⛔</span> {msg}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ qry, setQry }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      onChange={(e) => setQry(e.target.value)}
    />
  );
}

function NumResults({ count }) {
  return (
    <p className="num-results">
      Found <strong>{count}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
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
    <li onClick={() => onSelectMovie(movie.imdbID)}>
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

function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDelete }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={() => onDelete(movie.imdbID)}>
          ❌
        </button>
      </div>
    </li>
  );
}

function Summary({ watched }) {
  const avgImdbRating = Math.round(
    average(watched.map((movie) => movie.imdbRating))
  );
  const avgUserRating = average(
    watched.map((movie) => movie.userRating)
  ).toFixed(2);
  const avgRuntime = Math.round(average(watched.map((movie) => movie.runtime)));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
