import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd", display: "flex", gap: "10px" }}>
      <Link to="/">Home</Link>
      <Link to="/shop">Shop</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/register" style={{ marginLeft: "auto", padding: "5px 10px", border: "1px solid #333", borderRadius: "4px", textDecoration: "none" }}>
        Register
      </Link>
      <Link to="/login" style={{ padding: "5px 10px", border: "1px solid #333", borderRadius: "4px", textDecoration: "none" }}>
        Login
      </Link>
    </nav>
  );
}

export default Navbar;
