import React, { useEffect, useState } from "react";
import { useData } from "../utils/DataProvider";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const styles = {
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  },
  statCard: {
    backgroundColor: "#f9fafb",
    padding: "1.5rem",
    borderRadius: "8px",
    textAlign: "center",
  },
  statValue: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#0066cc",
    marginBottom: "0.5rem",
  },
  statLabel: {
    fontSize: "0.875rem",
    color: "#666",
  },
};

const IOT = () => {
  const { data, graphData, setGraphData, setData } = useData();
  const location = useLocation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(); // Assuming `fetchData` is defined elsewhere
      } else {
        setData({});
        setGraphData([]);
        localStorage.removeItem("user"); // Optional but good
      }
    });

    return () => unsubscribe();
  }, [location]);

  // TOTAL EMISSIONS FUNCTIONALITY
  const totalEmissions = () => {
    return data ? Object.values(data).reduce((total, e) => total + e.emission, 0) : 0;
  };

  // CALCULATING THE REDUCTION GOALS
  const calculateReductionGoal = () => {
    if (!Array.isArray(graphData) || graphData.length === 0) return 0;

    const updatedData = graphData.map((entry) => {
      const reductionGoal = entry.emissions - entry.emissions * 0.1; // 10% reduction
      return {
        ...entry,
        reductionGoal: parseFloat(reductionGoal.toFixed(2)),
      };
    });

    const total = updatedData.reduce((sum, entry) => sum + entry.reductionGoal, 0);
    return total / updatedData.length || 0;
  };

  // AI to get total emission reduction
  const getTotalEmissionReduction = (data) => {
    const sorted = Object.values(data)
      .filter((item) => item.emission !== undefined)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    let totalReduction = 0;

    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i - 1].emission - sorted[i].emission;
      if (diff > 0) totalReduction += diff;
    }

    return totalReduction.toFixed(2); // in kg CO₂
  };

  // GAUGE CHART LOGIC
  const percentage = () => {
    const dataArray = graphData?.length ? graphData : null;
    if (!dataArray || dataArray.length === 0) return 0;

    const total = dataArray.reduce((acc, item) => acc + (item.emissions || 0), 0);
    const avgEmissions = total / dataArray.length;

    const monthlyGoal = 200; // Change this as needed
    const percent = Math.round((avgEmissions / monthlyGoal) * 100);

    return Math.min(percent, 100); // Cap it at 100%
  };

  return (
    <>
      <h2 className="font-bold text-3xl mb-4 text-[#0066cc]">Carbon Footprint Statistics</h2>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalEmissions()} kg</div>
          <div style={styles.statLabel}>CO2 Emissions Tracked</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{getTotalEmissionReduction(data)} kg</div>
          <div style={styles.statLabel}>CO2 Emissions Reduced</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>5</div>
          <div style={styles.statLabel}>Offset Projects Supported</div>
        </div>
      </div>

      {/* Circular Gauge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: "2rem",
        }}
      >
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            value={calculateReductionGoal()}
            text={`${calculateReductionGoal()}%`}
            styles={buildStyles({
              pathColor: "#0066cc",
              textColor: "#0066cc",
            })}
          />
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#666",
            }}
          >
            Reduction Goal
          </p>
        </div>
        <div style={{ width: 100, height: 100 }}>
          <CircularProgressbar
            value={percentage()}
            text={`${percentage()}%`}
            styles={buildStyles({
              pathColor: "#e74c3c",
              textColor: "#e74c3c",
            })}
          />
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#666",
            }}
          >
            Current Impact
          </p>
        </div>
      </div>

      {/* Line Graph */}
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: "600",
          marginBottom: "1rem",
          marginTop: "2rem",
        }}
      >
        Monthly CO2 Emissions
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#0066cc"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default IOT;
