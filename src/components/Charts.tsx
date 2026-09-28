import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function CompetencyChart(){
  const data=[{name:"Jun",score:46},{name:"Jul",score:54},{name:"Aug",score:64},{name:"Sep",score:76}];
  return <ResponsiveContainer width="100%" height={260}><LineChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="score" stroke="#0b5cab" strokeWidth={3}/></LineChart></ResponsiveContainer>
}
export function ParticipationChart(){
  const data=[{name:"Forecasting",value:88},{name:"Climate",value:66},{name:"Satellite",value:54},{name:"Ocean",value:47},{name:"Hydrology",value:41}];
  return <ResponsiveContainer width="100%" height={260}><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis/><Tooltip/><Bar dataKey="value" fill="#38a169" radius={[5,5,0,0]}/></BarChart></ResponsiveContainer>
}
export function ProgressChart(){
  const data=[{name:"Week 1",value:18},{name:"Week 2",value:34},{name:"Week 3",value:50},{name:"Week 4",value:72}];
  return <ResponsiveContainer width="100%" height={240}><LineChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="name"/><YAxis domain={[0,100]}/><Tooltip/><Line type="monotone" dataKey="value" stroke="#38a169" strokeWidth={3}/></LineChart></ResponsiveContainer>
}