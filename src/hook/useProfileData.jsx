import { useState } from "react"
import { Form } from "antd"
import { Trophy, Coins, Heart } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export function useProfileData() {
  const {user} = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [form] = Form.useForm()

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
  ]

  const handleEditProfile = () => {
    form.setFieldsValue({
      name: user.name,
      username: user.name.replace("@", ""),
      email: user.email,
    })
    setIsEditModalVisible(true)
  }

//   const handleSaveProfile = (values) => {
//     setUser((prev) => ({
//       ...prev,
//       name: values.name,
//       username: `@${values.name}`,
//       email: values.email,
//     }))
//     setIsEditModalVisible(false)
//     message.success("Cập nhật hồ sơ thành công!")
//   }

  const handleCancel = () => {
    setIsEditModalVisible(false)
    form.resetFields()
  }

  return {
    user,
    achievements,
    isEditModalVisible,
    form,
    handleEditProfile,
    // handleSaveProfile,
    handleCancel,
  }
}