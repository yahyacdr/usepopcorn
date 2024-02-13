import "./header.css";
export default function Header(props) {
  return (
    <>
      <header>
        <div className="banner">
          <div className="logo">
            <p>🍿 usePopcorn</p>
          </div>
          <SearchBar handleChange={props.handleChange}></SearchBar>
          <div className="result-count">
            <p>
              Found <strong>{props.length}</strong> results
            </p>
          </div>
        </div>
      </header>
    </>
  );
}

function SearchBar(props) {
  return (
    <>
      <input
        type="search"
        placeholder="Search movies..."
        onKeyDown={props.handleChange}
      />
    </>
  );
}
