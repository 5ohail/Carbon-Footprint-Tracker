import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Card, CardContent, CardActions } from "@mui/material";
import { Button, TextField, Typography, Container, MenuItem, Select } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { initializeApp } from "firebase/app";
import { useData } from "../utils/DataProvider";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

initializeApp(firebaseConfig);
const db = getDatabase();

const trainModel = async (data) => {
  const xs = tf.tensor2d(data.map((_, i) => [i]), [data.length, 1]);
  const ys = tf.tensor2d(data.map((d) => [d.value]), [data.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ loss: "meanSquaredError", optimizer: "sgd" });
  
  await model.fit(xs, ys, { epochs: 100 });
  return model;
};

const predictValues = async (model, data) => {
  const xsPred = tf.tensor2d(data.map((_, i) => [i]), [data.length, 1]);
  const preds = model.predict(xsPred);
  const predValues = await preds.data();
  return data.map((entry, i) => {
    const reduction = entry.value - predValues[i];
    return {
      ...entry,
      prediction: predValues[i],
      reduction: reduction < 0 ? "No reduction needed" : reduction.toFixed(2)
    };
  });
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CarbonFootprintAI() {;
  const [newEntry, setNewEntry] = useState({ month: "", value: "" });
  const [aiData, setAIData] = useState([]);
  const [model, setModel] = useState(null);
  const { data } = useData();
  const Data = Object.values(data);
  useEffect(() => {
    if (Data.length > 0) {
      const initializeModel = async () => {
        const trainedModel = await trainModel(Data);
        setModel(trainedModel);
      };
      initializeModel();
    }
  }, [Data]);

  const addData = async () => {
    if (!newEntry.month || !newEntry.value) return;
    const updatedData = [...Data, { month: newEntry.month, value: Number(newEntry.value) }];
    updatedData.sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
    set(ref(db, "carbonData"), updatedData);
    if (model) {
      const predictions = await predictValues(model, updatedData);
      setAIData(predictions);
    }
    setNewEntry({ month: "", value: "" });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
        AI Carbon Footprint Analysis
      </Typography>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardContent>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "center" }}>
            <Select
              value={newEntry.month}
              onChange={(e) => setNewEntry({ ...newEntry, month: e.target.value })}
              displayEmpty
              fullWidth
              sx={{ height: "56px" }}
            >
              <MenuItem value="" disabled>Select Month</MenuItem>
              {months.map((month) => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </Select>
            <TextField
              label="Emission Value"
              type="number"
              variant="outlined"
              fullWidth
              value={newEntry.value}
              onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={addData} 
              sx={{
                height: "56px",
                background: "#0066cc",
                color: "white",
                fontWeight: "semibold",
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              Add Data
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={aiData.length > 0 ? aiData : [{ month: "", value: 0, prediction: 0 }]}> 
              <XAxis dataKey="month" stroke="#4A5568" />
              <YAxis stroke="#4A5568" />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#1976D2" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="prediction" stroke="#43A047" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <Typography variant="h6" sx={{ mt: 2, textAlign: "center", color: "black" }}>
            Suggested Reduction: {aiData.length > 0 ? aiData[aiData.length - 1].reduction : "N/A"} units
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
