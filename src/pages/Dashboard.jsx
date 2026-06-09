import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/* ─── Brand tokens ─────────────────────────────────────────────────── */
const B = {
  lime:      'var(--accent-primary)',
  limeAlpha: 'rgba(168, 85, 247,',   // append opacity + ')'
  green:     'var(--accent-secondary)',
  text:      'var(--text-primary)',
  muted:     'var(--text-secondary)',
  subtle:    'var(--text-tertiary)',
  card:      'var(--bg-card)',
  border:    'var(--border-glass)',
  borderHov: 'var(--accent-primary)',
};

// Helper to render Icons dynamically based on color
const getIcon = (type, c) => {
  if (type === 'contacts') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
  if (type === 'sent') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
    </svg>
  );
  if (type === 'read') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
};

/* ─── Chart data ───────────────────────────────────────────────────── */
const LINE_DATA = [
  { label:'Seg', value:320, x:46  },
  { label:'Ter', value:480, x:120 },
  { label:'Qua', value:390, x:194 },
  { label:'Qui', value:760, x:268 },
  { label:'Sex', value:610, x:342 },
  { label:'Sáb', value:290, x:416 },
  { label:'Dom', value:510, x:490 },
];
const BAR_DATA = [
  { label:'Camp A', entregue:96, lido:74 },
  { label:'Camp B', entregue:82, lido:58 },
  { label:'Camp C', entregue:99, lido:88 },
  { label:'Camp D', entregue:71, lido:49 },
];

function svgY(val, mn, mx, h = 100) {
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

/* ─── Section Label ────────────────────────────────────────────────── */
const SLabel = ({ children }) => (
  <p style={{ fontSize:'0.67rem', fontWeight:'700', letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-tertiary)', margin:'0 0 0.9rem 0' }}>
    {children}
  </p>
);

/* ─── Line Chart ───────────────────────────────────────────────────── */
const LineChart = ({ data }) => {
  const [hov, setHov] = useState(null);
  const chartId = React.useMemo(() => `chart-reveal-${Math.random().toString(36).substr(2, 9)}`, []);
  const chartData = data && data.length > 0 ? data : LINE_DATA;
  const vals = chartData.map(d => d.value);
  const mn   = Math.min(...vals) * 0.82;
  const mx   = Math.max(...vals) * 1.08 || 10;
  const pts  = chartData.map(d => ({ ...d, y: svgY(d.value, mn, mx, 90) + 10 }));
  const line = pts.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${pts[pts.length-1].x} 110 L ${pts[0].x} 110 Z`;

  return (
    <div style={{ position:'relative', width:'100%' }}>
      <svg viewBox="0 0 500 130" width="100%" height="135" style={{ overflow:'visible', display:'block' }}>
        <defs>
          <linearGradient id="lc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={B.lime}  />
            <stop offset="100%" stopColor={B.green} />
          </linearGradient>
          <linearGradient id="lc-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={B.lime} stopOpacity="0.45" />
            <stop offset="100%" stopColor={B.lime} stopOpacity="0" />
          </linearGradient>
          <clipPath id={chartId}>
            <rect x="0" y="0" width="500" height="130">
              <animate attributeName="width" from="0" to="500" dur="3.0s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" />
            </rect>
          </clipPath>
        </defs>
        
        {/* Background grids and Y-axis legend */}
        {[10, 43, 76, 110].map(y => {
          const v = Math.round(mn + ((110 - y) / 100) * (mx - mn));
          return (
            <g key={y}>
              <line x1="40" y1={y} x2="500" y2={y} stroke="rgba(168, 85, 247,0.05)" strokeWidth="1" strokeDasharray="4 6" />
              <text x="32" y={y + 3} textAnchor="end" fontSize="10" fill="rgba(107,114,128,0.7)">
                {v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
              </text>
            </g>
          );
        })}
        
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
              <line x1={p.x} y1="10" x2={p.x} y2="110"
                stroke="rgba(168, 85, 247,0.15)" strokeWidth="1.5" strokeDasharray="3 4" />
            )}
            {hov === i && (
              <circle cx={p.x} cy={p.y} r="12"
                fill="rgba(168, 85, 247,0.07)" stroke="rgba(168, 85, 247,0.18)" strokeWidth="1" />
            )}
            <circle cx={p.x} cy={p.y}
              r={hov === i ? 5.5 : 4}
              fill={hov === i ? B.green : B.lime}
              stroke="none"
              style={{ transition:'r 0.18s ease, fill 0.18s ease' }}
            />
            <text x={p.x} y="128"
              fill={hov === i ? 'rgba(229,229,229,0.9)' : 'rgba(107,114,128,0.65)'}
              fontSize="11" fontWeight="600" textAnchor="middle"
              style={{ transition:'fill 0.15s', fontFamily:'Inter,sans-serif' }}>
              {p.label}
            </text>
            <rect x={p.x-34} y="0" width="68" height="130"
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
          top: Math.max(0, (p.y / 148) * 170 - 68),
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
          <p style={{ fontSize:'0.68rem', color:B.lime, fontWeight:'600', margin:0 }}>disparos</p>
        </div>
      ))}
    </div>
  );
};

/* ─── Campaign Bars ────────────────────────────────────────────────── */
const CampaignBars = ({ data }) => {
  const [hov, setHov] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  const chartData = data && data.length > 0 ? data : BAR_DATA;

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', borderRadius:'10px', overflow:'hidden', background:'var(--border-glass)', marginTop:'1rem' }}>
      {chartData.map((d, i) => (
        <div key={i}
          onMouseEnter={() => setHov(i)}
          onMouseLeave={() => setHov(null)}
          style={{ padding:'1rem 1.1rem', background: 'var(--bg-input)', transition:'background 0.2s ease', cursor:'default' }}>
          <p style={{ fontSize:'0.7rem', fontWeight:'700', color: hov===i ? B.muted : B.subtle, textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 0.75rem 0', transition:'color 0.2s' }}>
            {d.label}
          </p>
          {/* Entregue */}
          <div style={{ marginBottom:'0.6rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
              <span style={{ fontSize:'0.7rem', color:B.subtle, fontWeight:'500' }}>Entregue</span>
              <span style={{ fontSize:'0.78rem', fontWeight:'800', color:B.lime }}>{d.entregue}%</span>
            </div>
            <div style={{ height:'4px', borderRadius:'99px', background:'var(--border-glass)', overflow:'hidden' }}>
              <div style={{ height:'100%', width: mounted ? `${d.entregue}%` : '0%', borderRadius:'99px', background: B.lime, transition:`width ${1.5+i*0.3}s cubic-bezier(0.34,1.56,0.64,1)` }} />
            </div>
          </div>
          {/* Lido */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
              <span style={{ fontSize:'0.7rem', color:B.subtle, fontWeight:'500' }}>Lido</span>
              <span style={{ fontSize:'0.78rem', fontWeight:'800', color:B.green }}>{d.lido}%</span>
            </div>
            <div style={{ height:'4px', borderRadius:'99px', background:'var(--border-glass)', overflow:'hidden' }}>
              <div style={{ height:'100%', width: mounted ? `${d.lido}%` : '0%', borderRadius:'99px', background: B.green, transition:`width ${1.8+i*0.3}s cubic-bezier(0.34,1.56,0.64,1)` }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/* ─── Dashboard Page ───────────────────────────────────────────────── */
const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ activeContacts: 0, totalSent: 0, readRate: '0' });
  const [lineChartData, setLineChartData] = useState([]);
  const [campaignBarsData, setCampaignBarsData] = useState([]);
  const [campaignStatusData, setCampaignStatusData] = useState([]);
  const [campaignEngagementData, setCampaignEngagementData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mockContacts = [
          { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 }
        ];
        
        const mockCampaigns = [
          { id: 1, name: 'Campanha de Black Friday', status: 'completed', total_sent: 1000, total_delivered: 950, total_read: 800, created_at: new Date(Date.now() - 86400000).toISOString() },
          { id: 2, name: 'Aviso de Vencimento', status: 'sending', total_sent: 500, total_delivered: 200, total_read: 150, created_at: new Date(Date.now() - 172800000).toISOString() },
          { id: 4, name: 'Recuperação de Carrinho', status: 'paused', total_sent: 300, total_delivered: 290, total_read: 100, created_at: new Date(Date.now() - 345600000).toISOString() },
          { id: 5, name: 'Pesquisa de Satisfação', status: 'stopped', total_sent: 2000, total_delivered: 1900, total_read: 1500, created_at: new Date(Date.now() - 518400000).toISOString() }
        ];

        const activeContacts = mockContacts.length;
        let totalSent = 0;
        let totalRead = 0;

        mockCampaigns.forEach(c => {
          totalSent += Number(c.total_sent || 0);
          totalRead += Number(c.total_read || 0);
        });

        const readRate = totalSent > 0 ? ((totalRead / totalSent) * 100).toFixed(2) : '0.00';

        setStats({ activeContacts, totalSent, readRate });

        // Calculate dynamic line chart data for last 7 days
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const today = new Date();
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(today.getDate() - i);
          const dateStr = d.toLocaleDateString();
          const dayLabel = days[d.getDay()];
          last7Days.push({ label: dayLabel, dateKey: dateStr, value: 0 });
        }

        mockCampaigns.forEach(c => {
          const campDate = new Date(c.created_at);
          const dateStr = campDate.toLocaleDateString();
          const dayItem = last7Days.find(item => item.dateKey === dateStr);
          if (dayItem) {
            dayItem.value += (c.total_sent || 0);
          }
        });

        const xs = [46, 120, 194, 268, 342, 416, 490];
        const dynamicLineData = last7Days.map((item, i) => ({
          label: item.label,
          value: item.value,
          x: xs[i] || (46 + i * 74)
        }));

        // Only set line chart data if there's actual data, otherwise let fallback show beautiful stats
        const hasData = dynamicLineData.some(item => item.value > 0);
        if (hasData) {
          setLineChartData(dynamicLineData);
        }

        // Calculate dynamic campaign efficiency (top 4 campaigns)
        const topCampaigns = [...mockCampaigns]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);

        if (topCampaigns.length > 0) {
          const dynamicBarData = topCampaigns.map(c => {
            const entregue = c.total_sent > 0 ? Math.round((c.total_delivered / c.total_sent) * 100) : 0;
            const lido = c.total_sent > 0 ? Math.round((c.total_read / c.total_sent) * 100) : 0;
            return {
              label: c.name,
              entregue,
              lido
            };
          });
          setCampaignBarsData(dynamicBarData);
        }

        // Calculate dynamic campaign status distribution
        const statusCounts = { completed: 0, sending: 0, scheduled: 0, paused: 0, stopped: 0 };
        mockCampaigns.forEach(c => {
          if (statusCounts[c.status] !== undefined) statusCounts[c.status]++;
          else statusCounts.completed++; // fallback
        });
        setCampaignStatusData([
          { label:'Concluídas', value:statusCounts.completed, color:'#10b981' },
          { label:'Enviando',   value:statusCounts.sending,   color:'#A855F7' },
          { label:'Agendadas',  value:statusCounts.scheduled, color:'#06b6d4' },
          { label:'Pausadas',   value:statusCounts.paused,    color:'#f59e0b' },
          { label:'Paradas',    value:statusCounts.stopped,   color:'#f87171' },
        ]);

        // Calculate dynamic campaign engagement distribution
        const eng = { entregues: 0, lidos: 0, falhas: 0 };
        mockCampaigns.forEach(c => {
          const sent = Number(c.total_sent || 0);
          const deliv = Number(c.total_delivered || 0);
          const read = Number(c.total_read || 0);
          eng.falhas += (sent - deliv);
          eng.lidos += read;
          eng.entregues += (deliv - read);
        });
        setCampaignEngagementData([
          { label: 'Lidas', value: eng.lidos, color: '#10b981' },
          { label: 'Entregues (não lidas)', value: eng.entregues, color: '#A855F7' },
          { label: 'Falhas / Não Entregues', value: eng.falhas, color: '#f87171' }
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const kpis = [
    {
      label: 'Contatos Ativos', value: (stats.activeContacts ?? 0).toLocaleString(), badge: 'Total', detail: 'cadastrados',
      badgeOk: true, iconColor: '#A855F7', iconType: 'contacts', bg: 'rgba(168, 85, 247, 0.22)'
    },
    {
      label: 'Disparos Realizados', value: (stats.totalSent ?? 0).toLocaleString(), badge: 'Envios', detail: 'totais',
      badgeOk: true, iconColor: '#10b981', iconType: 'sent', bg: 'rgba(16, 185, 129, 0.22)'
    },
    {
      label: 'Taxa de Leitura', value: `${stats.readRate || '0'}%`, badge: 'Média', detail: 'engajamento',
      badgeOk: true, iconColor: '#06b6d4', iconType: 'read', bg: 'rgba(6, 182, 212, 0.22)'
    }
  ];

  return (
    <div className="page-container" style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom:'0.3rem' }}>Visão Geral</h1>
        <p style={{ color:B.subtle, fontSize:'0.85rem', margin:0, fontWeight:'400', lineHeight:1.6 }}>
          Painel de controle · Disparos inteligentes
        </p>
      </div>

      {/* KPI */}
      <div>
        <SLabel>Visão Geral</SLabel>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(175px, 1fr))', gap:'0.875rem' }}>
          {kpis.map((k, i) => (
            <Card key={i} hoverable style={{ padding:'1.6rem 1.25rem 1.3rem', display:'flex', flexDirection:'column', gap:'0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize:'0.7rem', fontWeight:'700', color:B.subtle, textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.3rem 0' }}>{k.label}</p>
                  <p style={{ fontSize:'2rem', fontWeight:'800', color:B.text, letterSpacing:'-0.03em', margin:0, lineHeight:1 }}>{k.value}</p>
                </div>
                <div style={{ width:'48px', height:'48px', borderRadius:'13px', background:k.bg, display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  {getIcon(k.iconType, k.iconColor)}
                </div>
              </div>
              <p style={{ fontSize:'0.74rem', color:'rgba(107,114,128,0.8)', margin:0, fontWeight:'500' }}>
                <span style={{ color: k.badgeOk ? B.lime : '#ef4444', fontWeight:'700' }}>{k.badge}</span>{' '}{k.detail}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <SLabel>Análise de Desempenho</SLabel>
        
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(400px, 1fr))', gap:'0.875rem' }}>
          
          {/* Left: Volume de Disparos (Column Chart) */}
          <Card style={{ padding:'1.5rem', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize:'0.875rem', fontWeight:'700', color:B.text, margin:'0 0 0.15rem 0' }}>Volume Mensal de Disparos</p>
            <p style={{ fontSize:'0.73rem', color:B.subtle, margin:'0 0 1.5rem 0', fontWeight:'500' }}>Mensagens enviadas nos últimos 7 meses</p>
            <style>
              {`
                .bar-group rect { transition: all 0.2s ease; transform-origin: bottom; }
                .bar-group:hover rect.fill-bar { opacity: 0.8; transform: scaleY(1.03); }
                .bar-group:hover text.bar-val { font-size: 13px; }
              `}
            </style>
            {(() => {
              const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul'];
              const values = [1250, 2100, 1800, 3500, 4200, 3900, 5800];
              const maxV   = Math.max(...values);
              const barW   = 36;
              const W      = 600; 
              const H      = 160;
              const gap    = (W - (months.length * barW)) / (months.length + 1);
              
              return (
                <svg viewBox={`0 0 ${W} ${H + 30}`} width="100%" style={{ overflow:'visible', flex: 1, maxHeight: '240px' }}>
                  <defs>
                    <linearGradient id="colBarGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7"/>
                      <stop offset="100%" stopColor="#7E22CE" stopOpacity="0.8"/>
                    </linearGradient>
                  </defs>
                  {/* Horizontal grid lines */}
                  {[0, 0.5, 1].map(pct => {
                    const y = H - (pct * H);
                    const v = Math.round(maxV * pct);
                    return (
                      <g key={pct}>
                        <line x1="30" y1={y} x2={W} y2={y} stroke="rgba(168, 85, 247,0.06)" strokeWidth="1" strokeDasharray="4 6" />
                        <text x="24" y={y + 4} textAnchor="end" fontSize="11" fill="rgba(55,65,81,0.9)" fontWeight="500">
                          {v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
                        </text>
                      </g>
                    );
                  })}
                  {/* Columns */}
                  {values.map((v, i) => {
                    const bh  = Math.max(4, (v / maxV) * H);
                    const bx  = gap + i * (barW + gap);
                    const by  = H - bh;
                    const cx  = bx + barW / 2;
                    return (
                      <g key={i} className="bar-group" style={{ cursor: 'pointer' }}>
                        {/* Track */}
                        <rect x={bx} y={0} width={barW} height={H} rx="6" fill="rgba(243, 244, 246, 0.5)"/>
                        {/* Fill */}
                        <rect x={bx} y={by} width={barW} height={bh} rx="6" fill="url(#colBarGrad)" className="fill-bar"/>
                        {/* Value label */}
                        <text x={cx} y={by - 8} textAnchor="middle" fontSize="12" fontWeight="800" fill="#7E22CE" className="bar-val" style={{ transition: 'all 0.2s' }}>
                          {v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}
                        </text>
                        {/* Month label */}
                        <text x={cx} y={H + 20} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4B5563">{months[i]}</text>
                      </g>
                    );
                  })}
                </svg>
              );
            })()}
          </Card>

          {/* Right: 2 Circle Charts Side-by-Side */}
          <Card style={{ padding:'1.5rem', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize:'0.875rem', fontWeight:'700', color:B.text, margin:'0 0 0.15rem 0' }}>Status e Engajamento</p>
            <p style={{ fontSize:'0.73rem', color:B.subtle, margin:'0 0 1.5rem 0', fontWeight:'500' }}>Distribuição das mensagens</p>
            
            <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'flex-start' }}>
              
              {/* Donut 1: Status */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', marginBottom: '1rem' }}>Status</p>
                {(() => {
                  const rawSlices = campaignStatusData && campaignStatusData.length > 0 ? campaignStatusData : [];
                  const slices = rawSlices.filter(s => s.value > 0);
                  const total = slices.reduce((a,s) => a + s.value, 0) || 1;
                  const R = 44, cx = 60, cy = 60, sw = 14;
                  const circ = 2 * Math.PI * R;
                  let cumulative = 0;
                  const paths = slices.map(s => {
                    const pct = s.value / total;
                    const offset = circ * (1 - pct);
                    const rotate = cumulative * 360 - 90;
                    cumulative += pct;
                    return { ...s, pct, offset, rotate };
                  });
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink:0 }}>
                        {paths.map((s, i) => (
                          <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth={sw}
                            strokeDasharray={`${circ * s.pct - 2} ${circ * (1 - s.pct) + 2}`}
                            strokeDashoffset={-circ * paths.slice(0,i).reduce((a,p)=>a+p.pct,0)}
                            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round"
                            style={{ transition:'stroke-dasharray 1s ease' }}
                          />
                        ))}
                        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="18" fontWeight="800" fill="#1F2937">{total}</text>
                        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#6B7280">campanhas</text>
                      </svg>
                      {/* Legend */}
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem', width: '100%', marginTop: '1.25rem' }}>
                        {paths.map((s, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'0.72rem' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:s.color }}/>
                              <span style={{ color:'var(--text-secondary)', fontWeight:'500' }}>{s.label}</span>
                            </div>
                            <span style={{ fontWeight:'700', color:'var(--text-primary)' }}>{s.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Divider */}
              <div style={{ width: '1px', background: 'var(--border-glass)', alignSelf: 'stretch', margin: '0 0.5rem' }} />

              {/* Donut 2: Engajamento */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '700', color: B.subtle, textTransform: 'uppercase', marginBottom: '1rem' }}>Desempenho</p>
                {(() => {
                  const rawSlices = campaignEngagementData && campaignEngagementData.length > 0 ? campaignEngagementData : [];
                  const slices = rawSlices.filter(s => s.value > 0);
                  const total = slices.reduce((a,s) => a + s.value, 0) || 1;
                  const R = 44, cx = 60, cy = 60, sw = 14;
                  const circ = 2 * Math.PI * R;
                  let cumulative = 0;
                  const paths = slices.map(s => {
                    const pct = s.value / total;
                    const offset = circ * (1 - pct);
                    const rotate = cumulative * 360 - 90;
                    cumulative += pct;
                    return { ...s, pct, offset, rotate };
                  });
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                      <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink:0 }}>
                        {paths.map((s, i) => (
                          <circle key={i} cx={cx} cy={cy} r={R} fill="none" stroke={s.color} strokeWidth={sw}
                            strokeDasharray={`${circ * s.pct - 2} ${circ * (1 - s.pct) + 2}`}
                            strokeDashoffset={-circ * paths.slice(0,i).reduce((a,p)=>a+p.pct,0)}
                            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="round"
                            style={{ transition:'stroke-dasharray 1s ease' }}
                          />
                        ))}
                        <text x={cx} y={cy - 2} textAnchor="middle" fontSize="16" fontWeight="800" fill="#1F2937">
                          {total >= 1000 ? `${(total/1000).toFixed(1)}k` : total}
                        </text>
                        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fontWeight="700" fill="#6B7280">envios</text>
                      </svg>
                      {/* Legend */}
                      <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem', width: '100%', marginTop: '1.25rem' }}>
                        {paths.map((s, i) => (
                          <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:'0.72rem' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                              <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:s.color }}/>
                              <span style={{ color:'var(--text-secondary)', fontWeight:'500', maxWidth: '85px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.label}</span>
                            </div>
                            <span style={{ fontWeight:'700', color:'var(--text-primary)' }}>
                              {Math.round((s.value / total) * 100)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

            </div>
          </Card>

        </div>
      </div>
      {/* Actions */}
      <div>
        <SLabel>Ações Rápidas</SLabel>
        <div className="dashboard-cards-container" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap:'0.875rem' }}>

          {/* Contacts */}
          <Card hoverable style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.9rem', background:'var(--bg-card)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'11px', background:'rgba(168, 85, 247, 0.1)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={B.lime} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:'0.65rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:B.lime, margin:'0 0 0.15rem 0' }}>Recomendado</p>
                <h2 style={{ fontSize:'0.95rem', fontWeight:'700', color:B.text, margin:0 }}>Importar contatos</h2>
              </div>
            </div>
            <p style={{ fontSize:'0.82rem', color:B.muted, lineHeight:1.65, margin:0 }}>
              Carregue sua lista de leads via Excel ou CSV para iniciar seus fluxos de disparo.
            </p>
            <button onClick={() => navigate('/contacts')} className="secondary" style={{ height:'44px', padding:'0 1rem', fontSize:'0.82rem', fontWeight:'600', borderRadius:'8px', width:'100%', display:'inline-flex', alignItems:'center', justifyContent: 'center', gap:'6px', marginTop:'auto' }}>
              Gerenciar Contatos
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </Card>

          {/* New Campaign */}
          <Card hoverable style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'0.9rem', borderColor:'var(--border-glass)', background:'var(--bg-input)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem' }}>
              <div style={{ width:'42px', height:'42px', borderRadius:'11px', background:'rgba(168, 85, 247, 0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'none' }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize:'0.65rem', fontWeight:'700', letterSpacing:'0.08em', textTransform:'uppercase', color:B.green, margin:'0 0 0.15rem 0' }}>Novo Disparo</p>
                <h2 style={{ fontSize:'0.95rem', fontWeight:'700', color:B.text, margin:0 }}>Criar campanha</h2>
              </div>
            </div>
            <p style={{ fontSize:'0.82rem', color:B.muted, lineHeight:1.65, margin:0 }}>
              Monte um novo fluxo de mensagens com variáveis, mídias e segmentação de leads.
            </p>
            <button onClick={() => navigate('/new-campaign')} style={{ height:'44px', padding:'0 1rem', width:'100%', marginTop:'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
              Criar Campanha
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 16 14"/></svg>
            </button>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
