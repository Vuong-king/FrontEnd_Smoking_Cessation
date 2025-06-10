
import { Table, Card, Badge, Button, Space, Popconfirm } from "antd"
import { 
  Edit, 
  Trash2, 
  Calculator, 
  Calendar, 
  Clock, 
  BarChart3,
  Cigarette,
  DollarSign 
} from "lucide-react"
import { getFrequencyColor, getFrequencyLabel } from "../../../utils/Helpers"
import { calculateDays, calculateTotalCost } from "../../../utils/Calculation"


export default function SmokingTable({ records, onEdit, onDelete }) {
  const columns = [
    {
      title: "Frequency",
      dataIndex: "frequency",
      key: "frequency",
      render: (frequency) => (
        <Badge color={getFrequencyColor(frequency)} text={getFrequencyLabel(frequency)} />
      ),
    },
    {
      title: (
        <Space>
          <Cigarette size={14} />
          Cigs/day
        </Space>
      ),
      dataIndex: "cigarettes_per_day",
      key: "cigarettes_per_day",
      render: (value) => `${value} cigs`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Price/pack
        </Space>
      ),
      dataIndex: "cost_per_pack",
      key: "cost_per_pack",
      render: (value) => `${value.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      title: (
        <Space>
          <Calendar size={14} />
          Start date
        </Space>
      ),
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: (
        <Space>
          <Clock size={14} />
          Days
        </Space>
      ),
      key: "days",
      render: (_, record) => `${calculateDays(record.start_date)} days`,
    },
    {
      title: (
        <Space>
          <Calculator size={14} />
          Total cost
        </Space>
      ),
      key: "total_cost",
      render: (_, record) => (
        <span style={{ color: "#f5222d", fontWeight: "bold" }}>
          {calculateTotalCost(record).toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => onEdit(record)}
            title="Edit record"
          />
          <Popconfirm
            title="Are you sure you want to delete this record?"
            onConfirm={() => onDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="default" 
              danger 
              icon={<Trash2 size={14} />} 
              size="small" 
              title="Delete record" 
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Card
      title={
        <Space>
          <BarChart3 size={20} style={{ color: "#1890ff" }} />
          Smoking History
        </Space>
      }
      style={{ marginBottom: "24px" }}
      hoverable
    >
      <Table
        columns={columns}
        dataSource={records}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <Cigarette size={48} style={{ color: "#d9d9d9", marginBottom: "16px" }} />
              <div style={{ color: "#666" }}>No data yet. Add your first information!</div>
            </div>
          ),
        }}
        scroll={{ x: 800 }}
        rowHover
      />
    </Card>
  )
}