import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const B = {
  lime:      'var(--accent-primary)',
  limeAlpha: 'rgba(168, 85, 247,0.1)', 
  green:     'var(--accent-secondary)',
  text:      'var(--text-primary)',
  muted:     'var(--text-secondary)',
  subtle:    'var(--text-tertiary)',
  border:    'var(--border-glass)',
  borderHov: 'var(--accent-primary)'
};

const Chat = ({ token }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Twilio Templates
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateSid, setSelectedTemplateSid] = useState('');
  const [templateVariables, setTemplateVariables] = useState({});
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const messagesEndRef = useRef(null);

  // Fetch Twilio Campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const mockCampaigns = [
          { id: 1, name: 'Campanha Teste Chat', twilio_account_name: 'Twilio Principal', twilio_account_id: 123 }
        ];
        setCampaigns(mockCampaigns);
        if (mockCampaigns.length > 0) {
          setSelectedCampaignId(mockCampaigns[0].id);
        }
      } catch (err) {
        console.error('Error loading campaigns:', err);
        setCampaigns([]);
      } finally {
        setLoadingCampaigns(false);
      }
    };
    fetchCampaigns();
  }, [token]);

  // Fetch Conversations when selectedCampaignId changes
  useEffect(() => {
    if (!selectedCampaignId) {
      setConversations([]);
      setSelectedConversation(null);
      return;
    }

    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const mockConversations = [
          { sid: 'CH123', clientPhone: 'whatsapp:+5511999999999', createdAt: new Date().toISOString() },
          { sid: 'CH124', clientPhone: 'whatsapp:+5511888888888', createdAt: new Date(Date.now() - 3600000).toISOString() }
        ];
        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setSelectedConversation(mockConversations[0]);
        } else {
          setSelectedConversation(null);
        }
      } catch (err) {
        console.error('Error loading conversations:', err);
        setConversations([]);
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
    
    // Load Twilio templates for the selected campaign's Twilio account
    const loadTemplates = async () => {
      const camp = campaigns.find(c => c.id === parseInt(selectedCampaignId));
      if (!camp || !camp.twilio_account_id) return;
      
      setLoadingTemplates(true);
      try {
        const mockTemplates = [
          { sid: 'HX123', friendly_name: 'Reengajamento Padrão', types: { 'twilio/text': { body: 'Olá {{1}}, como podemos ajudar hoje?' } } }
        ];
        setTemplates(mockTemplates);
      } catch (err) {
        console.error('Error loading templates:', err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    loadTemplates();

  }, [selectedCampaignId, token, campaigns]);

  // Fetch messages for the selected conversation
  const fetchMessages = async () => {
    if (!selectedConversation || !selectedCampaignId) return;
    try {
      const mockMessages = [
        { sid: 'MS1', author: 'whatsapp:+14155238886', body: 'Olá, esta é uma mensagem de teste.', date_created: new Date(Date.now() - 7200000).toISOString(), content_sid: 'HX123' },
        { sid: 'MS2', author: selectedConversation.clientPhone, body: 'Obrigado!', date_created: new Date(Date.now() - 3600000).toISOString() },
        { sid: 'MS3', author: 'whatsapp:+14155238886', body: 'Como posso ajudar?', date_created: new Date(Date.now() - 1800000).toISOString() }
      ];
      setMessages(mockMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }

    setLoadingMessages(true);
    fetchMessages().finally(() => setLoadingMessages(false));

    // Poll for new messages every 8 seconds
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);

  }, [selectedConversation, selectedCampaignId, token]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Determine WhatsApp 24-hour window status
  const getWindowStatus = () => {
    if (!selectedConversation || messages.length === 0) {
      return { active: false, timeString: 'Aguardando interação do cliente...' };
    }
    
    const clientPhone = selectedConversation.clientPhone;
    
    // Filter messages authored by the client
    const clientMessages = messages.filter(m => m.author === clientPhone);
    if (clientMessages.length === 0) {
      return { active: false, timeString: 'Nenhuma resposta recebida do cliente ainda.' };
    }

    const lastMsg = clientMessages[clientMessages.length - 1];
    const lastTime = new Date(lastMsg.date_created).getTime();
    const diff = Date.now() - lastTime;
    const hours24 = 24 * 60 * 60 * 1000;

    if (diff >= hours24) {
      return { active: false, timeString: 'Expirada (Re-engajamento via Template obrigatório)' };
    }

    const remainingMs = hours24 - diff;
    const hours = Math.floor(remainingMs / (60 * 60 * 1000));
    const mins = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));
    return { active: true, timeString: `Ativa (${hours}h ${mins}m restantes)` };
  };

  const windowStatus = getWindowStatus();

  // Send a free-form message
  const handleSendFreeForm = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    const payload = {
      campaignId: selectedCampaignId,
      conversationSid: selectedConversation.sid,
      serviceSid: selectedConversation.serviceSid || undefined,
      body: newMessage
    };

    try {
      await axios.post(`${API_BASE}/api/twilio/chat/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao enviar mensagem.');
    }
  };

  // Scan dynamic variables from selected template body
  const getSelectedTemplateVariables = () => {
    const t = templates.find(temp => temp.sid === selectedTemplateSid);
    if (!t) return [];
    
    // Content API variables are typically inside body/text fields
    let bodyText = '';
    if (t.types) {
      const typeKey = Object.keys(t.types)[0];
      bodyText = t.types[typeKey]?.body || '';
    }

    const regex = /\{\{(\d+)\}\}/g;
    const vars = [];
    let match;
    while ((match = regex.exec(bodyText)) !== null) {
      if (!vars.includes(match[1])) {
        vars.push(match[1]);
      }
    }
    return vars.sort((a, b) => parseInt(a) - parseInt(b));
  };

  const currentTemplateVars = getSelectedTemplateVariables();

  // Send a template message
  const handleSendTemplate = async (e) => {
    e.preventDefault();
    if (!selectedTemplateSid || !selectedConversation) return;

    const payload = {
      campaignId: selectedCampaignId,
      conversationSid: selectedConversation.sid,
      serviceSid: selectedConversation.serviceSid || undefined,
      contentSid: selectedTemplateSid,
      contentVariables: templateVariables
    };

    try {
      await axios.post(`${API_BASE}/api/twilio/chat/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Template de re-engajamento enviado com sucesso!');
      setSelectedTemplateSid('');
      setTemplateVariables({});
      fetchMessages();
    } catch (err) {
      alert(err.response?.data?.message || 'Erro ao enviar template.');
    }
  };

  const getTemplatePreviewText = () => {
    const t = templates.find(temp => temp.sid === selectedTemplateSid);
    if (!t) return '';
    let bodyText = '';
    if (t.types) {
      const typeKey = Object.keys(t.types)[0];
      bodyText = t.types[typeKey]?.body || '';
    }
    
    // Replace variables with user inputs or placeholder
    let preview = bodyText;
    currentTemplateVars.forEach(v => {
      const val = templateVariables[v] || `{{${v}}}`;
      preview = preview.replace(`{{${v}}}`, val);
    });
    return preview;
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 4.5rem)', overflow: 'hidden' }}>
      
      {/* Header & Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Bate-papo WhatsApp</h1>
          <p style={{ color: B.subtle, fontSize: '0.88rem', margin: 0 }}>
            Atendimento em tempo real via Twilio Conversations API
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', color: B.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Campanha:</label>
          {loadingCampaigns ? (
            <span style={{ fontSize: '0.88rem', color: B.subtle }}>Carregando...</span>
          ) : (
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                color: B.text,
                border: '1px solid var(--border-glass)',
                padding: '0.5rem 1rem',
                borderRadius: '10px',
                outline: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {!Array.isArray(campaigns) || campaigns.length === 0 ? (
                <option value="">Nenhuma campanha Twilio</option>
              ) : (
                campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.twilio_account_name})</option>
                ))
              )}
            </select>
          )}
        </div>
      </div>

      {/* Main Chat Area Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.25rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* Sidebar: Chats List */}
        <div className="card-gradient" style={{ display: 'flex', flexDirection: 'column', borderRadius: '14px', border: '1px solid var(--border-glass)', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', background: '#F9FAFB' }}>
            <span style={{ fontSize: '0.78rem', color: B.muted, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Clientes Disponíveis</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {loadingConversations ? (
              <p style={{ color: B.subtle, fontSize: '0.88rem', padding: '1rem', textAlign: 'center' }}>Buscando chats na Twilio...</p>
            ) : !Array.isArray(conversations) || conversations.length === 0 ? (
              <p style={{ color: B.subtle, fontSize: '0.85rem', padding: '2rem 1rem', textAlign: 'center', fontStyle: 'italic' }}>
                Nenhum chat ativo encontrado para esta campanha.
              </p>
            ) : (
              conversations.map(c => {
                const isSelected = selectedConversation && selectedConversation.sid === c.sid;
                const formattedPhone = c.clientPhone.replace('whatsapp:', '');
                return (
                  <div
                    key={c.sid}
                    onClick={() => setSelectedConversation(c)}
                    style={{
                      padding: '0.9rem 1rem',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(168, 85, 247, 0.08)' : 'transparent',
                      border: isSelected ? '1px solid rgba(168, 85, 247,0.18)' : '1px solid transparent',
                      transition: 'all 0.22s ease',
                      marginBottom: '0.35rem'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isSelected ? B.lime : B.text, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>{formattedPhone}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: B.subtle }}>
                      Criado em {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat History & Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
          {selectedConversation ? (
            <>
              {/* Top Header of Active Conversation */}
              <div className="card-gradient" style={{ padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: '700' }}>
                    {selectedConversation.clientPhone.replace('whatsapp:', '')}
                  </h2>
                  <span style={{ fontSize: '0.76rem', color: B.subtle }}>SID: <code>{selectedConversation.sid}</code></span>
                </div>
                
                {/* 24h Window Badge */}
                <div style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '30px',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  border: `1px solid ${windowStatus.active ? 'rgba(168, 85, 247, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  background: windowStatus.active ? 'rgba(168, 85, 247, 0.06)' : 'rgba(239, 68, 68, 0.05)',
                  color: windowStatus.active ? B.lime : '#f87171'
                }}>
                  Janela 24h: {windowStatus.timeString}
                </div>
              </div>

              {/* Message List area */}
              <div className="card-gradient" style={{ flex: 1, borderRadius: '14px', border: '1px solid var(--border-glass)', padding: '1.25rem', display: 'flex', flexDirection: 'column', overflowY: 'auto', minHeight: 0 }}>
                {loadingMessages ? (
                  <p style={{ color: B.subtle, textAlign: 'center', marginTop: '4rem', fontSize: '0.88rem' }}>Carregando mensagens da conversa...</p>
                ) : messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '280px' }}>
                    <p style={{ color: B.subtle, fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>Nenhuma mensagem trocada ainda.</p>
                  </div>
                ) : (
                  messages.map((m, idx) => {
                    const isClient = m.author === selectedConversation.clientPhone;
                    return (
                      <div
                        key={m.sid || idx}
                        style={{
                          alignSelf: isClient ? 'flex-start' : 'flex-end',
                          maxWidth: '70%',
                          padding: '0.75rem 1.1rem',
                          borderRadius: '14px',
                          borderTopLeftRadius: isClient ? '2px' : '14px',
                          borderTopRightRadius: isClient ? '14px' : '2px',
                          background: isClient ? 'var(--bg-secondary)' : 'rgba(168, 85, 247,0.08)',
                          border: isClient ? '1px solid var(--border-glass)' : '1px solid rgba(168, 85, 247,0.18)',
                          marginBottom: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        {m.content_sid && (
                          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'var(--accent-primary)', color: 'white', fontSize: '0.6rem', padding: '1px 6px', borderRadius: '99px', fontWeight: 'bold', marginBottom: '2px' }}>
                            TWILIO TEMPLATE
                          </div>
                        )}
                        <p style={{ margin: 0, fontSize: '0.9rem', color: B.text, whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.5 }}>
                          {m.body}
                        </p>
                        <span style={{ fontSize: '0.68rem', color: B.subtle, alignSelf: 'flex-end', marginTop: '2px' }}>
                          {new Date(m.date_created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area (Dynamic depending on 24h Window) */}
              <div className="card-gradient" style={{ padding: '1rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border-glass)', flexShrink: 0 }}>
                {windowStatus.active ? (
                  /* Active 24h window: Free text input */
                  <form onSubmit={handleSendFreeForm} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Digite sua resposta de formato livre..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      style={{
                        flex: 1,
                        background: '#F3F4F6',
                        color: B.text,
                        border: '1px solid var(--border-glass)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '10px',
                        outline: 'none',
                        fontSize: '0.92rem'
                      }}
                      required
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.75rem',
                        borderRadius: '10px',
                        fontWeight: '700',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: 'none',
                        width: 'auto'
                      }}
                    >
                      Enviar
                    </button>
                  </form>
                ) : (
                  /* Closed 24h window: Re-engagement Template Picker */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#f87171', fontWeight: '700' }}>
                        ⚠️ A janela de 24 horas está expirada.
                      </p>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: B.subtle }}>
                        Para retomar contato com este lead, você deve obrigatoriamente enviar um Template pré-aprovado da Content API.
                      </p>
                    </div>

                    <form onSubmit={handleSendTemplate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                        <select
                          value={selectedTemplateSid}
                          onChange={(e) => {
                            setSelectedTemplateSid(e.target.value);
                            setTemplateVariables({});
                          }}
                          style={{
                            flex: 1,
                            background: '#F3F4F6',
                            color: B.text,
                            border: '1px solid var(--border-glass)',
                            padding: '0.65rem 1rem',
                            borderRadius: '10px',
                            outline: 'none',
                            fontWeight: '600',
                            fontSize: '0.88rem',
                            cursor: 'pointer'
                          }}
                          required
                        >
                          <option value="">Selecione um Template de Re-engajamento...</option>
                          {templates.map(t => (
                            <option key={t.sid} value={t.sid}>{t.friendly_name || t.sid}</option>
                          ))}
                        </select>
                      </div>

                      {/* Render Dynamic inputs for variables if selected */}
                      {selectedTemplateSid && currentTemplateVars.length > 0 && (
                        <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-glass)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                          {currentTemplateVars.map(v => (
                            <div key={v} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <label style={{ fontSize: '0.68rem', color: B.subtle, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Variável {`{{${v}}}`}</label>
                              <input
                                type="text"
                                placeholder={`Insira o valor para {{${v}}}`}
                                value={templateVariables[v] || ''}
                                onChange={(e) => setTemplateVariables(prev => ({ ...prev, [v]: e.target.value }))}
                                style={{
                                  background: '#F3F4F6',
                                  color: B.text,
                                  border: '1px solid var(--border-glass)',
                                  padding: '0.5rem 0.85rem',
                                  borderRadius: '8px',
                                  outline: 'none',
                                  fontSize: '0.85rem'
                                }}
                                required
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Template Preview Section */}
                      {selectedTemplateSid && (
                        <div style={{ background: 'rgba(6, 182, 212, 0.04)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
                          <span style={{ fontSize: '0.65rem', color: '#06b6d4', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '4px' }}>Pré-visualização do Template</span>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                            {getTemplatePreviewText()}
                          </p>
                        </div>
                      )}

                      {selectedTemplateSid && (
                        <button
                          type="submit"
                          style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '0.7rem 1.5rem',
                            borderRadius: '10px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: 'none',
                            width: 'fit-content',
                            alignSelf: 'flex-end'
                          }}
                        >
                          Enviar Template de Re-engajamento
                        </button>
                      )}
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card-gradient" style={{ flex: 1, borderRadius: '14px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: B.subtle, fontSize: '0.95rem', fontStyle: 'italic' }}>
                Selecione uma conversa na barra lateral para iniciar o atendimento.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Chat;
