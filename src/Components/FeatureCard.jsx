const styles = {
    card: {
      padding: "4rem 1.5rem",
      border: "1px solid #a6a6a6",
      borderRadius: "0.5rem",
      textAlign: "center",
    },
    icon: {
      display: "inline-flex",
      padding: "1rem",
      backgroundColor: "#f0f7ff",
      borderRadius: "50%",
      color: "#0066cc",
      marginBottom: "1rem",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
    },
    description: {
      color: "#666",
      fontSize: "0.875rem",
    },
  }
  
  export function FeatureCard({ icon: Icon, title, description }) {
    return (
      <div style={styles.card}>
        <div style={styles.icon}>
          <Icon />
        </div>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.description}>{description}</p>
      </div>
    )
  }
  
  