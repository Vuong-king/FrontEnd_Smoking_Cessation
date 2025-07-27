import { useEffect, useState } from "react";
import { Avatar, Card, Typography, Spin } from "antd";
import { CrownFilled, TrophyOutlined, FireOutlined, DollarOutlined, StarOutlined } from "@ant-design/icons";
import BadgesService from "../../services/badgesService";

const { Text, Title } = Typography;

// Hàm chuyển đổi dữ liệu cho từng bảng
const mapRankingData = (data, type) => {
  return (data || []).map((item, idx) => ({
    key: item.user?._id || idx,
    rank: idx + 1,
    avatar: item.user?.avatar_url,
    name: item.user?.name,
    email: item.user?.email || "",
    badges: item.badges || [],
    badgeCount: type === "badge_count" ? item.score : item.badgeCount || item.badges?.length || 0,
    totalPoints: type === "points" ? item.score : undefined,
    noSmokeDays: type === "no_smoke_days" ? item.score : undefined,
    moneySaved: type === "money_saved" ? item.score : undefined,
    score: item.score,
  }));
};

// Component cho từng item trong ranking
const RankingItem = ({ item, type, maxScore }) => {
  const getIcon = () => {
    switch (type) {
      case "points":
        return <FireOutlined className="text-orange-500" />;
      case "no_smoke_days":
        return <TrophyOutlined className="text-blue-500" />;
      case "money_saved":
        return <DollarOutlined className="text-green-500" />;
      case "badge_count":
        return <StarOutlined className="text-yellow-500" />;
      default:
        return <FireOutlined className="text-orange-500" />;
    }
  };

  const getValue = () => {
    switch (type) {
      case "points":
        return item.totalPoints;
      case "no_smoke_days":
        return item.noSmokeDays;
      case "money_saved":
        return item.moneySaved;
      case "badge_count":
        return item.badgeCount;
      default:
        return item.score;
    }
  };

  const getValueDisplay = (value) => {
    switch (type) {
      case "money_saved":
        return `${value?.toLocaleString()} đ`;
      default:
        return value;
    }
  };

  const getBarColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-gray-300 to-gray-500";
    if (rank === 3) return "from-orange-400 to-orange-600";
    return "from-blue-400 to-purple-600";
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <CrownFilled className="text-yellow-500 text-xl" />;
    if (rank === 2) return <span className="text-gray-500 text-xl font-bold">🥈</span>;
    if (rank === 3) return <span className="text-orange-500 text-xl font-bold">🥉</span>;
    return <span className="text-gray-400 font-bold">{rank}</span>;
  };

  const value = getValue();
  const percentage = maxScore > 0 ? (value / maxScore) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-4 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
            {getRankIcon(item.rank)}
          </div>
          <div className="flex items-center space-x-3">
            <Avatar size={48} src={item.avatar} />
            <div>
              <div className="font-semibold text-gray-800 text-lg">{item.name}</div>
              {item.email && <Text type="secondary" className="text-sm">{item.email}</Text>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2">
            {getIcon()}
            <span className="text-2xl font-bold text-gray-800">
              {getValueDisplay(value)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full bg-gradient-to-r ${getBarColor(item.rank)} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="absolute -top-8 right-0 text-xs text-gray-500">
          {percentage.toFixed(1)}%
        </div>
      </div>
    </div>
  );
};

// Component cho từng category
const RankingCategory = ({ title, data, type, icon, color, loading }) => {
  const maxScore = data.length > 0 ? Math.max(...data.map(item => {
    switch (type) {
      case "points":
        return item.totalPoints || 0;
      case "no_smoke_days":
        return item.noSmokeDays || 0;
      case "money_saved":
        return item.moneySaved || 0;
      case "badge_count":
        return item.badgeCount || 0;
      default:
        return item.score || 0;
    }
  })) : 0;

  return (
    <Card 
      bordered={false} 
      className="mb-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ borderRadius: 16 }}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
          <span className="text-2xl text-white">{icon}</span>
        </div>
        <Title level={2} className="mb-2" style={{ color }}>
          {title}
        </Title>
      </div>

      <Spin spinning={loading}>
        <div className="space-y-4">
          {data.slice(0, 10).map((item) => (
            <RankingItem 
              key={item.key} 
              item={item} 
              type={type} 
              maxScore={maxScore}
            />
          ))}
        </div>
        
        {data.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-lg">Chưa có dữ liệu xếp hạng</p>
          </div>
        )}
      </Spin>
    </Card>
  );
};

const RankingPage = () => {
  const [pointsRanking, setPointsRanking] = useState([]);
  const [noSmokeDaysRanking, setNoSmokeDaysRanking] = useState([]);
  const [moneySavedRanking, setMoneySavedRanking] = useState([]);
  const [badgeCountRanking, setBadgeCountRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        const [response, response2, response3, response4] = await Promise.all([
          BadgesService.getRankingBadges("points"),
          BadgesService.getRankingBadges("no_smoke_days"),
          BadgesService.getRankingBadges("money_saved"),
          BadgesService.getRankingBadges("badge_count"),
        ]);
        
        setPointsRanking(mapRankingData(response, "points"));
        setNoSmokeDaysRanking(mapRankingData(response2, "no_smoke_days"));
        setMoneySavedRanking(mapRankingData(response3, "money_saved"));
        setBadgeCountRanking(mapRankingData(response4, "badge_count"));
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <CrownFilled className="text-3xl text-white" />
          </div>
          <Title level={1} className="mb-4">
            Bảng Xếp Hạng
          </Title>
          <Text className="text-lg text-gray-600">
            Theo dõi thành tích và tiến độ cai thuốc của cộng đồng
          </Text>
        </div>

        <RankingCategory
          title="Tổng Điểm"
          data={pointsRanking}
          type="points"
          icon="🔥"
          color="#f97316"
          loading={loading}
        />

        <RankingCategory
          title="Số Ngày Không Hút Thuốc"
          data={noSmokeDaysRanking}
          type="no_smoke_days"
          icon="🏆"
          color="#3b82f6"
          loading={loading}
        />

        <RankingCategory
          title="Số Tiền Tiết Kiệm"
          data={moneySavedRanking}
          type="money_saved"
          icon="💰"
          color="#10b981"
          loading={loading}
        />

        <RankingCategory
          title="Số Huy Hiệu"
          data={badgeCountRanking}
          type="badge_count"
          icon="⭐"
          color="#f59e0b"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default RankingPage;