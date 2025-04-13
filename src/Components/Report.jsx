import React, { useEffect } from "react";
import ReportTable from "./ReportTable";
import { useData } from "../utils/DataProvider";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const styles = {
  heading: {
    fontWeight: "bold",
    fontSize: "2rem",
    textAlign: "center",
    margin: "0.2rem 0 1.5rem 0",
    color: "#0066cc",
  },
};

const Report = () => {
  const { data, setData, fetchData, loading, setGraphData } = useData();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData();
      } else {
        setData({});
        setGraphData([]); // Clear graphData on logout
      }
    });

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (!updatedUser) {
        setData({});
        setGraphData([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const formattedData =
    data && typeof data === "object"
      ? Object.entries(data).map(([key, entry], index) => ({
          serial: index + 1,
          activity: entry.activity,
          co2Emitted: entry.emission,
          date: new Date(entry.date)
            .toLocaleDateString("en-GB")
            .replaceAll("/", "-"),
        }))
      : [];

  return (
    <div className="container w-full flex flex-col items-center px-4">
      <h1 style={styles.heading}>Report</h1>
      {loading ? (
        <p className="text-gray-600 text-lg">Loading IoT data...</p>
      ) : formattedData.length > 0 ? (
        <ReportTable
          data={formattedData}
          serialNum="Sr. No."
          heading="Activity"
          readings="Emissions (kilograms of CO₂)"
          date="Date"
        />
      ) : (
        <p className="text-gray-500 text-lg">No IoT data found.</p>
      )}
    </div>
  );
};

export default Report;
