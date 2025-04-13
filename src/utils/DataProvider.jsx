import React, { createContext, useState, useContext, useRef } from "react";
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

    dbRef.current = ref(db, `users/${userId}`);

    onValue(
      dbRef.current,
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
    <DataContext.Provider value={{ data, setData, graphData, setGraphData, fetchData, loading }}>
      {children}
    </DataContext.Provider>
  );
};

function useData() {
  return useContext(DataContext);
}

export { useData };
