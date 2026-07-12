import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const radarData = [
  { subject: 'Financial Stability', A: 120, B: 110, fullMark: 150 },
  { subject: 'Market Growth', A: 98, B: 130, fullMark: 150 },
  { subject: 'Leadership', A: 86, B: 130, fullMark: 150 },
  { subject: 'Tech Stack', A: 99, B: 100, fullMark: 150 },
  { subject: 'Funding', A: 85, B: 90, fullMark: 150 },
  { subject: 'Hiring', A: 65, B: 85, fullMark: 150 },
];

const sparklineData1 = [{ v: 40 }, { v: 45 }, { v: 42 }, { v: 50 }, { v: 55 }, { v: 65 }, { v: 75 }];
const sparklineData2 = [{ v: 100 }, { v: 95 }, { v: 90 }, { v: 80 }, { v: 85 }, { v: 90 }, { v: 110 }];
const sparklineData3 = [{ v: 20 }, { v: 30 }, { v: 45 }, { v: 60 }, { v: 85 }, { v: 95 }, { v: 98 }];

function Dashboard() {
  return (
    <div className="dashboard page-content" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '100%', gap: '25px' }}>
      
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="colorTotal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#00E5FF" stopOpacity={1}/>
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={1}/>
          </linearGradient>
          <linearGradient id="colorHot" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#39FF14" stopOpacity={1}/>
            <stop offset="95%" stopColor="#00E5FF" stopOpacity={1}/>
          </linearGradient>
          <linearGradient id="colorConv" x1="0" y1="0" x2="1" y2="0">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={1}/>
            <stop offset="95%" stopColor="#FF3366" stopOpacity={1}/>
          </linearGradient>
        </defs>
      </svg>

      {/* Dynamic Marquee Header */}
      <div style={{ background: 'rgba(0, 229, 255, 0.05)', borderBottom: '1px solid rgba(0, 229, 255, 0.3)', padding: '8px 20px', display: 'flex', alignItems: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-accent-primary)', fontWeight: '700', whiteSpace: 'nowrap', letterSpacing: '1px', paddingRight: '20px', borderRight: '1px solid rgba(0,229,255,0.3)', zIndex: 2 }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-accent-primary)', boxShadow: '0 0 15px var(--color-accent-primary)', animation: 'pulse 1.5s infinite' }} />
          SYSTEM ONLINE
        </div>
        <div style={{ flexGrow: 1, overflow: 'hidden', position: 'relative', height: '24px', marginLeft: '20px' }}>
          <div style={{ position: 'absolute', display: 'flex', gap: '50px', color: 'var(--color-text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', animation: 'scroll 25s linear infinite', top: '2px' }}>
            <span><strong style={{color: 'var(--color-success)', textShadow: '0 0 10px var(--color-success)'}}>↑ NEW SIGNAL:</strong> Leadership Change at DyneXor</span>
            <span><strong style={{color: 'var(--color-warning)', textShadow: '0 0 10px var(--color-warning)'}}>⚠ WATCH:</strong> Margin compression in Retail Cohort</span>
            <span><strong style={{color: 'var(--color-success)', textShadow: '0 0 10px var(--color-success)'}}>↑ MATCH:</strong> 3 New Look-Alikes found for STEELINVEST</span>
            <span><strong style={{color: 'var(--color-success)', textShadow: '0 0 10px var(--color-success)'}}>↑ NEW SIGNAL:</strong> Leadership Change at DyneXor</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '0 20px' }}>
        {/* Metric Pods with Sparklines */}
        {[ 
          { title: 'Total Prospects', value: '4,892', data: sparklineData1, stroke: 'url(#colorTotal)', textColor: '#00E5FF', shadow: '0 0 15px rgba(0, 229, 255, 0.5)' },
          { title: 'Hot Targets', value: '845', data: sparklineData2, stroke: 'url(#colorHot)', textColor: '#39FF14', shadow: '0 0 15px rgba(57, 255, 20, 0.5)' },
          { title: 'Avg Conversion', value: '18.4%', data: sparklineData3, stroke: 'url(#colorConv)', textColor: '#8B5CF6', shadow: '0 0 15px rgba(139, 92, 246, 0.5)' }
        ].map((metric, i) => (
          <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 25px' }}>
            <div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '5px', fontWeight: '500', letterSpacing: '1px', textTransform: 'uppercase' }}>{metric.title}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: metric.textColor, textShadow: metric.shadow }}>{metric.value}</div>
            </div>
            <div style={{ width: '100px', height: '40px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metric.data}>
                  <Line type="natural" dataKey="v" stroke={metric.stroke} strokeWidth={3} dot={false} style={{ filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.5))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', padding: '0 25px', flexGrow: 1, minHeight: '450px', marginBottom: '25px' }}>
        {/* Core Visualization */}
        <div className="card" style={{ background: 'radial-gradient(circle at center, rgba(0,229,255,0.08) 0%, rgba(1,5,11,0.9) 70%)', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          <h3 className="card-title" style={{ zIndex: 1, color: '#fff', textShadow: '0 0 15px rgba(255,255,255,0.3)' }}>TCI Global Radar Overview</h3>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'url(/grid.svg)', opacity: 0.1, pointerEvents: 'none' }} />
          <div style={{ flexGrow: 1, zIndex: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(0,229,255,0.3)" strokeWidth={1} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-primary)', fontSize: 13, fontWeight: '500' }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(1,5,11,0.9)', border: '1px solid var(--color-accent-primary)', backdropFilter: 'blur(10px)', borderRadius: '8px', color: '#fff' }} />
                <Radar name="Active Cohort" dataKey="A" stroke="url(#colorTotal)" strokeWidth={3} fill="url(#colorTotal)" fillOpacity={0.25} />
                <Radar name="Historical Baseline" dataKey="B" stroke="var(--color-text-secondary)" strokeWidth={2} fill="var(--color-text-secondary)" fillOpacity={0.05} strokeDasharray="3 3" />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Action Queue */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span> Priority Action Queue
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', flexGrow: 1, overflowY: 'auto', paddingRight: '5px' }}>
            
            <div style={{ background: 'rgba(0,255,0,0.05)', borderLeft: '3px solid var(--color-success)', padding: '12px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Review MD COMPANY</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Just now</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>AI detected 3 new soft signals indicating expansion.</p>
              <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>Execute</button>
            </div>

            <div style={{ background: 'rgba(0,229,255,0.05)', borderLeft: '3px solid var(--color-accent-primary)', padding: '12px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Approve Spin-Off Persona</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>2 hrs ago</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Engine generated 400 look-alikes. Awaiting compliance review.</p>
              <button className="btn" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>Review</button>
            </div>

            <div style={{ background: 'rgba(255,165,0,0.05)', borderLeft: '3px solid var(--color-warning)', padding: '12px', borderRadius: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <strong style={{ color: 'var(--color-text-primary)' }}>Renew Finstat API</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>1 day ago</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>Quota is at 95%. Automated scraping will pause soon.</p>
              <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>Manage Data</button>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 229, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
