import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmptyState from "../common/EmptyState.jsx";

const chartColors = [
  "#0d9488",
  "#f59e0b",
  "#16a34a",
  "#e11d48",
  "#6366f1",
  "#0891b2",
];
const statusColors = {
  OPEN: "#0d9488",
  IN_PROGRESS: "#f59e0b",
  CLOSED: "#16a34a",
};
const priorityColors = { HIGH: "#e11d48", MEDIUM: "#f59e0b", LOW: "#0d9488" };

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-lg">
      <p className="font-semibold text-slate-900">{label}</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="mt-1 text-slate-600">
          {item.name || item.dataKey}:{" "}
          <span className="font-semibold text-slate-900">{item.value}</span>
        </p>
      ))}
    </div>
  );
};

const ChartPanel = ({ title, description, children }) => (
  <section className="panel min-w-0 p-5 transition duration-300 hover:shadow-lift">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <span className="hidden h-2 w-2 shrink-0 rounded-full bg-brand-500 sm:block" aria-hidden="true" />
    </div>
    {children}
  </section>
);

const EmptyChart = ({ title }) => (
  <div className="flex h-64 items-center justify-center">
    <EmptyState
      title={title}
      description="Chart data will appear when issues are available."
    />
  </div>
);

const StatusChart = ({ data }) => {
  const hasData = data?.some((item) => item.count > 0);

  return (
    <ChartPanel
      title="Issue status"
      description="Where your current issue workload stands."
    >
      {hasData ? (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
              >
                {data.map((item) => (
                  <Cell
                    key={item.name}
                    fill={statusColors[item.name] || "#64748b"}
                  />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend formatter={(value) => value.replace("_", " ")} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyChart title="No issue status data" />
      )}
    </ChartPanel>
  );
};

const PriorityChart = ({ data }) => (
  <ChartPanel
    title="Priority mix"
    description="How urgent the issues in this view are."
  >
    {data?.some((item) => item.count > 0) ? (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" name="Issues" radius={[4, 4, 0, 0]}>
              {data.map((item) => (
                <Cell
                  key={item.name}
                  fill={priorityColors[item.name] || "#0d9488"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyChart title="No priority data" />
    )}
  </ChartPanel>
);

const CategoryChart = ({ data }) => (
  <ChartPanel
    title="Issues by category"
    description="What types of problems are being reported."
  >
    {data?.length ? (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius="52%"
              outerRadius="80%"
              paddingAngle={3}
            >
              {data.map((item, index) => (
                <Cell
                  key={item.name}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyChart title="No category data" />
    )}
  </ChartPanel>
);

const DeveloperChart = ({ data }) => (
  <ChartPanel
    title="Developer workload"
    description="Assigned work across active developers."
  >
    {data?.length ? (
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 12, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={90}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar
              dataKey="assigned"
              name="Assigned"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    ) : (
      <EmptyChart title="No assigned issues" />
    )}
  </ChartPanel>
);

const DashboardCharts = ({ role, charts }) => {
  if (!charts) {
    return null;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <StatusChart data={charts.status || []} />
      {role === "admin" ? (
        <CategoryChart data={charts.categories || []} />
      ) : (
        <PriorityChart data={charts.priorities || []} />
      )}
      {role === "admin" ? (
        <PriorityChart data={charts.priorities || []} />
      ) : null}
      {role === "admin" ? (
        <DeveloperChart data={charts.developers || []} />
      ) : null}
    </div>
  );
};

export default DashboardCharts;
