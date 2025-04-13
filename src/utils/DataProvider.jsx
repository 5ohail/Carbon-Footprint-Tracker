import React, { createContext, useState, useContext, useRef, useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { db } from "./Firebase";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  const dbRef = useRef(null); // store the DB ref to unsubscribe later

  const fetchData = (userId) => {
    if (!userId) return;

    setLoading(true); // Ensure loading is true when fetching

    dbRef.current = ref(db, `users/${userId}`);

    onValue(
      dbRef.current,
      (snapshot) => {
        const value = snapshot.val();
        setData(value || {}); // Update the data state
        setLoading(false); // Mark loading as false after data is fetched

        if (value && typeof value === "object") {
          const formatted = Object.entries(value).map(([key, entry]) => ({
            name: new Date(entry.date || Date.now()).toLocaleDateString(),
            emissions: parseFloat(entry.emission || 0),
          }));
          setGraphData(formatted);
        } else {
          setGraphData([]);
        }
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Mark loading as false if an error occurs
        setData({}); // Optionally reset data on error
        setGraphData([]); // Reset graph data on error
      }
    );
  };

  // Cleanup the listener when the component unmounts or when userId changes
  useEffect(() => {
    return () => {
      if (dbRef.current) {
        off(dbRef.current); // Unsubscribe from the listener
      }
    };
  }, []);

  return (
    <DataContext.Provider value={{ data, setData, graphData, setGraphData, fetchData, loading, setLoading }}>
      {children}
    </DataContext.Provider>
  );
};

function useData() {
  return useContext(DataContext);
}

export { useData };
