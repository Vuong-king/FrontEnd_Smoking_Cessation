import React from "react";
import { Modal, Button } from "antd";

export function ConfirmModal({ visible, title, content, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" }) {
  return (
    <Modal
      visible={visible}
      title={<span className="text-lg font-semibold">{title}</span>}
      onOk={onConfirm}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={onConfirm}>
          {confirmText}
        </Button>,
      ]}
    >
      <p>{content}</p>
    </Modal>
  );
}
