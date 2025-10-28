import { NavLink } from "react-router";

export default () => {

  const toggleActive = ({ isActive }) => isActive ? "active" : ""

  return (
    <nav className="navigation">
      <NavLink to="/" end>Home</NavLink>
      <NavLink to="/about" end className={toggleActive}>About</NavLink>
      <NavLink to="/howto" className={toggleActive}>How-Tos</NavLink>
      <NavLink to="/changelog" className={toggleActive}>Changelog/Plans</NavLink>
      <NavLink to="/contacts" className={toggleActive}>Contacts</NavLink>
    </nav>
  );
}