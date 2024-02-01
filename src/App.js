import { tempMovieData, tempWatchedData } from "./movies_data";
import Header from "./components/header";
import Main from "./components/main";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <Main watchList={tempMovieData} watchedList={tempWatchedData}></Main>
    </div>
  );
}

export default App;
