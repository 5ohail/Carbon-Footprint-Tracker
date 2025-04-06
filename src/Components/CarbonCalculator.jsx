import { useState, useEffect } from "react"
import { Icons } from "./Icons"

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#0066cc",
    textAlign: "center",
  },
  form: {
    display: "grid",
    gap: "1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "500",
  },
  input: {
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    marginTop: "1rem",
  },
  results: {
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  resultTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  totalFootprint: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#0066cc",
    textAlign: "center",
    margin: "1.5rem 0",
  },
  breakdown: {
    display: "grid",
    gap: "1rem",
  },
  breakdownItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem",
    borderRadius: "4px",
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  category: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  progressContainer: {
    marginTop: "2rem",
  },
  progressTitle: {
    fontSize: "1rem",
    fontWeight: "500",
    marginBottom: "0.5rem",
  },
  progressBar: {
    height: "8px",
    backgroundColor: "#eaeaea",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0066cc",
  },
  comparison: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#e6f7ff",
    borderRadius: "4px",
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
}

export function CarbonCalculator() {
  const [meatConsumption, setMeatConsumption] = useState(3)
  const [electricity, setElectricity] = useState(300)
  const [milesDriven, setMilesDriven] = useState(100)
  const [footprint, setFootprint] = useState(null)

  // Conversion factors (kg CO2e)
  const MEAT_FACTOR = 4.5 // per day of meat consumption
  const ELECTRICITY_FACTOR = 0.4 // per kWh
  const DRIVING_FACTOR = 0.4 // per mile

  // Average annual per person in US (for comparison)
  const AVERAGE_ANNUAL_FOOTPRINT = 16000 // kg CO2e

  const calculateFootprint = () => {
    const meatFootprint = meatConsumption * MEAT_FACTOR * 4.33 // weekly to monthly
    const electricityFootprint = electricity * ELECTRICITY_FACTOR
    const drivingFootprint = milesDriven * DRIVING_FACTOR * 4.33 // weekly to monthly

    const totalMonthly = meatFootprint + electricityFootprint + drivingFootprint
    const totalAnnual = totalMonthly * 12

    setFootprint({
      meat: meatFootprint,
      electricity: electricityFootprint,
      driving: drivingFootprint,
      totalMonthly,
      totalAnnual,
      percentOfAverage: (totalAnnual / AVERAGE_ANNUAL_FOOTPRINT) * 100,
    })
  }

  useEffect(() => {
    calculateFootprint()
  }, [meatConsumption, electricity, milesDriven])

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Carbon Footprint Calculator</h2>

      <div style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Food /> Meat Consumption (days per week)
          </label>
          <input
            type="number"
            min="0"
            max="7"
            value={meatConsumption}
            onChange={(e) => setMeatConsumption(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Lightbulb /> Electricity Used (kWh per month)
          </label>
          <input
            type="number"
            min="0"
            value={electricity}
            onChange={(e) => setElectricity(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>
            <Icons.Car /> Miles Driven (per week)
          </label>
          <input
            type="number"
            min="0"
            value={milesDriven}
            onChange={(e) => setMilesDriven(Number(e.target.value))}
            style={styles.input}
          />
        </div>
      </div>

      {footprint && (
        <div style={styles.results}>
          <h3 style={styles.resultTitle}>Your Estimated Carbon Footprint</h3>

          <div style={styles.totalFootprint}>{footprint.totalAnnual.toFixed(2)} kg CO2e per year</div>

          <div style={styles.breakdown}>
            <div style={styles.breakdownItem}>
              <div style={styles.category}>
                <Icons.Food /> Meat Consumption
              </div>
              <div>{footprint.meat.toFixed(2)} kg CO2e/month</div>
            </div>

            <div style={styles.breakdownItem}>
              <div style={styles.category}>
                <Icons.Lightbulb /> Electricity
              </div>
              <div>{footprint.electricity.toFixed(2)} kg CO2e/month</div>
            </div>

            <div style={styles.breakdownItem}>
              <div style={styles.category}>
                <Icons.Car /> Driving
              </div>
              <div>{footprint.driving.toFixed(2)} kg CO2e/month</div>
            </div>
          </div>

          <div style={styles.progressContainer}>
            <div style={styles.progressTitle}>Compared to Average (US): {footprint.percentOfAverage.toFixed(1)}%</div>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${Math.min(footprint.percentOfAverage, 100)}%`,
                  backgroundColor: footprint.percentOfAverage > 100 ? "#e74c3c" : "#0066cc",
                }}
              />
            </div>
          </div>

          <div style={styles.comparison}>
            <p>
              The average American has a carbon footprint of approximately 16,000 kg CO2e per year. This calculator only
              accounts for three factors. Your actual carbon footprint includes many other aspects such as food choices
              beyond meat, air travel, home heating, and goods purchased.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

