import React from 'react';
import { Modal, Form, Input, DatePicker, Button, Space } from 'antd';
import dayjs from 'dayjs';

const QuitPlanFormModal = ({ visible, onCancel, onSubmit, editingRecord }) => {
  const [form] = Form.useForm();

  // Nếu đang chỉnh sửa thì set giá trị ban đầu
  React.useEffect(() => {
    if (editingRecord) {
      form.setFieldsValue({
        ...editingRecord,
        start_date: dayjs(editingRecord.start_date),
        target_quit_date: dayjs(editingRecord.target_quit_date),
      });
    } else {
      form.resetFields();
    }
  }, [editingRecord, form]);

  const handleFinish = (values) => {
    const formatted = {
      ...values,
      start_date: values.start_date.format('YYYY-MM-DD'),
      target_quit_date: values.target_quit_date.format('YYYY-MM-DD'),
    };
    onSubmit(formatted);
    form.resetFields();
  };

  return (
    <Modal
      title={editingRecord ? 'Chỉnh sửa kế hoạch' : 'Thêm mới kế hoạch'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên kế hoạch"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên kế hoạch' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Ngày két thúc"
          name="target_quit_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày mục tiêu' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Lý do"
          name="reason"
          rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>


        <Form.Item style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              {editingRecord ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuitPlanFormModal;
