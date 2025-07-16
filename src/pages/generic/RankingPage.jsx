import { useEffect, useState } from "react";
import { Table, Avatar, Tag, Card, List, Tooltip, Badge, Typography } from "antd";
import { CrownFilled, StarFilled } from "@ant-design/icons";
import BadgesService from "../../services/badgesService";

const { Text } = Typography;

const membershipColors = {
  premium: "gold",
  plus: "blue",
  free: "default",
};

const RankingPage = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      const response = await BadgesService.getRankingBadges();
      setRankingData(response || []);
      setLoading(false);
    };
    fetchRanking();
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "rank",
      key: "rank",
      render: (_, __, idx) => (
        idx === 0 ? <CrownFilled style={{ color: '#fadb14', fontSize: 22 }} /> : idx + 1
      ),
      width: 60,
      align: "center",
    },
    {
      title: "Thành viên",
      dataIndex: "avatar",
      key: "avatar",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={48} src={record.avatar || record.avatar_url} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 13 }}>{record.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Gói",
      dataIndex: ["userId", "membership", "subscriptionType"],
      key: "membership",
      render: (_, record) => {
        const type = record.userId?.membership?.subscriptionType || "free";
        return <Tag color={membershipColors[type] || "default"}>{type.toUpperCase()}</Tag>;
      },
      align: "center",
    },
    {
      title: "Huy hiệu",
      dataIndex: "badges",
      key: "badges",
      render: (badges) => (
        <List
          grid={{ gutter: 4, column: 2 }}
          dataSource={badges}
          renderItem={badge => (
            <Tooltip title={badge.name + ` (+${badge.point_value} điểm)`}>
              <Badge count={<StarFilled style={{ color: '#faad14' }} />} offset={[0, 8]}>
                <Tag color="geekblue" style={{ margin: 2 }}>{badge.name}</Tag>
              </Badge>
            </Tooltip>
          )}
        />
      ),
    },
    {
      title: "Tổng điểm",
      dataIndex: "totalPoints",
      key: "totalPoints",
      render: (points) => <Text strong style={{ color: '#52c41a', fontSize: 18 }}>{points}</Text>,
      align: "center",
    },
    {
      title: "Số huy hiệu",
      dataIndex: "badgeCount",
      key: "badgeCount",
      render: (count) => <Text>{count}</Text>,
      align: "center",
    },
  ];

  return (
    <div className="bg-white" style={{margin: "40px auto", padding: 24, backgroundColor: "#fff" }}>
      <Card bordered={false} style={{ borderRadius: 16, boxShadow: "0 2px 8px #f0f1f2" }}>
        <h2 style={{ textAlign: "center", fontWeight: 700, fontSize: 32, marginBottom: 24 }}>
          <CrownFilled style={{ color: '#fadb14', marginRight: 8 }} />Bảng xếp hạng thành viên
        </h2>
        <Table
          columns={columns}
          dataSource={rankingData}
          rowKey={(_, idx) => idx}
          loading={loading}
          pagination={false}
          bordered
          size="middle"
        />
      </Card>
    </div>
  );
};

export default RankingPage;