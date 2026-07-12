import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Funnel, FunnelChart, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { getProspects, updateProspectStage } from '../services/db';
import ProspectDrawer from './ProspectDrawer';

const PIPELINE_STAGES = [
  'New', 'Researched', 'Contacted', 'Meeting', 'Interested', 'Offer Sent', 'Signed', 'Declined'
];

function Pipeline() {
  const [prospects, setProspects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [selectedProspect, setSelectedProspect] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getProspects();
      setProspects(data || []);
    };
    load();
  }, []);

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    // Optimistic UI Update
    const updatedProspects = Array.from(prospects);
    const movedProspect = updatedProspects.find(p => p.id === draggableId);
    if (movedProspect) {
      movedProspect.status = destination.droppableId;
      setProspects(updatedProspects);
      
      // Async DB Update
      await updateProspectStage(draggableId, destination.droppableId);
    }
  };

  const getFilteredProspects = () => {
    if (!searchQuery) return prospects;
    const lowerQ = searchQuery.toLowerCase();
    return prospects.filter(p => 
      (p.companyName || p.name)?.toLowerCase().includes(lowerQ) ||
      p.industry?.toLowerCase().includes(lowerQ) ||
      p.status?.toLowerCase().includes(lowerQ)
    );
  };

  const getProspectsByStage = (stage) => {
    return getFilteredProspects().filter(p => (p.status === stage) || (stage === 'New' && !p.status));
  };

  const funnelData = PIPELINE_STAGES.map(stage => ({
    name: stage,
    value: getProspectsByStage(stage).length,
    fill: stage === 'Signed' ? '#00FF99' : stage === 'Declined' ? '#FF3366' : '#00FFFF'
  })).filter(s => s.value > 0);

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Top Header & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="header-title" style={{ margin: 0 }}>Outreach Pipeline</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Semantic Search (Name, Industry, Stage)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '350px', background: 'rgba(0,255,255,0.05)', borderColor: 'var(--color-accent-primary)' }}
          />
          <button className={`btn ${viewMode === 'kanban' ? '' : 'btn-secondary'}`} onClick={() => setViewMode('kanban')}>Kanban</button>
          <button className={`btn ${viewMode === 'list' ? '' : 'btn-secondary'}`} onClick={() => setViewMode('list')}>List</button>
        </div>
      </div>

      {/* Funnel Visual (Top) */}
      <div className="card" style={{ marginBottom: '20px', padding: '15px', display: 'flex', height: '220px', background: 'radial-gradient(circle at top, rgba(0,229,255,0.1), transparent)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '20px' }}>
          <h3 style={{ color: 'var(--color-text-primary)', margin: '0 0 10px 0' }}>Pipeline Conversion Metrics</h3>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>Total Active: {getFilteredProspects().length}</div>
          <div style={{ color: 'var(--color-success)', fontSize: '0.9rem', marginBottom: '5px' }}>Total Signed: {getProspectsByStage('Signed').length}</div>
        </div>
        <div style={{ flex: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip contentStyle={{ background: '#000', border: '1px solid #00FFFF' }} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="#FFF" stroke="none" dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', flexGrow: 1, paddingBottom: '20px' }}>
            {PIPELINE_STAGES.map(stage => (
              <Droppable key={stage} droppableId={stage}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minWidth: '280px', width: '280px', background: snapshot.isDraggingOver ? 'rgba(0, 255, 255, 0.1)' : 'var(--glass-bg)', borderRadius: 'var(--border-radius)', padding: '15px', border: 'var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '15px', color: 'var(--color-accent-primary)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {stage} <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>({getProspectsByStage(stage).length})</span>
                    </h3>
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                      {getProspectsByStage(stage).map((prospect, index) => (
                        <Draggable key={prospect.id} draggableId={prospect.id} index={index}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} onClick={() => setSelectedProspect(prospect)}
                              style={{ padding: '15px', marginBottom: '10px', background: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px', border: snapshot.isDragging ? '1px solid var(--color-accent-primary)' : '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', ...provided.draggableProps.style }}>
                              <div style={{ fontWeight: '600', marginBottom: '5px' }}>{prospect.companyName || prospect.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{prospect.industry} • ${prospect.annualRevenue || prospect.turnover}M</div>
                              <div style={{ fontSize: '0.75rem', background: 'rgba(0, 255, 255, 0.1)', color: 'var(--color-accent-primary)', padding: '3px 6px', borderRadius: '4px', display: 'inline-block' }}>
                                AI Score: {prospect.aiScore || prospect.matchScore}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      ) : (
        <div className="card" style={{ flexGrow: 1, overflowY: 'auto', padding: 0 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead style={{ position: 'sticky', top: 0, background: 'rgba(2,22,58,0.9)', backdropFilter: 'blur(10px)', zIndex: 1 }}>
              <tr style={{ borderBottom: '1px solid var(--color-accent-primary)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '15px 20px' }}>Company</th>
                <th style={{ padding: '15px' }}>Industry</th>
                <th style={{ padding: '15px' }}>Revenue</th>
                <th style={{ padding: '15px' }}>AI Score</th>
                <th style={{ padding: '15px' }}>Stage</th>
                <th style={{ padding: '15px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredProspects().map((p, i) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }} onClick={() => setSelectedProspect(p)}>
                  <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>{p.companyName || p.name}</td>
                  <td style={{ padding: '15px' }}>{p.industry}</td>
                  <td style={{ padding: '15px' }}>${p.annualRevenue || p.turnover}M</td>
                  <td style={{ padding: '15px', color: 'var(--color-accent-primary)', fontWeight: 'bold' }}>{p.aiScore || p.matchScore}</td>
                  <td style={{ padding: '15px' }}>
                    <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem' }}>{p.status || 'New'}</span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Open Drawer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProspectDrawer prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />
    </div>
  );
}

export default Pipeline;
