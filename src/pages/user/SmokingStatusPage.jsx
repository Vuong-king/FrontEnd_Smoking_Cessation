import { useState, useEffect } from "react";
import { message } from "antd";
import SmokingHeader from "../../components/user/smokingstatus/SmokingHeader";
import SmokingTable from "../../components/user/smokingstatus/SmokingTable";
import SmokingModal from "../../components/user/smokingstatus/SmokingModal";
import { useSmokingData } from "../../hook/useSmokingData";
import useSmokingStatus from "../../hook/useSmokingStatus";
import { useAuth } from "../../context/AuthContext";

export default function SmokingStatusPage() {
  const {
    statusData,
    loading,
    error,
    fetchSmokingStatus,
  } = useSmokingStatus();

  console.log("records", statusData); // Thêm dòng này ngay sau khi destructuring

  const { addRecord, updateRecord, deleteRecord } = useSmokingData();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const { user } = useAuth();
  const handleSubmit = (values) => {
    const recordData = {
      frequency: values.frequency,
      cigarettes_per_day: values.cigarettes_per_day,
      cost_per_pack: values.cost_per_pack,
      start_date: values.start_date.format("YYYY-MM-DD"),
    };

    if (editingRecord) {
      updateRecord(editingRecord.id, recordData);
      message.success("Record updated successfully!");
    } else {
      addRecord(recordData);
      message.success("Record added successfully!");
    }

    handleCloseModal();
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id) => {
    deleteRecord(id);
    message.success("Record deleted successfully!");
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingRecord(null);
  };

  const userId = user.id;
  console.log("aaa", userId);
  
  useEffect(() => {
    fetchSmokingStatus(userId);
  }, [userId]);

  return (
    <div style={{ padding: "24px" }}>
      <SmokingHeader onAddClick={() => setIsModalVisible(true)} />

      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <SmokingTable
        records={statusData ? [{ ...statusData, id: statusData._id }] : []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SmokingModal
        visible={isModalVisible}
        editingRecord={editingRecord}
        onSubmit={handleSubmit}
        onCancel={handleCloseModal}
      />
    </div>
  );
}
