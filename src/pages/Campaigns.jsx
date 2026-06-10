import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Campaigns = ({ token }) => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loadingResendContacts, setLoadingResendContacts] = useState(false);
  
  // Actions Modal state
  const [actionMenuCampaign, setActionMenuCampaign] = useState(null);

  // Reschedule state
  const [rescheduleCampaign, setRescheduleCampaign] = useState(null);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (selectedCampaign || actionMenuCampaign || rescheduleCampaign) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedCampaign, actionMenuCampaign, rescheduleCampaign]);
  const [newScheduledAt, setNewScheduledAt] = useState('');

  useEffect(() => {
    if (rescheduleCampaign && rescheduleCampaign.scheduled_at) {
      const d = new Date(rescheduleCampaign.scheduled_at);
      if (!isNaN(d.getTime())) {
        const tzoffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
        setNewScheduledAt(localISOTime);
      } else {
        setNewScheduledAt('');
      }
    } else {
      setNewScheduledAt('');
    }
  }, [rescheduleCampaign]);

  const formatSchedule = (scheduledAtStr) => {
    if (!scheduledAtStr) return { date: '-', time: '-' };
    const d = new Date(scheduledAtStr);
    if (isNaN(d.getTime())) return { date: '-', time: '-' };
    const date = d.toLocaleDateString();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 10;

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCampaigns = async () => {
    try {
      const mockCampaigns = [
        { id: 1, name: 'Campanha de Black Friday', status: 'completed', total_sent: 1000, total_delivered: 950, total_read: 800, created_at: new Date().toISOString(), contact_flag: 'clientes_vip', template_sid: 'HX123' },
        { id: 2, name: 'Aviso de Vencimento', status: 'sending', total_sent: 500, total_delivered: 200, total_read: 150, created_at: new Date().toISOString(), contact_flag: 'boletos_abertos' },
        { id: 3, name: 'Promoção de Verão', status: 'scheduled', scheduled_at: new Date(Date.now() + 86400000).toISOString(), total_sent: 0, total_delivered: 0, total_read: 0, created_at: new Date().toISOString(), contact_flag: 'geral' },
        { id: 4, name: 'Recuperação de Carrinho', status: 'paused', total_sent: 300, total_delivered: 290, total_read: 100, created_at: new Date().toISOString() },
        { id: 5, name: 'Pesquisa de Satisfação', status: 'stopped', total_sent: 2000, total_delivered: 1900, total_read: 1500, created_at: new Date().toISOString(), contact_flag: 'compradores_recentes' }
      ];
      setCampaigns(mockCampaigns);
    } catch (err) {
      console.error('Error fetching campaigns', err);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchCampaigns, 10000);
    return () => clearInterval(interval);
  }, [token]);

  // Filter logic
  const filteredCampaigns = campaigns.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination Helper Calculations
  const totalPages = Math.max(Math.ceil(filteredCampaigns.length / campaignsPerPage), 1);

  // Safety check: if currentPage exceeds totalPages, adjust it
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCampaigns.length, totalPages, currentPage]);

  const paginatedCampaigns = filteredCampaigns.slice(
    (currentPage - 1) * campaignsPerPage,
    currentPage * campaignsPerPage
  );

  const handleResend = async (c) => {
    if (!window.confirm(`Deseja realmente reenviar a campanha "${c.name}" para os mesmos contatos de forma automática?`)) return;
    try {
      await axios.post(`${API_BASE}/api/campaigns/${c.id}/resend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Campanha reenviada com sucesso!');
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao reenviar campanha.');
    }
  };

  const handleEditableResend = async (c) => {
    setLoadingResendContacts(true);
    try {
      const response = await axios.get(`${API_BASE}/api/campaigns/${c.id}/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const contactIds = response.data.contactIds || [];
      setActionMenuCampaign(null);
      navigate('/new-campaign', { state: { cloneCampaign: c, cloneContacts: contactIds } });
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao carregar contatos da campanha para reenvio.');
    } finally {
      setLoadingResendContacts(false);
    }
  };

  const handlePause = async (c) => {
    if (!window.confirm(`Deseja realmente pausar a campanha "${c.name}"?`)) return;
    try {
      await axios.post(`${API_BASE}/api/campaigns/${c.id}/pause`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Campanha pausada com sucesso!');
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao pausar campanha.');
    }
  };

  const handleResume = async (c) => {
    if (!window.confirm(`Deseja realmente retomar a campanha "${c.name}"?`)) return;
    try {
      await axios.post(`${API_BASE}/api/campaigns/${c.id}/resume`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Campanha retomada com sucesso!');
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao retomar campanha.');
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Deseja realmente EXCLUIR permanentemente a campanha "${c.name}"? Esta ação removerá todo o histórico e mensagens associadas.`)) return;
    try {
      await axios.delete(`${API_BASE}/api/campaigns/${c.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Campanha excluída com sucesso!');
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao excluir campanha.');
    }
  };

  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newScheduledAt) {
      alert('Selecione uma data e hora válida.');
      return;
    }
    const delay = new Date(newScheduledAt).getTime() - Date.now();
    if (delay <= 0) {
      alert('A data do agendamento deve ser no futuro.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/api/campaigns/${rescheduleCampaign.id}/reschedule`, {
        scheduledAt: newScheduledAt
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Agendamento atualizado com sucesso!');
      setRescheduleCampaign(null);
      fetchCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao reagendar campanha.');
    }
  };

  const renderStatusBadge = (status, date, time) => {
    switch (status) {
      case 'completed':
        return (
          <span className="badge delivered" style={{ whiteSpace: 'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Concluída
          </span>
        );
      case 'sending':
        return (
          <span className="badge sending" style={{ 
            animation: 'pulseGlow 2s infinite ease-in-out',
            whiteSpace: 'nowrap'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Enviando
          </span>
        );
      case 'scheduled':
        return (
          <span className="badge scheduled" style={{ 
            whiteSpace: 'nowrap'
          }} title={`Agendado para ${date} às ${time}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Agendada
          </span>
        );
      case 'paused':
        return (
          <span className="badge paused" style={{ whiteSpace: 'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
            Pausada
          </span>
        );
      case 'stopped':
        return (
          <span className="badge stopped" style={{ whiteSpace: 'nowrap' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
            </svg>
            Parada
          </span>
        );
      default:
        return <span className="badge queued" style={{ whiteSpace: 'nowrap' }}>{status}</span>;
    }
  };

  const renderVariables = (variablesStr) => {
    try {
      const vars = JSON.parse(variablesStr || '{}');
      if (Object.keys(vars).length === 0) return <em style={{ color: 'var(--text-tertiary)' }}>Nenhuma variável configurada</em>;
      return Object.entries(vars).map(([key, val]) => (
        <div key={key} style={{ marginBottom: '8px', fontSize: '0.85rem', display: 'flex', gap: '6px' }}>
          <strong style={{ color: 'var(--accent-secondary)' }}>{`{{${key}}}`}:</strong> 
          <span style={{ color: 'var(--text-primary)' }}>{val}</span>
        </div>
      ));
    } catch (e) {
      return <em style={{ color: '#ef4444' }}>Erro ao carregar variáveis</em>;
    }
  };

  return (
    <div className="page-container pulse-glow">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Campanhas</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.02rem', margin: 0 }}>
            Acompanhe o desempenho, taxas de leitura e status em tempo real de cada disparo.
          </p>
        </div>
        <button onClick={() => navigate('/new-campaign')} style={{ width: 'auto' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          Nova Campanha
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div>
            <span style={styles.statLabel}>Total de Campanhas</span>
            <h2 style={styles.statVal}>{campaigns.length}</h2>
          </div>
          <div style={{ ...styles.statIconContainer, background: 'rgba(168, 85, 247, 0.22)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </div>
        </div>

        <div style={styles.statCard}>
          <div>
            <span style={styles.statLabel}>Em Execução (Ativas)</span>
            <h2 style={styles.statVal}>
              {campaigns.filter(c => c.status === 'sending').length}
            </h2>
          </div>
          <div style={{ ...styles.statIconContainer, background: 'rgba(16, 185, 129, 0.22)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>

        <div style={styles.statCard}>
          <div>
            <span style={styles.statLabel}>Agendadas</span>
            <h2 style={styles.statVal}>
              {campaigns.filter(c => c.status === 'scheduled').length}
            </h2>
          </div>
          <div style={{ ...styles.statIconContainer, background: 'rgba(6, 182, 212, 0.22)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div style={styles.filterSection}>
        <div style={styles.filterInputGroup}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Buscar campanha..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.filterInputGroup}>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.tagSelect}
          >
            <option value="">Status: Todos</option>
            <option value="sending">Em Execução</option>
            <option value="scheduled">Agendadas</option>
            <option value="paused">Pausadas</option>
            <option value="stopped">Paradas / Canceladas</option>
            <option value="completed">Concluídas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Carregando dados das campanhas...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nome da Campanha</th>
                <th>Tag</th>
                <th>Data</th>
                <th>Envios</th>
                <th>Entregues</th>
                <th>Lidos</th>
                <th>Desempenho</th>
                <th>Status</th>
                <th style={{ textAlign: 'center', width: '100px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '700', fontSize: '1.02rem', color: '#4b5563' }}>
                    {c.name}
                  </td>
                  <td>
                    {c.contact_flag ? (
                      <span className="tag-badge" style={{ 
                        background: 'rgba(168, 85, 247, 0.08)', 
                        color: '#A855F7', 
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: '700',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        width: 'fit-content'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        {c.contact_flag}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>-</span>
                    )}
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', whiteSpace: 'nowrap' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ fontWeight: '700' }}>{c.total_sent}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: '#34d399', fontWeight: '800' }}>
                        {c.total_delivered}
                      </span>
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        ({Math.round((c.total_delivered / c.total_sent) * 100) || 0}%)
                      </small>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--accent-secondary)', fontWeight: '800' }}>
                        {c.total_read}
                      </span>
                      <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                        ({Math.round((c.total_read / c.total_sent) * 100) || 0}%)
                      </small>
                    </div>
                  </td>
                  <td style={{ minWidth: '120px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700' }}>
                        <span style={{ color: '#A855F7' }}>{Math.round((c.total_read / c.total_sent) * 100) || 0}%</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{c.total_read} lidos / {c.total_sent} envios</span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${Math.round((c.total_read / c.total_sent) * 100) || 0}%`, 
                          background: 'linear-gradient(90deg, #7E22CE, #A855F7)', 
                          borderRadius: '99px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    {c.status === 'scheduled' ? (
                      <div 
                        onClick={() => setRescheduleCampaign(c)}
                        style={{ cursor: 'pointer' }}
                        title="Visualizar/Alterar Agendamento"
                      >
                        {(() => {
                          const { date, time } = formatSchedule(c.scheduled_at);
                          return renderStatusBadge(c.status, date, time);
                        })()}
                      </div>
                    ) : (
                      renderStatusBadge(c.status, null, null)
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button 
                      onClick={() => setActionMenuCampaign(c)}
                      className="secondary"
                      style={styles.ellipsisBtn}
                      title="Ações da Campanha"
                    >
                      •••
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedCampaigns.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>
                    Nenhuma campanha encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          {campaigns.length > campaignsPerPage && (
            <div style={styles.paginationContainer}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                className="secondary"
                style={styles.paginationBtn}
              >
                Anterior
              </button>
              <span style={styles.paginationInfo}>
                Página {currentPage} de {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                className="secondary"
                style={styles.paginationBtn}
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal Glassmorphic para Ações da Campanha */}
      {actionMenuCampaign && createPortal(
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setActionMenuCampaign(null)}>
          <div className="modal-content-box" style={styles.actionModalContent} onClick={(e) => e.stopPropagation()}>
            <span 
              onClick={() => setActionMenuCampaign(null)}
              style={{ ...styles.closeBtn, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              role="button"
            >
              ✕
            </span>
            
            <h2 style={{ marginTop: 0, fontSize: '1.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Ações da Campanha
            </h2>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', marginTop: '-0.5rem' }}>
              Selecione uma ação para a campanha <strong style={{ color: 'var(--text-primary)' }}>{actionMenuCampaign.name}</strong>:
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => {
                  setSelectedCampaign(actionMenuCampaign);
                  setActionMenuCampaign(null);
                }}
                className="secondary"
                style={styles.modalActionBtn}
              >
                Visualizar Detalhes
              </button>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#F9FAFB', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '0.25rem' }}>Opções de Reenvio:</span>
                <button 
                  onClick={() => {
                    handleResend(actionMenuCampaign);
                    setActionMenuCampaign(null);
                  }}
                  className="secondary"
                  style={{ ...styles.modalActionBtn, margin: 0 }}
                  title="Reenvia imediatamente com os mesmos dados"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polyline points="1 4 1 10 7 10"></polyline><polyline points="23 20 23 14 17 14"></polyline><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path></svg>
                  Reenvio Comum (Automático)
                </button>
                <button 
                  onClick={() => handleEditableResend(actionMenuCampaign)}
                  className="secondary"
                  style={{ ...styles.modalActionBtn, margin: 0, background: '#10B981', color: '#ffffff', borderColor: '#10B981', fontWeight: '700' }}
                  title="Abre a tela de Nova Campanha preenchida"
                  disabled={loadingResendContacts}
                >
                  {loadingResendContacts ? 'Carregando...' : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      Reenvio Editável (Clonar)
                    </>
                  )}
                </button>
              </div>
              
              {actionMenuCampaign.status !== 'paused' ? (
                <button 
                  onClick={() => {
                    handlePause(actionMenuCampaign);
                    setActionMenuCampaign(null);
                  }}
                  className="secondary"
                  style={styles.modalActionBtnWarn}
                >
                  Pausar Disparos
                </button>
              ) : (
                <button 
                  onClick={() => {
                    handleResume(actionMenuCampaign);
                    setActionMenuCampaign(null);
                  }}
                  className="secondary"
                  style={styles.modalActionBtnSuccess}
                >
                  Retomar Disparos
                </button>
              )}

              {actionMenuCampaign.status === 'scheduled' && (
                <button 
                  onClick={() => {
                    setRescheduleCampaign(actionMenuCampaign);
                    setActionMenuCampaign(null);
                  }}
                  className="secondary"
                  style={styles.modalActionBtnInfo}
                >
                  Alterar Agendamento
                </button>
              )}
              
              <button 
                onClick={() => {
                  handleDelete(actionMenuCampaign);
                  setActionMenuCampaign(null);
                }}
                className="danger"
                style={styles.modalActionBtnDanger}
              >
                Excluir Campanha
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* Modal para Reagendamento */}
      {rescheduleCampaign && createPortal(
        <div className="modal-overlay" style={styles.modalOverlay} onClick={() => setRescheduleCampaign(null)}>
          <div className="modal-content-box" style={styles.actionModalContent} onClick={(e) => e.stopPropagation()}>
            <span 
              onClick={() => setRescheduleCampaign(null)}
              style={{ ...styles.closeBtn, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              role="button"
            >
              ✕
            </span>
            
            <h2 style={{ marginTop: 0, fontSize: '1.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Visualizar Agendamento
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.detailLabel}>Campanha</label>
              <p style={{ ...styles.detailText, marginBottom: '1rem' }}>{rescheduleCampaign.name}</p>
              
              <label style={styles.detailLabel}>Agendamento Atual</label>
              <p style={styles.detailText}>
                {(() => {
                  const { date, time } = formatSchedule(rescheduleCampaign.scheduled_at);
                  return `${date} às ${time}`;
                })()}
              </p>
            </div>
            
            <form onSubmit={handleReschedule} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                Alterar Data e Hora
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="reschedule-input" style={styles.detailLabel}>Novo Horário de Disparo</label>
                <input 
                  id="reschedule-input"
                  type="datetime-local" 
                  value={newScheduledAt} 
                  onChange={(e) => setNewScheduledAt(e.target.value)}
                  style={styles.dateTimeInput}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setRescheduleCampaign(null)}
                  className="secondary"
                  style={{ flex: 1, boxShadow: 'none' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  style={{ flex: 1, background: 'var(--accent-primary)', color: 'white', border: 'none', boxShadow: 'none' }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {/* Modal Glassmorphic para Visualizar a Mensagem */}
      {selectedCampaign && createPortal(
        <div className="modal-overlay" style={styles.modalOverlay}>
          <div className="modal-content-box" style={styles.modalContent}>
            {/* Fechar modal */}
            <button 
              onClick={() => setSelectedCampaign(null)}
              style={styles.closeBtn}
            >
              ✕
            </button>
            
            <h2 style={{ marginTop: 0, fontSize: '1.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
              Detalhes da Campanha
            </h2>
            
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Campaign details */}
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={styles.detailLabel}>Nome da Campanha</label>
                  <p style={styles.detailText}>{selectedCampaign.name}</p>
                </div>
                
                <div>
                  <label style={styles.detailLabel}>Provedor Utilizado</label>
                  <p style={styles.detailText}>
                    {selectedCampaign.template_sid 
                      ? `Twilio (${selectedCampaign.twilio_account_name || 'WhatsApp Oficial'})` 
                      : 'Padrão (WhatsApp Web)'}
                  </p>
                </div>
                
                {selectedCampaign.template_sid && (
                  <div style={styles.variableBox}>
                    <label style={styles.detailLabel}>Variáveis Declaradas</label>
                    <div style={{ marginTop: '0.5rem' }}>
                      {renderVariables(selectedCampaign.template_variables)}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Phone Mockup Preview */}
              <div style={{ width: '280px', flexShrink: 0 }}>
                <div style={styles.miniPhone}>
                  <div style={styles.miniPhoneScreen}>
                    <div style={styles.miniHeader}>
                      <span style={{ fontSize: '14px' }}>←</span>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Visualização de Envio</div>
                        <div style={{ fontSize: '10px', opacity: 0.8 }}>online</div>
                      </div>
                    </div>
                    
                    <div style={styles.miniBody}>
                      <div className="whatsapp-message-bubble" style={{ alignSelf: 'flex-end', fontSize: '0.82rem', padding: '8px 12px', borderRadius: '12px', borderTopRightRadius: '2px' }}>
                        {selectedCampaign.template_sid ? (
                          <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--accent-primary)', color: 'white', fontSize: '0.62rem', padding: '1px 6px', borderRadius: '99px', marginBottom: '6px', fontWeight: 'bold' }}>
                              TWILIO TEMPLATE
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '6px', wordBreak: 'break-all' }}>
                              SID: <code>{selectedCampaign.template_sid}</code>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {selectedCampaign.media_path && (
                              <div style={{ marginBottom: '8px' }}>
                                {selectedCampaign.media_path.match(/\.(mp4|avi|mov)$/i) ? (
                                  <video src={`${API_BASE}${selectedCampaign.media_path}`} controls style={{ width: '100%', borderRadius: '8px' }} />
                                ) : selectedCampaign.media_path.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                  <img src={`${API_BASE}${selectedCampaign.media_path}`} alt="Anexo" style={{ width: '100%', borderRadius: '8px' }} />
                                ) : (
                                  <div style={{ background: 'rgba(0,0,0,0.1)', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>📎 Anexo: {selectedCampaign.media_path.split('/').pop()}</div>
                                )}
                              </div>
                            )}
                            <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.8rem', color: '#f1f5f9' }}>
                              {selectedCampaign.message_text || <span style={{ color: 'var(--text-tertiary)' }}>Sem mensagem</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
};

const styles = {
  actionBtn: {
    padding: '0.45rem 0.9rem',
    fontSize: '0.8rem',
    borderRadius: '8px',
    boxShadow: 'none'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(3, 7, 18, 0.8)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  modalContent: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-glass)',
    padding: '2.5rem',
    borderRadius: 'var(--radius-lg)',
    maxWidth: '650px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--shadow-glow)'
  },
  closeBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: 'none',
    color: '#000000',
    padding: '6px 10px',
    boxShadow: 'none',
    borderRadius: '8px',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },
  detailLabel: {
    color: 'var(--text-tertiary)',
    fontSize: '0.72rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '4px',
    textTransform: 'uppercase'
  },
  detailText: {
    color: 'var(--text-primary)',
    fontSize: '1.05rem',
    fontWeight: '600',
    margin: 0
  },
  variableBox: {
    background: '#F9FAFB',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid var(--border-glass)'
  },
  miniPhone: {
    width: '100%',
    height: '420px',
    backgroundColor: '#0c0f1a',
    borderRadius: '32px',
    padding: '8px',
    boxShadow: '0 12px 24px -6px rgba(0, 0, 0, 0.5), 0 0 0 1.5px rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden'
  },
  miniPhoneScreen: {
    width: '100%',
    height: '100%',
    borderRadius: '26px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#0b0e14',
    border: '1px solid #F9FAFB'
  },
  miniHeader: {
    background: '#121b2d',
    color: 'white',
    padding: '20px 10px 8px 10px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    borderBottom: '1px solid #F3F4F6'
  },
  miniBody: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#FFFFFF',
    overflowY: 'auto'
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.25rem',
    borderTop: '1px solid var(--border-glass)',
    background: '#F9FAFB'
  },
  paginationBtn: {
    padding: '0.5rem 1.25rem',
    fontSize: '0.85rem',
    borderRadius: '8px',
    boxShadow: 'none',
    minWidth: '100px'
  },
  paginationInfo: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem'
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid var(--border-glass)',
    borderRadius: '14px',
    padding: '1.5rem 1.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.25rem',
    boxShadow: 'var(--shadow-sm)'
  },
  statIconContainer: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'rgba(168, 85, 247, 0.1)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.35rem',
    color: 'var(--accent-primary)'
  },
  statLabel: {
    display: 'block',
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    fontWeight: '700',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: '4px'
  },
  statVal: {
    margin: 0,
    fontSize: '1.6rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em'
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem',
    flexWrap: 'wrap'
  },
  filterInputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: 'transparent',
    border: '1px solid var(--border-glass)',
    padding: '0.6rem 1rem',
    borderRadius: '12px',
    flex: 1,
    minWidth: '200px'
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    padding: '0.25rem',
    fontSize: '0.88rem'
  },
  tagSelect: {
    border: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
    fontSize: '0.88rem',
    padding: '0.25rem 0'
  },
  ellipsisBtn: {
    padding: '0.4rem 0.8rem',
    fontSize: '1rem',
    borderRadius: '8px',
    boxShadow: 'none',
    border: '1px solid var(--border-glass)',
    background: '#F3F4F6',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    fontWeight: 'bold',
    minWidth: '42px',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  actionModalContent: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-glass)',
    padding: '2.5rem',
    borderRadius: 'var(--radius-lg)',
    maxWidth: '450px',
    width: '90%',
    position: 'relative',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)'
  },
  modalActionBtn: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '600',
    borderRadius: '10px',
    border: '1px solid var(--border-glass)',
    background: '#F9FAFB',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'block',
    boxShadow: 'none'
  },
  modalActionBtnWarn: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    background: '#f59e0b',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'block',
    boxShadow: 'none'
  },
  modalActionBtnSuccess: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    background: '#10B981',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'block',
    boxShadow: 'none'
  },
  modalActionBtnDanger: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    background: '#ef4444',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'block',
    boxShadow: 'none'
  },
  modalActionBtnInfo: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    background: '#0ea5e9',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'block',
    boxShadow: 'none'
  },
  dateTimeInput: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '10px',
    border: '1px solid var(--border-glass)',
    background: '#F3F4F6',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
    cursor: 'pointer'
  }
};

export default Campaigns;
