import React, { useEffect } from "react";
import CarbonFootprintTable from "./CarbonFootprintTable";
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

const IOT = () => {
  const { data, fetchData, loading } = useData();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid);
      }
    });
    return () => unsubscribe();
  }, [fetchData]);

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
      <h1 style={styles.heading}>IoT Integration</h1>

      {loading ? (
        <p className="text-gray-600 text-lg">Loading IoT data...</p>
      ) : formattedData.length > 0 ? (
        <CarbonFootprintTable
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

export default IOT;
