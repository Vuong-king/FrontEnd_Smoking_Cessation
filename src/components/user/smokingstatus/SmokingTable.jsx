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

// Helper functions
const getFrequencyColor = (frequency) => {
  const colors = {
    1: "green",     // Low
    2: "orange",    // Medium  
    3: "red",       // High
    4: "volcano",   // Very High
    5: "magenta"    // Extreme
  }
  return colors[frequency] || "default"
}

const getFrequencyLabel = (frequency) => {
  const labels = {
    1: "Thấp",
    2: "Trung bình", 
    3: "Cao",
    4: "Rất cao",
    5: "Cực kỳ"
  }
  return labels[frequency] || "Không xác định"
}

const calculateDays = (startDate) => {
  const start = new Date(startDate)
  const today = new Date()
  const diffTime = Math.abs(today - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

const calculateTotalCost = (record) => {
  const days = calculateDays(record.start_date)
  const packsPerDay = record.cigarettes_per_day / 20 // Assuming 20 cigarettes per pack
  const totalCost = days * packsPerDay * record.cost_per_pack
  return Math.round(totalCost)
}

const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString)
  return {
    date: date.toLocaleDateString("vi-VN"),
    time: date.toLocaleTimeString("vi-VN", { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }
}

export default function SmokingTable({ records, onEdit, onDelete }) {
  const columns = [
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      render: (frequency) => (
        <Badge 
          color={getFrequencyColor(frequency)} 
          text={`${frequency} - ${getFrequencyLabel(frequency)}`} 
        />
      ),
    },
    {
      title: (
        <Space>
          <Cigarette size={14} />
          Số điếu/ngày
        </Space>
      ),
      dataIndex: "cigarettes_per_day",
      key: "cigarettes_per_day",
      render: (value) => `${value} điếu`,
    },
    {
      title: (
        <Space>
          <DollarSign size={14} />
          Giá/vỉ
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
          Ngày bắt đầu
        </Space>
      ),
      dataIndex: "start_date",
      key: "start_date",
      render: (date) => {
        const formatted = formatDateTime(date)
        return (
          <div>
            <div>{formatted.date}</div>
            <small style={{ color: "#666" }}>{formatted.time}</small>
          </div>
        )
      },
    },
    {
      title: (
        <Space>
          <Calculator size={14} />
          Số ngày hút
        </Space>
      ),
      key: "days",
      render: (_, record) => `${calculateDays(record.start_date)} ngày`,
    },
    {
      title: (
        <Space>
          <Calculator size={14} />
          Tổng chi phí
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
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<Edit size={14} />}
            size="small"
            onClick={() => onEdit(record)}
            title="Chỉnh sửa"
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa bản ghi này không?"
            onConfirm={() => onDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="default"
              danger
              icon={<Trash2 size={14} />}
              size="small"
              title="Xóa"
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
          Lịch sử hút thuốc
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
          showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng ${total} mục`,
        }}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <Cigarette size={48} style={{ color: "#d9d9d9", marginBottom: "16px" }} />
              <div style={{ color: "#666" }}>Chưa có dữ liệu. Hãy thêm thông tin đầu tiên của bạn!</div>
            </div>
          ),
        }}
        scroll={{ x: 1200 }}
        rowHover
        size="middle"
      />
    </Card>
  )
}