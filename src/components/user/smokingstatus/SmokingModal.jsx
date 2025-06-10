
import { useEffect } from "react"
import { Modal, Form, Input, Select, Button, Space, Typography, DatePicker } from "antd"
import { Plus, Cigarette, DollarSign, Calendar, BarChart3 } from "lucide-react"
import dayjs from "dayjs"

const { Paragraph } = Typography
const { Option } = Select

export default function SmokingModal({ visible, editingRecord, onSubmit, onCancel }) {
  const [form] = Form.useForm()

  useEffect(() => {
    if (visible && editingRecord) {
      form.setFieldsValue({
        frequency: editingRecord.frequency,
        cigarettes_per_day: editingRecord.cigarettes_per_day,
        cost_per_pack: editingRecord.cost_per_pack,
        start_date: dayjs(editingRecord.start_date),
      })
    } else if (visible) {
      form.resetFields()
    }
  }, [visible, editingRecord, form])

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  const handleSubmit = (values) => {
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Modal
      title={
        <Space>
          <Cigarette size={20} style={{ color: "#1890ff" }} />
          {editingRecord ? "Update Information" : "Add Smoking Information"}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Paragraph style={{ color: "#666", marginBottom: "24px" }}>
        Fill in detailed information about your smoking habits
      </Paragraph>

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item
          label={
            <Space>
              <BarChart3 size={14} />
              Smoking frequency
            </Space>
          }
          name="frequency"
          rules={[{ required: true, message: "Please select smoking frequency!" }]}
        >
          <Select placeholder="Select frequency" size="large">
            <Option value="daily">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#f5222d" 
                }}></div>
                Daily
              </Space>
            </Option>
            <Option value="weekly">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#fa8c16" 
                }}></div>
                Weekly
              </Space>
            </Option>
            <Option value="occasionally">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#fadb14" 
                }}></div>
                Occasionally
              </Space>
            </Option>
            <Option value="social">
              <Space>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: "#52c41a" 
                }}></div>
                Social only
              </Space>
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <Cigarette size={14} />
              Cigarettes per day
            </Space>
          }
          name="cigarettes_per_day"
          rules={[
            { required: true, message: "Please enter cigarettes per day!" },
            { type: "number", min: 1, message: "Must be at least 1!" },
          ]}
        >
          <Input
            type="number"
            placeholder="e.g: 10"
            size="large"
            min={1}
            prefix={<Cigarette size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <DollarSign size={14} />
              Cost per pack (VND)
            </Space>
          }
          name="cost_per_pack"
          rules={[
            { required: true, message: "Please enter cost per pack!" },
            { type: "number", min: 0, message: "Must be a positive number!" },
          ]}
        >
          <Input
            type="number"
            placeholder="e.g: 25000"
            size="large"
            min={0}
            step={1000}
            prefix={<DollarSign size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item
          label={
            <Space>
              <Calendar size={14} />
              Start date
            </Space>
          }
          name="start_date"
          rules={[{ required: true, message: "Please select start date!" }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
            placeholder="Select start date"
            suffixIcon={<Calendar size={14} style={{ color: "#d9d9d9" }} />}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: "24px" }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<Plus size={14} />}>
              {editingRecord ? "Update" : "Add New"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}