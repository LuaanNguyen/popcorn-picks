export default function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div onClick={() => window.location.reload()} className="logo">
      <span role="img">🍿</span>
      <h1>Popcorn Picks</h1>
    </div>
  );
}
