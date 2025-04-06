import { Icons } from "./Icons"
import { FeatureCard } from "./FeatureCard"

const styles = {
  container: {
    maxWidth: "64rem",
    margin: "0 auto",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1rem",
    color: "rgb(0, 102, 204)",
  },
  subtitle: {
    fontSize: "1.25rem",
    color: "#666",
    textAlign: "center",
    marginBottom: "3rem",
  },
  mission: {
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    marginBottom: "3rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: 600,
    marginBottom: "1rem",
  },
  missionText: {
    color: "#666",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
}

export function About() {
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.title}>About Carbon Tracker</h1>
        <p style={styles.subtitle}>
          Empowering individuals and businesses to track, reduce, and offset their carbon footprint through cutting-edge
          technology.
        </p>

        <div style={styles.mission}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.missionText}>
           Carbon Tracker (Decentralized Carbon Footprint Tracker) is committed to empowering individuals and businesses to
            understand, track, and reduce their carbon footprint. By leveraging cutting-edge technologies such as AI,
            blockchain, and IoT, we aim to create a more sustainable future for our planet.
          </p>
        </div>

        <div style={styles.grid}>
          <FeatureCard
            icon={Icons.Leaf}
            title="Eco-Friendly"
            description="Promoting sustainable practices and reducing carbon emissions through informed decision-making."
          />
          <FeatureCard
            icon={Icons.Chart}
            title="AI-Powered"
            description="Utilizing advanced artificial intelligence for accurate carbon footprint analysis and personalized recommendations."
          />
          <FeatureCard
            icon={Icons.Token}
            title="Token Rewards"
            description="Incentivizing sustainable choices through a blockchain-based token reward system."
          />
        </div>
      </div>
    </>
  )
}

