// DataContext.jsx
import React, { createContext, useState, useContext } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./Firebase";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = (userId) => {
    const dataRef = ref(db, `users/${userId}`);
    onValue(
      dataRef,
      (snapshot) => {
        const value = snapshot.val();
        setData(value || {});
        setLoading(false);

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
        setLoading(false);
      }
    );
  };

  return (
    <DataContext.Provider value={{ data, graphData, fetchData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

function useData() {
  return useContext(DataContext);
}

export { useData };
