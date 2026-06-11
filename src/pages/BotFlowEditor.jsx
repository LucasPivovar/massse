import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../styles/bot-builder.css';
import toast from 'react-hot-toast';
import { fetchBotFlowById, saveBotFlow } from '../lib/botFlowApi';
import BotBuilderSidebar from '../components/bot-builder/BotBuilderSidebar';
import { MessageNode } from '../components/bot-builder/nodes/MessageNode';
import { ContextNode } from '../components/bot-builder/nodes/ContextNode';
import { ConditionNode } from '../components/bot-builder/nodes/ConditionNode';
import { ImageNode } from '../components/bot-builder/nodes/ImageNode';
import { DelayNode } from '../components/bot-builder/nodes/DelayNode';
import { ButtonNode } from '../components/bot-builder/nodes/ButtonNode';
import { PollNode } from '../components/bot-builder/nodes/PollNode';
import { ShapeNode } from '../components/bot-builder/nodes/ShapeNode';
import { EmailNode } from '../components/bot-builder/nodes/EmailNode';

const nodeTypes = {
  contextNode: ContextNode,
  messageNode: MessageNode,
  conditionNode: ConditionNode,
  imageNode: ImageNode,
  buttonNode: ButtonNode,
  pollNode: PollNode,
  delayNode: DelayNode,
  shapeNode: ShapeNode,
  emailNode: EmailNode,
};

function createNodeId() {
  return `node_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeNodes(raw) {
  return (raw || []).map((n) => ({
    ...n,
    data: n.data && typeof n.data === 'object' ? { ...n.data } : {},
  }));
}

function getDefaultNodeData(type, dragInfo = {}) {
  switch (type) {
    case 'messageNode':
      return { useAi: true, message: '' };
    case 'buttonNode':
      return { message: '', buttons: [] };
    case 'pollNode':
      return { question: '', options: [] };
    case 'shapeNode':
      return { 
        shapeType: dragInfo.shapeType || 'square', 
        label: dragInfo.shapeType === 'circle' ? 'Círculo' : (dragInfo.shapeType === 'rectangle' ? 'Retângulo' : 'Quadrado'), 
        bgColor: 'rgba(168, 85, 247, 0.2)', 
        borderColor: '#a855f7', 
        textColor: '#ffffff',
        borderStyle: 'solid',
        fontSize: '14px'
      };
    case 'emailNode':
      return { to: '', subject: '', body: '' };
    default:
      return {};
  }
}

function BotFlowEditorInner() {
  const { id } = useParams();
  const flowId = Number(id);
  const navigate = useNavigate();
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [flowName, setFlowName] = useState('');
  const [flowActive, setFlowActive] = useState(true);
  const [loadingFlow, setLoadingFlow] = useState(true);

  useEffect(() => {
    if (!flowId || Number.isNaN(flowId)) {
      navigate('/bot-builder');
      return;
    }
    const loadFlow = async () => {
      const flow = await fetchBotFlowById(flowId);
      if (!flow) {
        toast.error('Fluxo não encontrado');
        navigate('/bot-builder');
        return;
      }
      setFlowName(flow.name);
      setFlowActive(flow.isActive);
      if (flow.nodes?.length) setNodes(normalizeNodes(flow.nodes));
      if (flow.edges?.length) setEdges(flow.edges);
      setLoadingFlow(false);
    };
    loadFlow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, navigate]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, id: `e-${params.source}-${params.target}-${Date.now()}` }, eds)),
    [setEdges],
  );

  const onNodesDelete = useCallback(
    (deleted) => {
      const ids = new Set(deleted.map((n) => n.id));
      setEdges((eds) => eds.filter((e) => !ids.has(e.source) && !ids.has(e.target)));
      if (deleted.length) toast.success(`${deleted.length} nó(s) removido(s)`);
    },
    [setEdges],
  );

  const onEdgesDelete = useCallback((deleted) => {
    if (deleted.length) toast.success(`${deleted.length} conexão(ões) removida(s)`);
  }, []);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter((n) => n.selected);
    const selectedEdges = edges.filter((e) => e.selected);
    if (!selectedNodes.length && !selectedEdges.length) {
      toast.error('Selecione nós ou conexões para excluir (clique + Delete)');
      return;
    }
    if (selectedNodes.length) {
      const ids = new Set(selectedNodes.map((n) => n.id));
      setNodes((nds) => nds.filter((n) => !n.selected));
      setEdges((eds) => eds.filter((e) => !ids.has(e.source) && !ids.has(e.target) && !e.selected));
    }
    if (selectedEdges.length) {
      setEdges((eds) => eds.filter((e) => !e.selected));
    }
    toast.success('Seleção removida');
  }, [nodes, edges, setNodes, setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const addNodeAtPosition = useCallback(
    (type, position, autoConnect, conditionHandle, shapeType) => {
      const newNodeId = createNodeId();
      const newNode = {
        id: newNodeId,
        type,
        position,
        data: getDefaultNodeData(type, { shapeType }),
        selected: true,
      };

      setNodes((nds) => {
        const sourceNode = autoConnect ? nds.find((n) => n.selected) : undefined;
        const nextNodes = [...nds.map((n) => ({ ...n, selected: false })), newNode];

        if (sourceNode) {
          const newEdge = {
            id: `e-${sourceNode.id}-${newNodeId}`,
            source: sourceNode.id,
            target: newNodeId,
            animated: true,
            ...(sourceNode.type === 'conditionNode' ? { sourceHandle: conditionHandle || 'true' } : {}),
          };
          setEdges((eds) => addEdge(newEdge, eds));
        }

        return nextNodes;
      });
      
      // Update selected state directly to react flow if available
      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.setNodes(nds => 
            nds.map(n => ({ ...n, selected: n.id === newNodeId }))
          );
        }, 50);
      }
    },
    [setNodes, setEdges, reactFlowInstance],
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const autoConnect = event.dataTransfer.getData('application/reactflow-autoconnect') === 'true';
      const conditionHandle = event.dataTransfer.getData('application/reactflow-conditionhandle') || 'true';
      const shapeType = event.dataTransfer.getData('application/reactflow-shapetype') || undefined;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNodeAtPosition(type, position, autoConnect, conditionHandle, shapeType);
    },
    [reactFlowInstance, addNodeAtPosition],
  );

  const handleAddNode = useCallback(
    (type, options = {}) => {
      if (!reactFlowInstance) {
        toast.error('Aguarde o editor carregar');
        return;
      }

      const newNodeId = createNodeId();

      setNodes((nds) => {
        const sourceNode = options.enabled ? nds.find((n) => n.selected) : undefined;
        let position = { x: 250, y: 100 };

        if (sourceNode) {
          position = { x: sourceNode.position.x, y: sourceNode.position.y + 150 };
        } else {
          const { x, y, zoom } = reactFlowInstance.getViewport();
          position = { x: -x / zoom + 250, y: -y / zoom + 100 };
        }

        const newNode = {
          id: newNodeId,
          type,
          position,
          data: getDefaultNodeData(type, { shapeType: options.shapeType }),
          selected: true,
        };

        if (sourceNode && options.enabled) {
          const newEdge = {
            id: `e-${sourceNode.id}-${newNodeId}`,
            source: sourceNode.id,
            target: newNodeId,
            animated: true,
            ...(sourceNode.type === 'conditionNode' ? { sourceHandle: options.conditionHandle || 'true' } : {}),
          };
          setEdges((eds) => addEdge(newEdge, eds));
        }

        return [...nds.map((n) => ({ ...n, selected: false })), newNode];
      });

      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.setNodes(nds => 
            nds.map(n => ({ ...n, selected: n.id === newNodeId }))
          );
        }, 50);
      }
    },
    [reactFlowInstance, setNodes, setEdges],
  );

  const onSave = useCallback(async () => {
    let currentNodes = nodes;
    let currentEdges = edges;
    if (reactFlowInstance) {
      currentNodes = reactFlowInstance.getNodes();
      currentEdges = reactFlowInstance.getEdges();
    }

    const ok = await saveBotFlow(flowId, {
      nodes: currentNodes,
      edges: currentEdges,
      isActive: flowActive,
    });
    if (ok) {
      toast.success('Fluxo salvo!');
      navigate('/bot-builder');
    } else {
      toast.error('Erro ao salvar');
    }
  }, [nodes, edges, flowId, flowActive, navigate, reactFlowInstance]);

  if (loadingFlow) {
    return <div style={{ padding: '2rem', color: '#9CA3AF' }}>Carregando editor...</div>;
  }

  return (
    <div className="bot-flow-editor">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(168, 85, 247,0.1)',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button type="button" className="btn-secondary" onClick={() => navigate('/bot-builder')}>
            ← Voltar
          </button>
          <h2 style={{ margin: 0, color: '#E5E5E5', fontSize: '1.25rem' }}>{flowName || 'Editor de fluxo'}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#6b7280' }}>
            {nodes.length} nós · Delete para remover seleção
          </span>
          <button type="button" className="btn-secondary" onClick={deleteSelected}>
            Excluir seleção
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#9CA3AF', fontSize: 13, cursor: 'pointer' }}>
            <input type="checkbox" checked={flowActive} onChange={(e) => setFlowActive(e.target.checked)} />
            Fluxo ativo
          </label>
          <button type="button" className="btn-primary" onClick={onSave}>
            Salvar fluxo
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }} ref={reactFlowWrapper}>
        <div className="bot-flow-canvas">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Delete', 'Backspace']}
            edgesFocusable
            nodesFocusable
            elementsSelectable
            fitView
            className="react-flow-bot-builder"
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} color="rgba(168, 85, 247,0.08)" />
          </ReactFlow>
        </div>
        <BotBuilderSidebar onAddNode={handleAddNode} />
      </div>
    </div>
  );
}

export default function BotFlowEditor() {
  return (
    <ReactFlowProvider>
      <BotFlowEditorInner />
    </ReactFlowProvider>
  );
}
