import React, { useState } from 'react';
import { Table, Button, Space, Card, Typography, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import QuitPlanFormModal from './QuitPlanModal';


const { Title } = Typography;

const QuitPlanTable = () => {
  const [plans, setPlans] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const showAddModal = () => {
    setEditingRecord(null);
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    const newPlans = plans.filter(plan => plan.key !== key);
    setPlans(newPlans);
    message.success('Đã xóa kế hoạch');
  };

  const handleSubmit = (plan) => {
    if (editingRecord) {
      const updated = plans.map(p =>
        p.key === editingRecord.key ? { ...p, ...plan } : p
      );
      setPlans(updated);
      message.success('Cập nhật thành công');
    } else {
      const newPlan = { ...plan, key: Date.now().toString() };
      setPlans([...plans, newPlan]);
      message.success('Thêm kế hoạch thành công');
    }

    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên kế hoạch',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'start_date',
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'target_quit_date',
      key: 'target_quit_date',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },

    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn xóa?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ margin: 20 }}>
      <Title level={3}>Quản lý kế hoạch cai thuốc</Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={showAddModal}
        style={{ marginBottom: 16 }}
      >
        Thêm kế hoạch
      </Button>

      <Table
        columns={columns}
        dataSource={plans}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      <QuitPlanFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleSubmit}
        editingRecord={editingRecord}
      />
    </Card>
  );
};

export default QuitPlanTable;
