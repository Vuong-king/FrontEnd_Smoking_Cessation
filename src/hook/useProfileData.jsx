import { useState } from "react";
import { Form, message } from "antd";
import { Trophy, Coins, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { editUserProfile } from "../api";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export function useProfileData() {
  const { user, setUser } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null); // State for preview

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
    setAvatarPreviewUrl(null); // Reset preview state
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
    });
    setIsEditModalVisible(true);
  };

  const handleSaveProfile = async (values) => {
    try {
      const profileData = {
        name: values.name,
        email: values.email,
        avatar_url: values.avatar_url,
      };

      console.log("Dữ liệu gửi đi:", profileData);
      const response = await editUserProfile(user._id, profileData);

      if (response) {
        const updatedUser = response.user ? { ...user, ...response.user } : { ...user, ...profileData };
        setUser(updatedUser);

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

  // Refactored: Uploads image but does NOT call API. Only updates form state.
  const handleAvatarUpload = async (file) => {
    if (!file) {
      message.error("Vui lòng chọn một tệp ảnh.");
      return;
    }

    const imageRef = ref(storage, `avatars/${uuidv4()}_${file.name}`);
    
    try {
      message.loading({ content: 'Đang xử lý ảnh...', key: 'upload' });

      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      form.setFieldsValue({ avatar_url: downloadURL });
      setAvatarPreviewUrl(downloadURL);

      message.success({ content: 'Ảnh đã sẵn sàng. Nhấn "Lưu thay đổi" để hoàn tất.', key: 'upload', duration: 4 });

    } catch (error) {
      message.error({ content: 'Lỗi khi tải ảnh lên!', key: 'upload' });
      console.error("Error uploading avatar:", error);
    }
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
    setAvatarPreviewUrl(null); // Reset preview state
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
    avatarPreviewUrl, // Return the preview URL state
  };
}
