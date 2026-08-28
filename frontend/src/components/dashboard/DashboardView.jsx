import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  LayoutDashboard,
  ListChecks,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import ErrorState from "../common/ErrorState.jsx";
import LoadingState from "../common/LoadingState.jsx";
import { getDashboard } from "../../services/dashboardService.js";
import { getApiError } from "../../utils/formatters.js";
import DashboardCharts from "./DashboardCharts.jsx";
import RecentIssues from "./RecentIssues.jsx";
import StatCard from "./StatCard.jsx";

const defaultCards = (dashboard, role) => {
  const stats = dashboard?.stats || {};
  const cards = [
    {
      title: role === "developer" ? "Assigned Issues" : "Total Issues",
      value: stats.total,
      accent: "teal",
      icon: ListChecks,
    },
    { title: "Open", value: stats.open, accent: "slate", icon: AlertCircle },
    {
      title: "In Progress",
      value: stats.inProgress,
      accent: "amber",
      icon: Clock3,
    },
    {
      title: "Closed",
      value: stats.closed,
      accent: "indigo",
      icon: CheckCircle2,
    },
    {
      title: "High Priority",
      value: stats.highPriority,
      accent: "rose",
      icon: AlertCircle,
    },
  ];

  if (role === "admin") {
    cards.push(
      {
        title: "Total Users",
        value: dashboard?.totalUsers,
        accent: "slate",
        icon: Users,
      },
      {
        title: "Total Developers",
        value: dashboard?.totalDevelopers,
        accent: "indigo",
        icon: Users,
      },
    );
  }

  return cards;
};

const DashboardView = ({ role, title, subtitle }) => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      setDashboard(await getDashboard(role));
    } catch (apiError) {
      setError(getApiError(apiError, "Unable to load dashboard"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [role]);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboard} />;
  }

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white px-6 py-6 shadow-card">
        <span
          className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-brand-50 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-600">
            <LayoutDashboard size={13} aria-hidden="true" />
            Overview
          </p>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {defaultCards(dashboard, role).map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>
      <DashboardCharts role={role} charts={dashboard?.charts} />
      <RecentIssues issues={dashboard?.recentIssues || []} />
    </div>
  );
};

export default DashboardView;