import "./main.css";
import { useState } from "react";

export default function Main(props) {
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  function countAverage(arr, prop) {
    return arr.reduce((acc, curr) => acc + curr[prop], 0) / arr.length;
  }
  console.log(props.result);
  return (
    <main>
      <div className="watchList">
        <CollapseBtn isOpen={isOpen1} setIsOpen={setIsOpen1}></CollapseBtn>
        {isOpen1 &&
          props.result.Search.map((wl) =>
            typeof wl.Error !== "string" ? (
              <WatchListPanel
                poster={wl.Poster}
                title={wl.Title}
                releaseYear={wl.Year}
                key={wl.imdbID}
              ></WatchListPanel>
            ) : (
              <h1>{wl}</h1>
            )
          )}
      </div>
      <div className="watchedList">
        <CollapseBtn isOpen={isOpen2} setIsOpen={setIsOpen2}></CollapseBtn>
        {isOpen2 && (
          <WatchedListCounter
            count={props.watchedList.length}
            averageRate={countAverage(props.watchedList, "imdbRating")}
            averageMyRate={countAverage(props.watchedList, "userRating")}
            averageDuration={countAverage(props.watchedList, "runtime")}
          ></WatchedListCounter>
        )}
        <div className="list">
          {isOpen2 &&
            props.watchedList.map((wdl) => (
              <WatchedListPanel
                poster={wdl.Poster}
                title={wdl.Title}
                rate={wdl.imdbRating}
                myRate={wdl.userRating}
                duration={wdl.runtime}
                key={wdl.imdbID}
              ></WatchedListPanel>
            ))}
        </div>
      </div>
    </main>
  );
}

function WatchListPanel(props) {
  return (
    <>
      <div className="panel">
        <div className="img-cntnr">
          <img src={props.poster} alt="movie-poster" />
        </div>
        <div className="ttl-date">
          <h4 className="title">{props.title}</h4>
          <p className="date">📅 {props.releaseYear}</p>
        </div>
      </div>
      <div className="line"></div>
    </>
  );
}

function WatchedListPanel(props) {
  return (
    <>
      <div className="panel">
        <div className="img-cntnr">
          <img src={props.poster} alt="movie-poster" />
        </div>
        <div className="ttl-details">
          <h4 className="title">{props.title}</h4>
          <div className="details">
            <p className="date">⭐ {props.rate}</p>
            <p className="date">🌟 {props.myRate}</p>
            <p className="date">⏳ {props.duration} min</p>
          </div>
        </div>
      </div>
    </>
  );
}

function WatchedListCounter(props) {
  return (
    <>
      <div className="counter-cntnr">
        <h5>MOVIES YOU WATCHED</h5>
        <div className="details">
          <p>#️⃣ {props.count} movies</p>
          <p>⭐️ {props.averageRate}</p>
          <p>🌟 {props.averageMyRate}</p>
          <p>⏳ {props.averageDuration} min</p>
        </div>
      </div>
    </>
  );
}

function CollapseBtn(props) {
  function toggleListDisplay() {
    props.setIsOpen((ip) => !ip);
  }
  return (
    <div className="collapse-btn">
      <button type="button" onClick={toggleListDisplay}>
        <div className="plus">
          <span className="mid-line line"></span>
          <span
            className="cross-line line"
            style={{ display: props.isOpen ? "none" : "block" }}
          ></span>
        </div>
      </button>
    </div>
  );
}
