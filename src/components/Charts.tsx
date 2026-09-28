import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "#E2E8F0",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  color: "#0F172A",
  fontSize: "12px",
  fontWeight: 600,
};

export function CompetencyChart(){
  const data = [
    { name: "Jun", score: 46 },
    { name: "Jul", score: 54 },
    { name: "Aug", score: 64 },
    { name: "Sep", score: 76 }
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="score" stroke="#0056D2" strokeWidth={3} dot={{ fill: "#0056D2", r: 4 }} activeDot={{ r: 6, fill: "#00419E" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ParticipationChart(){
  const data = [
    { name: "Forecasting", value: 88 },
    { name: "Climate", value: 66 },
    { name: "Satellite", value: 54 },
    { name: "Ocean", value: 47 },
    { name: "Hydrology", value: 41 }
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill="#0056D2" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProgressChart(){
  const data = [
    { name: "Week 1", value: 18 },
    { name: "Week 2", value: 34 },
    { name: "Week 3", value: 50 },
    { name: "Week 4", value: 72 }
  ];
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6, fill: "#0056D2" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}