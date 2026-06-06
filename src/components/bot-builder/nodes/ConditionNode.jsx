import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const ConditionNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #a855f7', overflow: 'visible', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #a855f7' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(168,85,247,0.15)', color: '#d8b4fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Condicional</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label>Tipo</label>
          <select
            value={data.conditionType || 'contains'}
            onChange={(e) => updateNodeData(id, { conditionType: e.target.value })}
          >
            <option value="contains">Contém</option>
            <option value="equals">É exatamente igual a</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`val-${id}`}>Valor esperado</label>
          <input
            id={`val-${id}`}
            placeholder="Ex: sim"
            value={data.conditionValue || ''}
            onChange={(e) => updateNodeData(id, { conditionValue: e.target.value })}
          />
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#a855f7' }} />
      <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%', background: '#22c55e' }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%', background: '#ef4444' }} />
    </div>
  );
});
ConditionNode.displayName = 'ConditionNode';
