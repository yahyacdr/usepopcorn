import "./header.css";
export default function Header(props) {
  return (
    <>
      <header>
        <div className="banner">
          <div className="logo">
            <p>🍿 usePopcorn</p>
          </div>
          <SearchBar></SearchBar>
          <div className="result-count">
            <p>
              Found <strong>{props.moviesList.length}</strong> results
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

function SearchBar() {
  return (
    <>
      <input type="search" placeholder="Search movies..." />
    </>
  );
}
