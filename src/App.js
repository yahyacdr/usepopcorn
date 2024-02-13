import { tempMovieData, tempWatchedData } from "./movies_data";
import Header from "./components/header";
import Main from "./components/main";
import "./components/public.css";
import { useState, useEffect } from "react";

function App() {
  const [movies, setMovies] = useState({});
  const [resultLength, setResultLength] = useState(0);
  useEffect(() => {
    fetch(`http://www.omdbapi.com/?apikey=65165805&s=godFather`)
      .then((res) => res.json())
      .then((result) => {
        const resp = result.Response.toLowerCase() === "true";
        console.log(result);
        if (resp) {
          setMovies(result);
          setResultLength(+result.totalResults);
        } else {
          setMovies(result);
          setResultLength(0);
        }
      });
  }, []);

  function handleChange(e) {
    if (e.keyCode === 13) {
      console.log("Pressed:", e.target.value);
      fetch(`http://www.omdbapi.com/?apikey=65165805&s=${e.target.value}`)
        .then((res) => res.json())
        .then((result) => {
          const resp = result.Response.toLowerCase() === "true";
          if (resp) {
            setMovies(result);
            setResultLength(+result.totalResults);
          } else {
            setMovies(result);
            setResultLength(0);
          }
        });
    }
  }
  return (
    <div className="App">
      <Header length={resultLength} handleChange={handleChange}></Header>
      <Main
        result={movies}
        length={resultLength}
        watchedList={tempWatchedData}
      ></Main>
    </div>
  );
}

export default App;
