import { useState } from "react";
import { Form, message } from "antd";
import { Trophy, Coins, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { editUserProfile } from "../api";

export function useProfileData() {
  const { user, setUser } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const achievements = [
    {
      id: 1,
      title: "1 tháng không hút thuốc",
      icon: Trophy,
      color: "#1890ff",
      bgColor: "#e6f7ff",
      completed: true,
    },
    {
      id: 2,
      title: "Tiết kiệm 5 triệu",
      icon: Coins,
      color: "#52c41a",
      bgColor: "#f6ffed",
      completed: true,
    },
    {
      id: 3,
      title: "Sức khỏe cải thiện",
      icon: Heart,
      color: "#f5222d",
      bgColor: "#fff2f0",
      completed: true,
    },
  ];

  const handleEditProfile = () => {
    form.setFieldsValue({
      avatar_url: user.avatar_url,
      name: user.name,
      email: user.email,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async (values) => {
    try {
      const profileData = {
        avatar_url: values.avatar,
        name: values.name,
        email: values.email,
      };

      console.log("Dữ liệu gửi đi:", profileData);
      const response = await editUserProfile(user.id, profileData);

      if (response) {
        setUser({
          ...user,
          avatar_url: values.avatar,
          name: values.name,
          email: values.email,
        });

        setIsEditModalVisible(false);
        message.success("Cập nhật hồ sơ thành công!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật hồ sơ!";
      message.error(errorMessage);
      console.error("Lỗi cập nhật:", error);
    }
  };

  // Cập nhật hàm handleAvatarUpload
  const handleAvatarUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await editUserProfile(user.id, formData);


      setUser({
        ...user,
        avatar_url: response.avatar_url, 
      });

      message.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật ảnh đại diện!");
      console.error("Error uploading avatar:", error);
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  return {
    user,
    achievements,
    isEditModalVisible,
    form,
    handleEditProfile,
    handleSaveProfile,
    handleCancel,
    handleAvatarUpload,
  };
}
