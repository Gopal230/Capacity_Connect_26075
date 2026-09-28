import { ReactNode, useState } from "react";
import { AlertCircle, CheckCircle2, Search, X } from "lucide-react";

export function PageHeader({title,subtitle,actions}:{title:string;subtitle?:string;actions?:ReactNode}){
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function StatCard({label,value,caption,icon}:{label:string;value:string|number;caption?:string;icon?:ReactNode}){
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {caption && <small>{caption}</small>}
      </div>
    </div>
  );
}

export function Badge({children,tone="blue"}:{children:ReactNode;tone?:"blue"|"green"|"amber"|"red"|"gray"}){
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function ProgressBar({value}:{value:number}){
  const clamped = Math.max(0, Math.min(value, 100));
  return (
    <div className="progress" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-fill" style={{width:`${clamped}%`}} />
    </div>
  );
}

export function SearchBox({value,onChange,placeholder="Search courses, skills, personnel..."}:{value:string;onChange:(v:string)=>void;placeholder?:string}){
  return (
    <label className="search-box">
      <Search size={16} />
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

export function ConfirmButton({label,confirmText,onConfirm,className="btn btn-primary"}:{label:string;confirmText:string;onConfirm:()=>void;className?:string}){
  const [open,setOpen]=useState(false);
  return (
    <>
      <button className={className} onClick={()=>setOpen(true)}>{label}</button>
      {open && (
        <div className="modal-backdrop" onMouseDown={()=>setOpen(false)}>
          <div className="modal-card" onMouseDown={e=>e.stopPropagation()}>
            <div className="modal-icon"><AlertCircle size={22} /></div>
            <h3>Confirm Action</h3>
            <p>{confirmText}</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{onConfirm();setOpen(false)}}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function EmptyState({title,body}:{title:string;body:string}){
  return (
    <div className="empty-state">
      <CheckCircle2 size={32} />
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  );
}

export function Drawer({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="drawer" onMouseDown={e=>e.stopPropagation()}>
        <div className="drawer-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close drawer"><X size={20}/></button>
        </div>
        <div className="drawer-body">{children}</div>
      </aside>
    </div>
  );
}