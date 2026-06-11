import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchBotFlows, deleteBotFlow, getBotChannelLabel, BOT_CHANNELS, createBotFlow } from '../lib/botFlowApi';

const B = {
  lime: 'var(--accent-primary)',
  text: 'var(--text-primary)',
  muted: 'var(--text-secondary)',
  border: 'var(--border-glass)',
};

const mockFolders = [
  { id: 'fold1', name: 'Campanhas de Vendas', flowIds: ['mock1'], description: 'Fluxos focados em conversão e campanhas de marketing.' },
  { id: 'fold2', name: 'Atendimento & Suporte', flowIds: ['mock3'], description: 'FAQ automático e roteamento de tickets de suporte.' },
  { id: 'fold3', name: 'Recuperação & Carrinho', flowIds: ['mock2'], description: 'Mensagens automáticas de pós-venda e abandono.' },
];

export default function BotBuilder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState([]);

  const [selectedSidebarItem, setSelectedSidebarItem] = useState('all'); // 'all' | 'trash' | folderId
  const [trashFlows, setTrashFlows] = useState([
    { id: 'mock_trash_1', name: 'Rascunho de Teste', channel: 'whatsapp_qr', isActive: false, nodeCount: 1, description: 'Fluxo excluído anteriormente.' }
  ]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 860);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState('');
  const [newFlowChannel, setNewFlowChannel] = useState('whatsapp_qr');
  const [isSavingFlow, setIsSavingFlow] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCreateFlow = async () => {
    if (!newFlowName.trim()) {
      toast.error('Informe o nome do fluxo');
      return;
    }
    setIsSavingFlow(true);
    try {
      const flow = await createBotFlow({ name: newFlowName.trim(), channel: newFlowChannel });
      if (!flow) {
        toast.error('Erro ao criar fluxo');
        return;
      }
      toast.success('Fluxo criado!');
      setIsCreateModalOpen(false);
      navigate(`/bot-builder/${flow.id}/edit`);
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setIsSavingFlow(false);
    }
  };

  const currentFlows = flows;

  const loadFlows = useCallback(async () => {
    try {
      const list = await fetchBotFlows();
      setFlows(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFlows();
  }, [loadFlows]);

  const handleDelete = async (e, flow) => {
    e.stopPropagation();
    if (!window.confirm(`Mover o fluxo "${flow.name}" para a lixeira?`)) return;
    const ok = await deleteBotFlow(flow.id);
    if (ok) {
      toast.success('Fluxo movido para a lixeira');
      setTrashFlows((prev) => [...prev, { ...flow, description: flow.description || 'Movido para a lixeira.' }]);
      setFlows((prev) => prev.filter((f) => f.id !== flow.id));
    } else {
      toast.error('Não foi possível excluir');
    }
  };

  const handleRestore = (e, flow) => {
    e.stopPropagation();
    toast.success('Fluxo restaurado');
    setTrashFlows((prev) => prev.filter((f) => f.id !== flow.id));
    setFlows((prev) => [...prev, flow]);
  };

  const handlePermanentDelete = (e, flow) => {
    e.stopPropagation();
    if (!window.confirm(`Excluir permanentemente o fluxo "${flow.name}"?`)) return;
    toast.success('Fluxo excluído permanentemente');
    setTrashFlows((prev) => prev.filter((f) => f.id !== flow.id));
  };

  const getFolderFlowCount = (folderId) => {
    const folder = mockFolders.find(f => f.id === folderId);
    if (!folder) return 0;
    return flows.filter(flow => folder.flowIds.includes(flow.id)).length;
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: B.muted, textAlign: 'center' }}>
        Carregando fluxos...
      </div>
    );
  }

  return (
    <div className="page-container pulse-glow" style={{ width: '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ color: B.text, fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>Meus Fluxos</h1>
          <p style={{ color: B.muted, marginTop: 8 }}>
            Monte e organize seus fluxos automáticos.
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => { setIsCreateModalOpen(true); setNewFlowName(''); setNewFlowChannel('whatsapp_qr'); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'none' }}
        >
          + Novo fluxo
        </button>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '2rem',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: '0.5rem'
      }}>
        {/* Left Sidebar */}
        <div style={{
          width: isMobile ? '100%' : '260px',
          background: 'var(--bg-card)',
          border: `1px solid ${B.border}`,
          borderRadius: '16px',
          padding: '1.5rem 1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          {/* Main sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setSelectedSidebarItem('all')}
              style={{
                background: selectedSidebarItem === 'all' ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                border: 'none',
                color: selectedSidebarItem === 'all' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: selectedSidebarItem === 'all' ? '700' : '500',
                fontSize: '0.9rem',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                boxShadow: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedSidebarItem !== 'all') e.currentTarget.style.background = 'rgba(168, 85, 247, 0.02)';
              }}
              onMouseLeave={(e) => {
                if (selectedSidebarItem !== 'all') e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/>
                <rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>
              </svg>
              Todos os Fluxos
            </button>
          </div>

          {/* Folders Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', paddingLeft: '12px' }}>
              Pastas
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {mockFolders.map((folder) => {
                const isSelected = selectedSidebarItem === folder.id;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedSidebarItem(folder.id)}
                    style={{
                      background: isSelected ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                      border: 'none',
                      color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontWeight: isSelected ? '700' : '500',
                      fontSize: '0.9rem',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      boxShadow: 'none',
                      transition: 'all 0.18s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(168, 85, 247, 0.02)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', background: isSelected ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0,0,0,0.05)', color: isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                      {getFolderFlowCount(folder.id)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: `1px solid ${B.border}`, margin: '0.5rem 0' }} />

          {/* Trash Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              onClick={() => setSelectedSidebarItem('trash')}
              style={{
                background: selectedSidebarItem === 'trash' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                border: 'none',
                color: selectedSidebarItem === 'trash' ? '#ef4444' : 'var(--text-secondary)',
                fontWeight: selectedSidebarItem === 'trash' ? '700' : '500',
                fontSize: '0.9rem',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                boxShadow: 'none',
                transition: 'all 0.18s ease'
              }}
              onMouseEnter={(e) => {
                if (selectedSidebarItem !== 'trash') e.currentTarget.style.background = 'rgba(239, 68, 68, 0.02)';
              }}
              onMouseLeave={(e) => {
                if (selectedSidebarItem !== 'trash') e.currentTarget.style.background = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Lixeira
              {trashFlows.length > 0 && (
                <span style={{ fontSize: '0.75rem', background: selectedSidebarItem === 'trash' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold', marginLeft: 'auto' }}>
                  {trashFlows.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div style={{ flex: 1, width: '100%', minWidth: 0 }}>
          {(() => {
            if (selectedSidebarItem === 'trash') {
              if (trashFlows.length === 0) {
                return (
                  <div style={{ background: 'var(--bg-card)', padding: '3rem', textAlign: 'center', borderRadius: 14, border: `1px dashed ${B.border}` }}>
                    <p style={{ color: B.muted, margin: 0 }}>A lixeira está vazia.</p>
                  </div>
                );
              }
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: B.text, fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>
                      Itens na Lixeira ({trashFlows.length})
                    </h3>
                    <button
                      onClick={() => {
                        if (window.confirm('Esvaziar a lixeira permanentemente?')) {
                          setTrashFlows([]);
                          toast.success('Lixeira limpa!');
                        }
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Esvaziar Lixeira
                    </button>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {trashFlows.map((flow) => (
                      <div
                        key={flow.id}
                        style={{
                          background: 'var(--bg-card)',
                          opacity: 0.8,
                          padding: '1.5rem',
                          borderRadius: 16,
                          border: `1px solid ${B.border}`,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{
                            padding: '3px 8px',
                            borderRadius: '20px',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: 'rgba(156, 163, 175, 0.1)',
                            color: 'var(--text-secondary)'
                          }}>
                            {getBotChannelLabel(flow.channel || '')}
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={(e) => handleRestore(e, flow)}
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: 11, fontWeight: '700' }}
                            >
                              Restaurar
                            </button>
                            <span style={{ color: B.border }}>|</span>
                            <button
                              type="button"
                              onClick={(e) => handlePermanentDelete(e, flow)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, fontWeight: '700' }}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                        <div>
                          <h3 style={{ color: B.text, margin: '4px 0 6px 0', fontSize: '1.15rem', fontWeight: '700', textDecoration: 'line-through' }}>
                            {flow.name}
                          </h3>
                          <p style={{ color: B.muted, fontSize: '0.82rem', margin: 0 }}>
                            {flow.description || 'Fluxo removido.'}
                          </p>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: B.muted, marginTop: '2px' }}>
                          Excluído recentemente
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const isFolderView = selectedSidebarItem !== 'all';
            const activeFolder = isFolderView ? mockFolders.find(f => f.id === selectedSidebarItem) : null;
            const folderFlows = isFolderView && activeFolder 
              ? currentFlows.filter(flow => activeFolder.flowIds.includes(flow.id)) 
              : currentFlows;

            if (folderFlows.length === 0) {
              return (
                <div style={{ background: 'var(--bg-card)', padding: '3rem', textAlign: 'center', borderRadius: 14, border: `1px dashed ${B.border}` }}>
                  <p style={{ color: B.muted, marginBottom: '1.5rem' }}>
                    {isFolderView ? 'Nenhum fluxo encontrado nesta pasta.' : 'Nenhum fluxo encontrado.'}
                  </p>
                  {!isFolderView && (
                    <button 
                      type="button" 
                      className="btn-primary" 
                      onClick={() => { setIsCreateModalOpen(true); setNewFlowName(''); setNewFlowChannel('whatsapp_qr'); }}
                      style={{ boxShadow: 'none' }}
                    >
                      Criar primeiro fluxo
                    </button>
                  )}
                </div>
              );
            }

            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {isFolderView && activeFolder && (
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ color: B.text, fontSize: '1.2rem', fontWeight: '800', margin: '0 0 4px 0' }}>
                      📁 {activeFolder.name}
                    </h3>
                    <p style={{ color: B.muted, fontSize: '0.85rem', margin: 0 }}>
                      {activeFolder.description}
                    </p>
                  </div>
                )}
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {folderFlows.map((flow) => (
                    <div
                      key={flow.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/bot-builder/${flow.id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/bot-builder/${flow.id}`)}
                      style={{
                        background: 'var(--bg-card)',
                        boxShadow: 'none',
                        padding: '1.5rem',
                        borderRadius: 16,
                        border: `1px solid ${B.border}`,
                        cursor: 'pointer',
                        transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        position: 'relative'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = B.border; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{
                          padding: '3px 8px',
                          borderRadius: '20px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          background: (flow.channel || '').includes('whatsapp') ? 'rgba(168, 85, 247, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                          color: (flow.channel || '').includes('whatsapp') ? 'var(--accent-primary)' : '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                          </svg>
                          {getBotChannelLabel(flow.channel || '')}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, flow)}
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 11, fontWeight: '600', boxShadow: 'none', padding: 0, borderRadius: 0 }}
                          onMouseOver={(e) => e.currentTarget.style.color = '#dc2626'}
                          onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
                        >
                          Excluir
                        </button>
                      </div>
                      <div>
                        <h3 style={{ color: B.text, margin: '4px 0 6px 0', fontSize: '1.15rem', fontWeight: '700' }}>
                          {flow.name}
                        </h3>
                        <p style={{ color: B.muted, fontSize: '0.82rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.4' }}>
                          {flow.description || 'Nenhuma descrição fornecida.'}
                        </p>
                      </div>
                      {flow.trigger && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: B.muted }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#eab308' }}>
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                          </svg>
                          <span>{flow.trigger}</span>
                        </div>
                      )}
                      <hr style={{ border: 'none', borderTop: `1px solid ${B.border}`, margin: '4px 0' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}>
                          <span style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: flow.isActive ? '#10b981' : '#9ca3af',
                            display: 'inline-block'
                          }} />
                          <span style={{ color: flow.isActive ? '#10b981' : B.muted, fontWeight: '600' }}>
                            {flow.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: B.muted }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Nós no fluxo">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                              <line x1="9" y1="12" x2="15" y2="19"/><line x1="9" y1="12" x2="15" y2="5"/>
                            </svg>
                            <span>{flow.nodeCount}</span>
                          </div>
                          {flow.stats && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Mensagens enviadas | Conversão">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                              </svg>
                              <span>{flow.stats.sent} ({flow.stats.conv})</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: B.muted, marginTop: '2px' }}>
                        <span>{flow.updatedAt || 'Atualizado recentemente'}</span>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>Conectar / testar →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {isCreateModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(3, 7, 18, 0.4)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${B.border}`,
              padding: '2.5rem',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '90%',
              position: 'relative',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                padding: '6px',
                boxShadow: 'none',
                borderRadius: 0,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                opacity: 0.7,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 0.7}
            >
              ✕
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-primary)', flexShrink: 0
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <path d="M12 7v4"/>
                  <line x1="8" y1="16" x2="8" y2="16"/>
                  <line x1="16" y1="16" x2="16" y2="16"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-0.01em' }}>Novo fluxo</h2>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Configure os detalhes do seu bot de automação</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {BOT_CHANNELS.map((opt) => {
                const isSelected = newFlowChannel === opt.id;
                const iconColor = opt.disabled ? 'var(--text-tertiary)' : (isSelected ? 'var(--accent-primary)' : 'var(--text-secondary)');
                
                return (
                  <div
                    key={opt.id}
                    onClick={() => !opt.disabled && setNewFlowChannel(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                      background: isSelected ? 'rgba(168, 85, 247, 0.03)' : 'transparent',
                      borderRadius: '12px',
                      cursor: opt.disabled ? 'not-allowed' : 'pointer',
                      opacity: opt.disabled ? 0.55 : 1,
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!opt.disabled && !isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.01)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!opt.disabled && !isSelected) {
                        e.currentTarget.style.borderColor = 'var(--border-glass)';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '8px',
                      background: isSelected ? 'rgba(168, 85, 247, 0.1)' : 'rgba(107, 114, 128, 0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: iconColor, flexShrink: 0
                    }}>
                      {opt.id === 'whatsapp_qr' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                      )}
                      {opt.id === 'whatsapp_api' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="4"/>
                          <path d="M12 8v8M8 12h8"/>
                        </svg>
                      )}
                      {opt.id === 'telegram' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                        </svg>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: '700' }}>
                          {opt.label}
                        </span>
                        {opt.disabled && (
                          <span style={{
                            fontSize: '0.62rem', fontWeight: '800', background: 'var(--border-glass)',
                            color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px',
                            textTransform: 'uppercase', letterSpacing: '0.03em'
                          }}>
                            Breve
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        {opt.description}
                      </span>
                    </div>

                    {isSelected && (
                      <div style={{
                        background: 'var(--accent-primary)',
                        color: '#FFFFFF',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '8px', textTransform: 'uppercase' }}>
                Nome do fluxo
              </label>
              <input
                type="text"
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder="Ex: Qualificação de Leads de Vendas"
                maxLength={150}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  background: 'transparent',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  color: 'var(--text-primary)',
                  boxSizing: 'border-box',
                  outline: 'none',
                  fontSize: '0.92rem',
                  transition: 'all 0.22s ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(168, 85, 247, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-glass)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, boxShadow: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: '700' }}
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, boxShadow: 'none', borderRadius: 10, padding: '12px 16px', fontWeight: '700' }}
                disabled={isSavingFlow || !newFlowName.trim()}
                onClick={handleCreateFlow}
              >
                {isSavingFlow ? 'Criando...' : 'Criar fluxo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
