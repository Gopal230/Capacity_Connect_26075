export default function MeteorologyContext(){
 const cells=[
  ["🌦️","Weather Forecasting","Synoptic & NWP"],
  ["📡","Doppler Weather Radar","Nowcasting"],
  ["🛰️","Satellite Meteorology","Cloud & imagery"],
  ["🌧️","Monsoon & Hydromet","Rainfall services"],
  ["⚠️","Warnings & Services","Impact communication"]
 ];
 return <div className="meteorology-strip" aria-label="IMD operational domains">
  {cells.map(([i,t,s])=><div className="met-cell" key={t}><div className="met-symbol">{i}</div><div><b>{t}</b><span>{s}</span></div></div>)}
 </div>
}