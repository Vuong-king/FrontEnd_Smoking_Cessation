import React from "react";
import ReactECharts from "echarts-for-react";

export const PieChartCard = ({ title, data, dataKey, nameKey }) => {
  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      right: 10,
      top: "middle",
      textStyle: {
        color: "#fff",
      },
      itemWidth: 14,
      itemHeight: 14,
      formatter: (name) => name,
    },
    series: [
      {
        name: title,
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        center: ["45%", "50%"],
        itemStyle: {
          borderRadius: 10,
          borderColor: "#111827",
          borderWidth: 2,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        label: {
          show: true,
          position: "outside",
          formatter: (params) => `${params.name}: ${params.percent.toFixed(2)}%`,
          color: "#fff",
          overflow: "break",
          width: 100,
          ellipsis: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "16",
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
          length: 25,
          length2: 25,
          smooth: true,
          lineStyle: {
            color: "#999",
          },
        },
        data: data.map((item) => ({
          name: item[nameKey],
          value: item[dataKey],
        })),
      },
    ],
    color: [
      "#38bdf8",
      "#a855f7",
      "#f59e0b",
      "#10b981",
      "#6366f1",
    ],
    backgroundColor: "transparent",
  };

  return (
    <div className="p-0">  {/* or remove this wrapper entirely if already inside a styled card */}

      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="h-64">
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
          theme={"dark"}
        />
      </div>
    </div>
  );
};