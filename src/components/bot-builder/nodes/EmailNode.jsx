import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const EmailNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #ec4899', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #ec4899' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(236,72,153,0.15)', color: '#fbcfe8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Enviar E-mail</span>
        </div>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`to-${id}`}>Destinatário (E-mail)</label>
          <input
            id={`to-${id}`}
            type="text"
            placeholder="Ex: cliente@email.com"
            value={data.to || ''}
            onChange={(e) => updateNodeData(id, { to: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={`subject-${id}`}>Assunto</label>
          <input
            id={`subject-${id}`}
            type="text"
            placeholder="Assunto do e-mail"
            value={data.subject || ''}
            onChange={(e) => updateNodeData(id, { subject: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={`body-${id}`}>Mensagem (HTML ou texto)</label>
          <textarea
            id={`body-${id}`}
            rows={4}
            placeholder="Corpo do e-mail..."
            value={data.body || ''}
            onChange={(e) => updateNodeData(id, { body: e.target.value })}
          />
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#ec4899' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#ec4899' }} />
    </div>
  );
});

EmailNode.displayName = 'EmailNode';
