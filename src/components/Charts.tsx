import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const tooltipStyle = {
  backgroundColor: "#FFFFFF",
  borderColor: "#E5DCC5",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 48, 73, 0.12)",
  color: "#003049",
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
        <CartesianGrid stroke="#E5DCC5" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <YAxis domain={[0, 100]} stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="score" stroke="#C1121F" strokeWidth={3} dot={{ fill: "#C1121F", r: 4 }} activeDot={{ r: 6, fill: "#780000" }} />
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
        <CartesianGrid stroke="#E5DCC5" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <YAxis stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill="#003049" radius={[6, 6, 0, 0]} />
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
        <CartesianGrid stroke="#E5DCC5" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <YAxis domain={[0, 100]} stroke="#5C768D" fontSize={12} tickLine={false} axisLine={{ stroke: "#E5DCC5" }} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="value" stroke="#669BBC" strokeWidth={3} dot={{ fill: "#669BBC", r: 4 }} activeDot={{ r: 6, fill: "#003049" }} />
      </LineChart>
    </ResponsiveContainer>
  );
}