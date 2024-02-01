import "./main.css";
export default function Main(props) {
  function countAverage(arr, prop) {
    const sum = arr.reduce((acc, curr) => acc + curr[prop], 0);
    return sum / arr.length;
  }
  return (
    <main>
      <div className="watchList">
        {props.watchList.map((wl) => (
          <WatchList
            poster={wl.Poster}
            title={wl.Title}
            releaseYear={wl.Year}
            key={wl.imdbID}
          ></WatchList>
        ))}
      </div>
      <div className="watchedList">
        <WatchedListCounter
          count={props.watchedList.length}
          averageRate={countAverage(props.watchedList, "imdbRating")}
          averageMyRate={countAverage(props.watchedList, "userRating")}
          averageDuration={countAverage(props.watchedList, "runtime")}
        ></WatchedListCounter>
        <div className="list">
          {props.watchedList.map((wdl) => (
            <WatchedList
              poster={wdl.Poster}
              title={wdl.Title}
              rate={wdl.imdbRating}
              myRate={wdl.userRating}
              duration={wdl.runtime}
              key={wdl.imdbID}
            ></WatchedList>
          ))}
        </div>
      </div>
    </main>
  );
}

function WatchList(props) {
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
    </>
  );
}

function WatchedList(props) {
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
