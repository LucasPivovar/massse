import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Brand tokens ─────────────────────────────────────────────────── */
const B = {
  lime:      '#A855F7',
  limeAlpha: 'rgba(168, 85, 247,', 
  green:     '#7E22CE',
  text:      '#E5E5E5',
  muted:     '#9CA3AF',
  subtle:    '#6B7280',
  card:      'var(--bg-card)',
  border:    'rgba(168, 85, 247,0.09)',
  borderHov: 'rgba(168, 85, 247,0.24)',
};

function svgY(val, mn, mx, h = 120) {
  if (mx === mn) return h / 2;
  return h - ((val - mn) / (mx - mn)) * h;
}

/* ─── Shared Card ──────────────────────────────────────────────────── */
const Card = ({ children, style, hoverable, className }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      className={className || "card-gradient"}
      onMouseEnter={hoverable ? () => setHov(true)  : undefined}
      onMouseLeave={hoverable ? () => setHov(false) : undefined}
      style={{
        borderRadius: '14px',
        transition: 'border-color 0.22s ease, transform 0.22s ease, box-shadow 0.22s ease',
        transform: 'translateY(0)',
        boxShadow: 'var(--shadow-sm)',
        borderColor: hov ? B.borderHov : B.border,
        willChange: 'transform',
        ...style,
      }}>
      {children}
    </div>
  );
};

/* ─── Line Chart ───────────────────────────────────────────────────── */
const LineChart = ({ data }) => {
  const [hov, setHov] = useState(null);
  const chartId = React.useMemo(() => `chart-reveal-${Math.random().toString(36).substr(2, 9)}`, []);
  
  const chartData = (data && data.length > 0) ? data : [
    { label: '08:00', value: 0 },
    { label: '10:00', value: 0 },
    { label: '12:00', value: 0 },
    { label: '14:00', value: 0 },
    { label: '16:00', value: 0 },
    { label: '18:00', value: 0 },
    { label: '20:00', value: 0 }
  ];
  
  const vals = chartData.map(d => d.value);
  const mn   = Math.min(...vals) * 0.82;
  const mx   = Math.max(...vals) * 1.08 || 10;
  
  const pts  = chartData.map((d, i) => {
    const step = chartData.length > 1 ? 500 / (chartData.length - 1) : 500;
    const x = i * step;
    return { ...d, x, y: svgY(d.value, mn, mx) };
  });
  
  const line = pts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length-1].x} 120 L ${pts[0].x} 120 Z`;

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <svg viewBox="0 0 500 148" width="100%" style={{ overflow:'visible', display:'block', maxHeight: '350px' }}>
        <defs>
          <linearGradient id="lc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={B.lime}  />
            <stop offset="100%" stopColor={B.green} />
          </linearGradient>
          <linearGradient id="lc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={B.lime} stopOpacity="0.18" />
            <stop offset="100%" stopColor={B.lime} stopOpacity="0" />
          </linearGradient>
          <clipPath id={chartId}>
            <rect x="0" y="0" width="500" height="150">
              <animate attributeName="width" from="0" to="500" dur="3.0s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" />
            </rect>
          </clipPath>
        </defs>
        
        {/* Background grids */}
        {[20,50,80,110].map(y => (
          <line key={y} x1="0" y1={y} x2="500" y2={y}
            stroke="rgba(168, 85, 247,0.05)" strokeWidth="1" strokeDasharray="4 6" />
        ))}
        <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(168, 85, 247,0.08)" strokeWidth="1" />
        
        {/* Animated chart content */}
        <g clipPath={`url(#${chartId})`}>
          <path d={area} fill="url(#lc-area)" />
          <path d={line} fill="none" stroke="url(#lc-stroke)" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round" 
          />
        </g>

        {pts.map((p, i) => (
          <g key={i}>
            {hov === i && (
              <line x1={p.x} y1="5" x2={p.x} y2="120"
                stroke="rgba(168, 85, 247,0.15)" strokeWidth="1.5" strokeDasharray="3 4" />
            )}
            {hov === i && (
              <circle cx={p.x} cy={p.y} r="12"
                fill="rgba(168, 85, 247,0.07)" stroke="rgba(168, 85, 247,0.18)" strokeWidth="1" />
            )}
            <circle cx={p.x} cy={p.y}
              r={hov === i ? 5.5 : 4}
              fill={hov === i ? B.green : B.lime}
              stroke="#000" strokeWidth="2"
              style={{ transition:'r 0.18s ease, fill 0.18s ease' }}
            />
            <text x={p.x} y="144"
              fill={hov === i ? 'rgba(229,229,229,0.9)' : 'rgba(107,114,128,0.65)'}
              fontSize="11" fontWeight="600" textAnchor="middle"
              style={{ transition:'fill 0.15s', fontFamily:'Outfit,sans-serif' }}>
              {p.label}
            </text>
            <rect x={p.x-34} y="0" width="68" height="148"
              fill="transparent" style={{ cursor:'crosshair' }}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {pts.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: hov === i ? 1 : 0,
          transform: `translateX(-50%) translateY(${hov===i?0:6}px)`,
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          top: `calc(${(p.y / 148) * 100}% - 45px)`,
          left: p.x > 380 ? 'auto' : `${(p.x / 500) * 100}%`,
          right: p.x > 380 ? 0 : 'auto',
          background: '#FFFFFF',
          border: `1px solid rgba(168, 85, 247,0.22)`,
          borderRadius: '10px',
          padding: '9px 13px',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 12px rgba(168, 85, 247,0.1)',
          zIndex: 40,
          minWidth: '110px',
        }}>
          <p style={{ fontSize:'0.68rem', color:B.subtle, fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 3px 0' }}>{p.label}</p>
          <p style={{ fontSize:'1.2rem', fontWeight:'800', color:B.text, letterSpacing:'-0.02em', margin:'0 0 2px 0', lineHeight:1 }}>{p.value.toLocaleString()}</p>
          <p style={{ fontSize:'0.68rem', color:B.lime, fontWeight:'600', margin:0 }}>lidos</p>
        </div>
      ))}
    </div>
  );
};

const ClientDashboard = ({ token }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load campaigns dropdown list
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/client-campaigns`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const campaignsData = res.data;
        const extractedCampaigns = Array.isArray(campaignsData)
          ? campaignsData
          : Array.isArray(campaignsData?.data)
            ? campaignsData.data
            : [];
        
        setCampaigns(extractedCampaigns);
        if (extractedCampaigns.length > 0) {
          setSelectedCampaignId(extractedCampaigns[0].id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading client campaigns list:', err);
        setCampaigns([]);
        setLoading(false);
      }
    };
    if (token) {
      fetchCampaigns();
    }
  }, [token]);

  // Load selected campaign metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      if (!selectedCampaignId) return;
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE}/api/campaigns/${selectedCampaignId}/metrics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetrics(res.data);
      } catch (err) {
        console.error('Error loading metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token && selectedCampaignId) {
      fetchMetrics();
    }
  }, [token, selectedCampaignId]);

  return (
    <div className="page-container pulse-glow" style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', color: '#fff', fontWeight: '800', letterSpacing: '-0.02em' }}>
            Dashboard do Cliente
          </h1>
          <p style={{ color: B.subtle, margin: 0, fontSize: '0.95rem', fontWeight: '500' }}>
            Visualize os resultados individuais de cada campanha enviada.
          </p>
        </div>
        
        {/* Campaign Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F3F4F6', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
          </svg>
          <select 
            value={selectedCampaignId} 
            onChange={(e) => setSelectedCampaignId(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-primary)', 
              outline: 'none', 
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              minWidth: '220px',
              padding: '4px'
            }}
          >
            {!Array.isArray(campaigns) || campaigns.length === 0 ? (
              <option value="">Nenhuma campanha disponível</option>
            ) : (
              campaigns.map(c => (
                <option key={c.id} value={c.id} style={{ background: '#0b0f19' }}>
                  {c.name} ({c.client})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Carregando dados estatísticos...</p>
      ) : !metrics ? (
        <div style={{ textAlign: 'center', padding: '3.5rem 2rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" style={{ marginBottom: '1rem' }}><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Nenhuma campanha foi criada com cliente atribuído ainda.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            
            {/* KPI 1 */}
            <Card hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Cliente Atribuído
                </span>
              </div>
              <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '800', color: '#fff' }}>{metrics.clientName}</h2>
            </Card>

            {/* KPI 2 */}
            <Card hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mensagens Enviadas
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#fff' }}>{metrics.sent}</h2>
                <span style={{ fontSize: '0.8rem', color: B.lime, fontWeight: '700', padding: '2px 8px', background: 'rgba(168, 85, 247,0.1)', borderRadius: '20px' }}>
                  Concluído
                </span>
              </div>
            </Card>

            {/* KPI 3 */}
            <Card hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Mensagens Lidas
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#fff' }}>{metrics.read}</h2>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: '700', padding: '2px 8px', background: 'rgba(56,189,248,0.1)', borderRadius: '20px' }}>
                  {metrics.ctr} Taxa Média
                </span>
              </div>
            </Card>

            {/* KPI 4 */}
            <Card hoverable style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Erros no Envio
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: '800', color: '#fff' }}>{metrics.failed}</h2>
                <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: '700' }}>
                  Falhas
                </span>
              </div>
            </Card>

          </div>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {/* Advanced Chart Visualization */}
            <Card className="card-gradient" style={{ flex: 2, minWidth: '300px', padding: '2.5rem 2rem' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#fff' }}>Evolução de Interações</h3>
              <LineChart data={metrics.chartData} />
            </Card>
          </div>
        </>
      )}

    </div>
  );
};

export default ClientDashboard;
