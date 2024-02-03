import { tempMovieData, tempWatchedData } from "./movies_data";
import Header from "./components/header";
import Main from "./components/main";
import "./components/public.css";
import { useState } from "react";

function App() {
  const [movies, setMovies] = useState(tempMovieData);
  return (
    <div className="App">
      <Header moviesList={movies}></Header>
      <Main watchList={movies} watchedList={tempWatchedData}></Main>
    </div>
  );
}

export default App;
