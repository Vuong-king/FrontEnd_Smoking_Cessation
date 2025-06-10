
import { useState} from "react"
import { message } from "antd"
import { calculateDays, calculateTotalCost } from "../../utils/Calculation"
import SmokingHeader from "../../components/user/smokingstatus/SmokingHeader"
import StatisticsCards from "../../components/user/smokingstatus/StatisticsCards"
import SmokingTable from "../../components/user/smokingstatus/SmokingTable"
import SmokingModal from "../../components/user/smokingstatus/SmokingModal"
import { useSmokingData } from "../../hook/useSmokingData"


export default function SmokingStatusPage() {
  const { records, addRecord, updateRecord, deleteRecord } = useSmokingData()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)

  const handleSubmit = (values) => {
    const recordData = {
      frequency: values.frequency,
      cigarettes_per_day: values.cigarettes_per_day,
      cost_per_pack: values.cost_per_pack,
      start_date: values.start_date.format("YYYY-MM-DD"),
    }

    if (editingRecord) {
      updateRecord(editingRecord.id, recordData)
      message.success("Record updated successfully!")
    } else {
      addRecord(recordData)
      message.success("Record added successfully!")
    }

    handleCloseModal()
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    setIsModalVisible(true)
  }

  const handleDelete = (id) => {
    deleteRecord(id)
    message.success("Record deleted successfully!")
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
    setEditingRecord(null)
  }

  const getTotalStats = () => {
    if (records.length === 0) return { totalCost: 0, totalDays: 0, totalCigarettes: 0 }

    const totalCost = records.reduce((sum, record) => sum + calculateTotalCost(record), 0)
    const totalDays = records.reduce((sum, record) => sum + calculateDays(record.start_date), 0)
    const totalCigarettes = records.reduce(
      (sum, record) => sum + record.cigarettes_per_day * calculateDays(record.start_date),
      0,
    )

    return { totalCost, totalDays, totalCigarettes }
  }

  return (
    <div style={{ padding: "24px" }}>
      <SmokingHeader onAddClick={() => setIsModalVisible(true)} />
      
      <StatisticsCards stats={getTotalStats()} />
      
      <SmokingTable 
        records={records}
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
  )
}