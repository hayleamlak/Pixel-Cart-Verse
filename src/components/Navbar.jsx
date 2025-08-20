import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>
      <Link to="/shop" style={{ marginRight: "10px" }}>Shop</Link>
      <Link to="/cart" style={{ marginRight: "10px" }}>Cart</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
