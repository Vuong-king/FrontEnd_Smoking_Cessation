import React, { useState } from "react";
import OverviewTab from "../../components/user/quitplan/OverviewTab";
import MilestonesTab from "../../components/user/quitplan/MilestonesTab";
import WeeklyPlanTab from "../../components/user/quitplan/WeeklyPlanTab";
import HeaderSection from "../../components/user/quitplan/HeaderSection";
import StatsOverview from "../../components/user/quitplan/StatsOverview";
import TabNavigation from "../../components/user/quitplan/TabNavigation";
import MotivationSection from "../../components/user/quitplan/MotivationSection";
import GoalsTab from "../../components/user/quitplan/GoalsTab";


const QuitPlanPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [completedDays, setCompletedDays] = useState([1, 2, 3, 5, 7]);
  const [customGoals, setCustomGoals] = useState([
    { id: 1, text: "Exercise for 30 minutes daily", completed: false },
    { id: 2, text: "Drink 8 glasses of water", completed: true },
    { id: 3, text: "Practice deep breathing", completed: true },
  ]);
  const [newGoal, setNewGoal] = useState("");

  const quitStats = {
    daysSmokesFree: 14,
    moneySaved: 168,
    cigarettesNotSmoked: 280,
    healthPoints: 85,
  };


  const addCustomGoal = () => {
    if (newGoal.trim()) {
      setCustomGoals([
        ...customGoals,
        {
          id: Date.now(),
          text: newGoal.trim(),
          completed: false,
        },
      ]);
      setNewGoal("");
    }
  };

  const toggleGoal = (id) => {
    setCustomGoals(
      customGoals.map((goal) =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setCustomGoals(customGoals.filter((goal) => goal.id !== id));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab completedDays={completedDays} />;
      case "milestones":
        return <MilestonesTab />;
      case "weekly":
        return <WeeklyPlanTab />;
      case "goals":
        return (
          <GoalsTab
            customGoals={customGoals}
            newGoal={newGoal}
            setNewGoal={setNewGoal}
            addCustomGoal={addCustomGoal}
            toggleGoal={toggleGoal}
            deleteGoal={deleteGoal}
          />
        );
      default:
        return <OverviewTab completedDays={completedDays} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <HeaderSection />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <StatsOverview quitStats={quitStats} />

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {renderTabContent()}
        </div>

        <MotivationSection />
      </div>
    </div>
  );
};

export default QuitPlanPage;
