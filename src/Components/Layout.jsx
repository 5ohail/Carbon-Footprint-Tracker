import { Link } from "react-router-dom";
import { Icons } from "../Components/Icons";

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden", // Prevent full-page scrolling
  },
  header: {
    height: "64px",
    borderBottom: "1px solid #eaeaea",
    display: "flex",
    alignItems: "center",
    padding: "0 1rem",
    justifyContent: "space-between",
    flexShrink: 0, // Prevent shrinking
    background: "#fff",
  },
  contentWrapper: {
    display: "flex",
    flex: 1, // Occupies remaining height
    overflow: "hidden", // Prevent full-page scroll
  },
  sidebar: {
    width: "256px",
    borderRight: "1px solid #eaeaea",
    padding: "1rem",
    flexShrink: 0,
    background: "#fff",
  },
  main: {
    flex: 1,
    overflowY: "auto", // Enables scrolling only inside main container
    padding: "1.5rem",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "inherit",
  },
  nav: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "inherit",
    fontSize: "0.875rem",
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  sidebarLink: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem",
    textDecoration: "none",
    color: "inherit",
    borderRadius: "0.375rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#eaeaea",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.875rem",
    fontWeight: 500,
  },
};




export function Layout({ children }) {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Carbon Tracker</h1>
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/about" style={styles.navLink}>About</Link>
          <Link to="/contact" style={styles.navLink}>Contact</Link>
          <Link to="/profile" style={styles.navLink}>Profile</Link>
          <Link to="/company" style={styles.navLink}>Company</Link>
          <div style={styles.avatar}>DC</div>
        </nav>
      </header>

      <div style={styles.contentWrapper}>
        <aside style={styles.sidebar}>
          <nav style={styles.sidebarNav}>
            <Link to="/" style={styles.sidebarLink}>
              <Icons.Home /> Dashboard
            </Link>
            <Link to="/ai-analysis" style={styles.sidebarLink}>
              <Icons.Chart /> AI Analysis
            </Link>
            <Link to="/carbon-calculator" style={styles.sidebarLink}>
              <Icons.Leaf /> Calculator
            </Link>
            <Link to="/rewards" style={styles.sidebarLink}>
              <Icons.Token /> Token Rewards
            </Link>
            <Link to="/report" style={styles.sidebarLink}>
              <Icons.Report /> Report
            </Link>
            <Link to="/iot" style={styles.sidebarLink}>
              <Icons.Bolt /> IoT Integration
            </Link>
          </nav>
        </aside>

        <main style={styles.main}>{children}</main>
      </div>
    </div>
  );
}

