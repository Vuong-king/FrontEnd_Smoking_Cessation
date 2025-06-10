
import { Card, Row, Col, Statistic, Space } from "antd"
import { DollarSign, Calendar, TrendingUp } from "lucide-react"

export default function StatisticsCards({ stats }) {
  return (
    <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
      <Col xs={24} sm={8}>
        <Card hoverable>
          <Statistic
            title={
              <Space>
                <DollarSign size={16} style={{ color: "#f5222d" }} />
                Total Cost
              </Space>
            }
            value={stats.totalCost}
            precision={0}
            valueStyle={{ color: "#f5222d", fontSize: "24px" }}
            suffix="VNĐ"
            formatter={(value) => value.toLocaleString("vi-VN")}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            Total money spent on cigarettes
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card hoverable>
          <Statistic
            title={
              <Space>
                <Calendar size={16} style={{ color: "#1890ff" }} />
                Total Days
              </Space>
            }
            value={stats.totalDays}
            valueStyle={{ color: "#1890ff", fontSize: "24px" }}
            suffix="days"
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            Total smoking duration
          </div>
        </Card>
      </Col>
      
      <Col xs={24} sm={8}>
        <Card hoverable>
          <Statistic
            title={
              <Space>
                <TrendingUp size={16} style={{ color: "#fa8c16" }} />
                Total Cigarettes
              </Space>
            }
            value={stats.totalCigarettes}
            valueStyle={{ color: "#fa8c16", fontSize: "24px" }}
            suffix="cigs"
            formatter={(value) => value.toLocaleString("vi-VN")}
          />
          <div style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
            Total cigarettes smoked
          </div>
        </Card>
      </Col>
    </Row>
  )
}