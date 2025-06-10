import { useState, useEffect } from "react";

export function useSmokingData() {
  const [records, setRecords] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedRecords = localStorage.getItem("smoking-records");
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  // Save to localStorage whenever records change
  useEffect(() => {
    localStorage.setItem("smoking-records", JSON.stringify(records));
  }, [records]);

  const addRecord = (recordData) => {
    const newRecord = {
      id: Date.now().toString(),
      ...recordData,
      created_at: new Date().toISOString(),
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const updateRecord = (id, recordData) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, ...recordData } : record
      )
    );
  };

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}
