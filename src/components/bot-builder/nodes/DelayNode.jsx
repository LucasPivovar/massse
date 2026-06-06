import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const DelayNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #f97316', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #f97316' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(249,115,22,0.15)', color: '#fdba74', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Delay</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`delay-${id}`}>Tempo (segundos)</label>
          <input
            id={`delay-${id}`}
            type="number"
            min="0"
            placeholder="5"
            value={data.delayTime || ''}
            onChange={(e) => updateNodeData(id, { delayTime: e.target.value })}
          />
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#f97316' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#f97316' }} />
    </div>
  );
});
DelayNode.displayName = 'DelayNode';
