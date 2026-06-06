import { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const ImageNode = memo(({ id, data, selected }) => {
  const { updateNodeData, setNodes, setEdges } = useReactFlow();

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  return (
    <div className="bot-node" style={{ border: '2px solid #22c55e', boxShadow: selected ? '0 0 0 2px #E5E7EB, 0 0 0 4px #22c55e' : 'none', transition: 'box-shadow 0.2s' }}>
      <div className="bot-node-header" style={{ background: 'rgba(34,197,94,0.15)', color: '#86efac', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Imagem</span>
        <button onClick={handleDelete} title="Excluir nó" className="nodrag" style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 4px', fontSize: 14 }}>
          ✕
        </button>
      </div>
      <div className="bot-node-body nodrag">
        <div className="field">
          <label htmlFor={`img-${id}`}>URL da imagem</label>
          <input
            id={`img-${id}`}
            placeholder="https://..."
            value={data.imageUrl || ''}
            onChange={(e) => updateNodeData(id, { imageUrl: e.target.value })}
          />
        </div>
      </div>
      <Handle type="target" position={Position.Top} style={{ background: '#22c55e' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#22c55e' }} />
    </div>
  );
});
ImageNode.displayName = 'ImageNode';
