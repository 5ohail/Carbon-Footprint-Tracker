import { FeatureCard } from "./FeatureCard.jsx"
import { Icons } from "./Icons"
import { Link, useNavigate } from "react-router-dom"

const styles = {
  hero: {
    maxWidth: "64rem",
    margin: "auto",
    marginTop: "12rem",
    marginBottom: "10rem",
    textAlign: "center",
  },
  badge: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.1rem",
    padding: "0.25rem 0.75rem",
    backgroundColor: "#f5f5f5",
    borderRadius: "9999px",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.25rem",
    color: "#666",
    marginBottom: "2rem",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    fontWeight: 500,
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    backgroundColor: "white",
    border: "1px solid #eaeaea",
    fontWeight: 500,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gridTemplateRows: "auto",
    gap: "1.5rem",
    marginTop: "3rem",
  },
}

export function Home() {
  const navigate = useNavigate()
  const handleNav = () => {
    navigate("/profile")
  }
  const handleNav2 = () => {
    navigate("/about")
  }
  return (
   <>
      <div style={styles.hero}>
        <div style={styles.badge}><Icons.Ai/> AI-Powered</div>
        <h1 style={styles.title}>Track Your Carbon Footprint with AI</h1>
        <p style={styles.description}>
          Experience the future of sustainability with Carbon Tracker. Our AI-driven platform helps you understand, track, and
          reduce your carbon footprint like never before.
        </p>
        <div style={styles.buttons}>
          <button style={styles.primaryButton} onClick={handleNav}>Get Started →</button>
          <button style={styles.secondaryButton} onClick={handleNav2}>Learn More</button>
        </div>
      </div>

      <div style={styles.grid}>
        <Link to="/carbon-calculator" style={{ textDecoration: "none", color: "inherit" }}>
          <FeatureCard
            icon={Icons.Leaf}
            title="Calculator"
            description="Our AI-powered tool analyzes data to provide accurate, personalized insights into your carbon footprint."
          />
        </Link>
        <FeatureCard
          icon={Icons.Leaf}
          title="Blockchain Transparency"
          description="Immutable records ensure data integrity and trust, making your sustainability efforts verifiable and transparent."
        />
        <FeatureCard
          icon={Icons.Token}
          title="Token Rewards"
          description="Earn green tokens for sustainable actions and choices, incentivizing eco-friendly behavior."
        />
        <FeatureCard
          icon={Icons.Leaf}
          title=""
          description=""
        />
        <FeatureCard
          icon={Icons.Leaf}
          title=""
          description=""
        />
        <FeatureCard
          icon={Icons.Leaf}
          title=""
          description=""
        />
        
      </div>
      </>
    
  )
}
