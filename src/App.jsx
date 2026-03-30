import React, { useCallback, useState, useEffect, useReducer, useMemo, useRef } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,

} from '@xyflow/react';

import '@xyflow/react/dist/style.css';



// import CustomNode from './CustomNode';
import CustomNodes, { defaultColors, getNodeIcon, HandleStart } from './CustomNodeDefault.jsx';
// console.log(CustomNodes);

const { CustomNodeStart, CustomNodeEnd, CustomNodeDefault } = CustomNodes;

const DRAG_MIME_TYPE = 'application/reactflow';
const NODE_LIBRARY = [
  { type: 'sourceDataset', label: '数据源', description: '请选择输入数据集' },
  { type: 'mysqlTableSource', label: 'MySQL数据源', description: 'MySQL数据库表数据源' },
  { type: 'mongoCollectionSource', label: 'MongoDB数据源', description: 'MongoDB集合数据源' },
  { type: 'fileSource', label: 'Excel文件数据源', description: 'Excel文件数据源' },
  { type: 'nlpProcess', label: 'NLP模型', description: '文本字段智能处理' },
  { type: 'fieldTransform', label: '字段转换', description: '规则映射配置' },
  { type: 'validateProcess', label: '数据校验', description: '数据校验处理' },
  { type: 'targetDataset', label: '输出目标字段', description: '选择输出数据集' },
  { type: 'mysqlTableTarget', label: 'MySQL目标表', description: 'MySQL数据库表存储' },
  { type: 'mongoCollectionTarget', label: 'MongoDB集合存储', description: 'MongoDB集合存储' },
  { type: 'fileTarget', label: '导出Excel文件', description: '导出数据到Excel文件' },
  { type: 'scriptProcess', label: '脚本执行', description: '执行自定义脚本' },
  { type: 'ifElseProcess', label: '条件分支', description: '按条件拆分流程' },
  { type: 'llmProcess', label: 'LLM模型', description: '大语言模型处理' },
  // { type: 'end', label: '结束', description: '流程结束节点' },
];
// 会话存储获取
// console.log(sessionStorage.getItem('user'), 'sessionStorage.getItem(token)');
// console.log(location.href, 'location.href',location);


// import ConnectionLine from './ConnectionLine';
import { Form, Modal, Button, List, Space, Tooltip, Timeline, Descriptions, Tag, Card, Spin } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';

const initialNodes = [

  // {
  //   id: 'start',
  //   type: 'start',
  //   data: { 
  //     label: '开始',
  //     },
  //   position: { x: 0, y: 5 },
  // }
];
 
const initialEdges = [

];
// CustomEdge component moved from CustomEdge.jsx
const DEFAULT_EDGE_COLOR = '#94A3B8';
const ACTIVE_EDGE_COLOR = '#1677ff';


import { api } from './api.js';
import NodeConfigDrawer from './NodeConfigDrawer.jsx';
import {
  buildFlowSubmitPayload,
  buildNodeRequestPayload,
  dedupeEdges,
  findTreePath,
  getFlowId,
  getUpstreamNodeIds,
  normalizeFlowDetail,
} from './flowHelpers.js';


// nodeTypes will be defined inside the component so we can pass runtime callbacks


  function CustomEdge(props) {
    const { id, sourceX, sourceY, targetX, targetY, selected } = props;
    
    const { setEdges, setNodes, getEdges, getNodes } = useReactFlow();
    const [isOpen, setIsOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const hoverTimeoutRef = useRef(null);


    // console.log('--------CustomEdge:', props);

    const handleEdgeOpen = (open) => {
      setIsOpen(open);
      setHovered(open);
      if (open) {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
      }
    };
    
    const [path, labelX, labelY] = getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      sourcePosition: props.sourcePosition,
      targetX: props.targetX,
      targetY: props.targetY,
      targetPosition: props.targetPosition,
    });

    const highlighted = props.data?.highlighted;
    const edgeColor = (selected || highlighted) ? ACTIVE_EDGE_COLOR : DEFAULT_EDGE_COLOR;

    const midX = ((sourceX || 0) + (targetX || 0)) / 2 - 75;
    const midY = ((sourceY || 0) + (targetY || 0)) / 2 - 25;

    const handleAddNode = async (sourceNode, newNodeType) => {
      // 获取最新的节点列表
      const currentNodes = getNodes();
      console.log('sourceNode, props.source, props.target:', sourceNode, props.source, props.target, currentNodes);
      
      // 获取起始节点（通过 id 或 nodeId 比较）
      const startNode = currentNodes.find(node => node.id === props.source || node.data?.nodeId === props.source);
      console.log('startNode:', startNode);
      
      // 获取结束节点（通过 id 或 nodeId 比较）
      const targetNode = currentNodes.find(node => node.id === props.target || node.data?.nodeId === props.target);
      console.log('targetNode:', targetNode);
      
      // 生成新节点的位置（使用结束节点的位置）
      const newNodePosition = {
        x: targetNode?.position?.x || 300,
        y: targetNode?.position?.y || 100
      };
      
      // 生成新节点对象
      const newNode = {
        id: `node-${Date.now()}`,
        type: newNodeType,
        data: { label: getNodeLabel(newNodeType) },
        position: newNodePosition
      };
      
      // 调用 addNode 函数创建节点（不传递 sourceNodeId，因为我们会手动创建边）
      await addNode(newNode, null);
      
      // 特殊处理：断开当前链接线，创建新的链接关系
      setEdges((es) => {
        // 过滤掉原有边
        const others = es.filter((e) => e.id !== id);
        
        // 创建从起始节点到新节点的边
        const edgeA = { id: `${props.source}->${newNode.id}`, source: props.source, target: newNode.id, type: 'custom-edge', data: props.data };
        
        // 创建从新节点到目标节点的边
        const edgeB = { id: `${newNode.id}->${props.target}`, source: newNode.id, target: props.target, type: 'custom-edge', data: props.data };
        
        const updatedEdges = others.concat(edgeA, edgeB);
        
        // 保存流程：在边更新后，构建提交负载并调用保存接口
        try {
          const saveData = {
            flowId: currentFlowId,
            nodes: getNodes(),
            edges: updatedEdges
          };
          console.log('Saving flow after edge update:', saveData);
          // 这里应该调用保存接口，例如：api.saveFlow(saveData);
        } catch (err) {
          console.error('Save flow failed:', err);
        }
        
        return updatedEdges;
      });
      
      // 将与新增节点后续所有有关联的节点统一往后移动
      const moveOffset = 300; // 移动距离
      
      // 找出所有与新增节点后续有关联的节点
      const getConnectedNodes = (nodeId) => {
        const connected = new Set();
        const queue = [nodeId];
        
        while (queue.length > 0) {
          const currentId = queue.shift();
          if (connected.has(currentId)) continue;
          
          connected.add(currentId);
          
          // 找出所有以当前节点为源的边
          const outgoingEdges = getEdges().filter(e => e.source === currentId);
          outgoingEdges.forEach(edge => {
            queue.push(edge.target);
          });
        }
        
        return Array.from(connected);
      };
      
      // 获取所有需要移动的节点 ID（从目标节点开始）
      const nodesToMove = getConnectedNodes(props.target);
      
      // 移动节点
      setNodes((nds) => {
        const updatedNodes = nds.map(node => {
          if (nodesToMove.includes(node.id)) {
            return {
              ...node,
              position: {
                x: (node.position?.x || 0) + moveOffset,
                y: node.position?.y || 0
              }
            };
          }
          return node;
        });
        
        // 保存流程：在节点更新后，构建提交负载并调用保存接口
        try {
          const saveData = {
            flowId: currentFlowId,
            nodes: updatedNodes,
            edges: getEdges()
          };
          console.log('Saving flow after node move:', saveData);
          // 这里应该调用保存接口，例如：api.saveFlow(saveData);
        } catch (err) {
          console.error('Save flow failed:', err);
        }
        
        return updatedNodes;
      });
    };
    
    // 根据节点类型获取节点标签
    const getNodeLabel = (type) => {
      const labelMap = {
        sourceDataset: '数据源',
        mysqlTableSource: 'MySQL数据源',
        mongoCollectionSource: 'MongoDB数据源',
        fileSource: 'Excel文件数据源',
        nlpProcess: 'NLP模型',
        fieldTransform: '字段转换',
        validateProcess: '数据校验',
        targetDataset: '输出目标字段',
        mysqlTableTarget: 'MySQL目标表',
        mongoCollectionTarget: 'MongoDB集合存储',
        fileTarget: '导出Excel文件',
        scriptProcess: '脚本执行',
        ifElseProcess: '条件分支',
        llmProcess: 'LLM模型'
      };
      return labelMap[type] || '节点';
    };

    const nodeTypes = [
  { type: 'process', label: '处理节点', color: '#ff7875' },
  { type: 'decision', label: '判断节点', color: '#69c0ff' },
  { type: 'output', label: '输出节点', color: '#95de64' },
];

    const content = (
    <Space direction="vertical" size="small">
      <div style={{ fontWeight: 500, marginBottom: 4 }}>添加节点</div>
      {nodeTypes.map((node) => (
        <Button
          key={node.type}
          size="small"
          style={{ width: '100%', textAlign: 'left' }}
          onClick={() => handleAddNode(node.type, node.color, node.label)}
        >
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: node.type === 'decision' ? '50%' : 2,
              background: node.color,
              marginRight: 8,
            }}
          />
          {node.label}
        </Button>
      ))}
    </Space>
  );

    return (
      <g
        // onMouseEnter={() => {
        //   console.log('------onMouseEnter---------');
          
        //   if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
        //   setHovered(true);
        // }}
        // onMouseLeave={() => {
        //   console.log('------onMouseLeave---------');

        //   if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
        //   hoverTimeoutRef.current = setTimeout(() => { !isOpen && setHovered(false); hoverTimeoutRef.current = null; }, 350);
        // }}
      >
        <BaseEdge
          path={path}
          {...props}
          style={{
            stroke: edgeColor,
            strokeWidth: (selected || highlighted) ? 2.2 : 1.8,
          }}
        />
        <g pointerEvents="none" opacity={selected || highlighted ? 1 : 0.8}>
          <path
            d="M -8 -5 L 0 0 L -8 5"
            fill="none"
            stroke={edgeColor}
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <animateMotion
              dur="1.6s"
              path={path}
              repeatCount="indefinite"
              rotate="auto"
            />
          </path>
        </g>
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan nopanc"
          >
            <div className={`edge-handle ${ selected || hovered || isOpen ? 'edge-handle--visible' : ''}`}>
              <Tooltip  
            open={hovered}
            onOpenChange={setHovered}
            trigger="click"
            placement="top"
            title={content}
            color="#fff"
            overlayInnerStyle={{ color: '#333' }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: hovered ? '#1890ff' : '#fff',
                border: '2px solid #1890ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 'bold',
                color: hovered ? '#fff' : '#1890ff',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!hovered) {
                  e.currentTarget.style.background = '#1890ff';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (!hovered) {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.color = '#1890ff';
                }
              }}
            >
              +
            </div>
          </Tooltip>
              {/* <HandleStart
                {...props}
                isEdge={true}
                id={props.source}
                edgeFn={handleEdgeOpen}
                data={{}}
                positionAbsoluteX={midX}
                positionAbsoluteY={midY}
                onAddNode={handleAddNode}
              /> */}
            </div>
          </div>
        </EdgeLabelRenderer>
      </g>
    );
  }

const edgeTypes = {
  'custom-edge': CustomEdge,
}


function ConnectionLineFlow () {
    // 
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [apiNpl, setApiNpl] = useState(null);

  // 数据集相关状态
  const [dataSetOptions, setDataSetOptions] = useReducer((state, action) => {
    console.log('dataSetOptions:',state, action);
    return action.list || [];
  }, []);
  const [tableData, setTableData] = useState([]);
  const [tableTag, setTableTag] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [selectedDataSetId, setSelectedDataSetId] = useState(null);

  const reactFlowRef = React.useRef(true);
  const reactFlowWrapperRef = React.useRef(null);
  const reactFlowInstanceRef = React.useRef(null);

  const [tableSelect, setTableSelect] = useState([]);

  const [dict, setDict] = useState([])
  const [flowDetail, setFlowDetail] = useState(null);
  const [dataSourceList, setDataSourceList] = useState([]);
  const [dataSourceTableFields, setDataSourceTableFields] = useState([]);

  const [code, setCode] = useState('');

  const flowId = useMemo(() => getFlowId(), []);
  const currentFlowId = flowDetail?.flowId || flowId;


 




  // API调用函数
  const fetchApiData = async () => {
    // try {
    //   // const data = await api.getTodos(1);
    //   // setApiData(data);
    //   // console.log('API数据:', data);
    // } catch (error) {
    //   console.error('API调用错误:', error);
    // }

    // 获取NPL
    try {
      const data = await api.getNplList();
      setApiNpl(data?.data?.map(i => ({value: i.name, label: i.text, ...i})) || []);
      console.log('API数据:', data);
    } catch (error) {
      console.error('API调用错误:', error);
    }

    api.getDict({"dictCode": "DATA_TYPE","itemStatus": 1}).then(res => setDict(res.data || []))

    
  };
 // 组件挂载时获取数据集选项
  useEffect(() => {
    if(reactFlowRef.current) {
      fetchApiData();
      fetchDataSetOptions();
      // 加载数据源列表
      fetchDataSourceList();
      reactFlowRef.current = false;
    }
  }, []);
  
  // 获取数据源列表
  const fetchDataSourceList = async () => {
    try {
      // 加载MySQL数据源
      const mysqlResponse = await api.getDataSourcePage({
        pageArg: { currentPage: 1, pageSize: 99999 },
        query: {  }
        // query: { dbType: 1 }
      });
      
      // 加载MongoDB数据源
      // const mongoResponse = await api.getDataSourcePage({
      //   pageArg: { currentPage: 1, pageSize: 99999 },
      //   query: { dbType: 3 }
      // });
      
      // 合并数据源列表
      const combinedList = [
        ...(mysqlResponse?.data?.pageRecords || []),
        // ...(mongoResponse?.data?.pageRecords || [])
      ];
      
      setDataSourceList(combinedList);
    } catch (error) {
      console.error('获取数据源列表失败:', error);
    }
  };

  // 获取数据集选项
  const fetchDataSetOptions = async () => {
    try {
      if(flowId){
        const response = await api.getFlowDetail({ flowId });
        const data = response.data || {};

        setFlowDetail(data || {});

        try {
          const normalizedFlow = normalizeFlowDetail(data);
          setNodes(normalizedFlow.nodes);
          setEdges(() => dedupeEdges(normalizedFlow.edges));
        } catch (error) {
          console.error('Error processing flow detail:', error);
        }
      } else {
        const response = {
          "code": 20000,
          "data": {
              "flowId": 61,
              "flowCode": "666",
              "flowName": "666",
              "flowDesc": "",
              "batchSize": 1000,
              "execType": 2,
              "config": "{\"nodes\":[{\"posX\":300,\"outputFields\":\"[]\",\"posY\":5,\"nodeType\":\"start\",\"nodeId\":337,\"flowId\":61},{\"posX\":729,\"outputFields\":[],\"posY\":22,\"nodeType\":\"ifElseProcess\",\"nodeId\":419,\"flowId\":61,\"config\":\"{\\\"branches\\\":[{\\\"condition\\\":\\\"\\\",\\\"label\\\":\\\"IF\\\"},{\\\"condition\\\":\\\"\\\",\\\"label\\\":\\\"ELSE IF\\\"}]}\"},{\"posX\":143,\"outputFields\":[],\"posY\":152,\"nodeType\":\"sourceDataset\",\"nodeId\":441,\"flowId\":61,\"config\":\"{}\"},{\"posX\":424,\"outputFields\":[],\"posY\":152,\"nodeType\":\"sourceDataset\",\"nodeId\":443,\"flowId\":61,\"config\":\"{}\"},{\"posX\":324.1666660308838,\"outputFields\":[],\"posY\":154.33334350585938,\"nodeType\":\"sourceDataset\",\"nodeId\":445,\"config\":\"{}\"}],\"edges\":[{\"source\":337,\"target\":441},{\"source\":443,\"target\":419},{\"source\":441,\"target\":445},{\"source\":445,\"target\":443}]}",
              "publishStatus": 1,
              "status": 1,
              "statusName": "启用",
              "execStatus": 1,
              "execStatusName": "未执行",
              "nodes": [
                  {
                      "nodeId": 337,
                      "flowId": 61,
                      "nodeCode": "START",
                      "nodeName": "开始",
                      "nodeType": "start",
                      "nodeOrder": 0,
                      "posX": 300,
                      "posY": 5,
                      "status": 1
                  },
                  {
                      "nodeId": 419,
                      "flowId": 61,
                      "nodeName": "条件分支",
                      "nodeType": "ifElseProcess",
                      "nodeOrder": 0,
                      "config": "{\"branches\":[{\"condition\":\"\"},{\"condition\":\"\"}]}",
                      "outputFields": "[]",
                      "outputFieldList": [],
                      "posX": 729,
                      "posY": 22,
                      "status": 1
                  },
                  {
                      "nodeId": 441,
                      "flowId": 61,
                      "nodeName": "数据源",
                      "nodeType": "sourceDataset",
                      "nodeOrder": 0,
                      "config": "{}",
                      "outputFields": "[]",
                      "outputFieldList": [],
                      "posX": 143,
                      "posY": 152,
                      "status": 1
                  },
                  {
                      "nodeId": 443,
                      "flowId": 61,
                      "nodeName": "数据源1",
                      "nodeType": "sourceDataset",
                      "nodeOrder": 0,
                      "config": "{}",
                      "outputFields": "[]",
                      "outputFieldList": [],
                      "posX": 424,
                      "posY": 152,
                      "status": 1
                  }
              ]
          },
          "rspCode": "DONE",
          "success": true,
          "traceId": "2036269981930795009"
        }

        const data = response.data || {};

        setFlowDetail(data || {});

        try {
          const normalizedFlow = normalizeFlowDetail(data);
          setNodes(normalizedFlow.nodes);
          setEdges(() => dedupeEdges(normalizedFlow.edges));
        } catch (error) {
          console.error('Error processing flow detail:', error);
        }
      }
      
      const data = await api.getDataSetTree(1); // projId
      console.log('数据集选项:',  data);

      // 递归处理树形数据
      const processTreeData = (items) => {
        return items.map(item => {
          const processedItem = {
            value: item.id,
            label: item.name || item.label,
          };

          // 如果有子项，递归处理
          if (item.children && item.children.length > 0) {
            processedItem.children = processTreeData(item.children);
          } else {
            // children 中为空的设置成 undefined
            processedItem.children = undefined;
            processedItem.disabled = item.treeType !== 4;

          }

          return processedItem;
        });
      };

      const options = processTreeData(data.data || []);
      
      setDataSetOptions({ list: options });
      console.log('dataSetOptions:', dataSetOptions);

    } catch (error) {
      console.error('获取数据集选项失败:', error);
    }
  };

  // 获取表格数据
  const fetchTableData = async (dataSetId, current = 1, pageSize = 10) => {
    if (!dataSetId) return;
    
    setTableLoading(true);
    try {
      const params = {
        pageArg: {
          currentPage: current,
          pageSize: pageSize,
        },
        query: {
          dataSetId: dataSetId || selectedDataSetId,
          propType: "2",
        },
      };
      const response = await api.getDataProperties(params);

      console.log('表格数据:', response);
      
      
      // 假设响应结构，调整为实际API返回格式
      setTableData(response?.data?.pageRecords || []);
      // setPagination({
      //   ...pagination,
      //   current,
      //   pageSize,
      //   total: response?.data?.totalCount || 0,
      // });
    } catch (error) {
      console.error('获取表格数据失败:', error);
      setTableData([]);
    } finally {
      setTableLoading(false);
    }
  };

 

  const [form] = Form.useForm();

  const [forms] = Form.useForm();

  const ruleType = Form.useWatch('ruleType', form);

  const onNodesChange = useCallback((changes) => {
    const filteredChanges = changes.filter(change => {
      if (change.type === 'remove') {
        if (drawerOpen) {
          console.log('Cannot delete while drawer is open');
          return false;
        }
        const nodeToRemove = nodes.find(n => n.id === change.id);
        if (nodeToRemove && nodeToRemove.type === 'start') {
          console.log('Cannot delete start node');
          return false;
        }
      }
      return true;
    });
    setNodes((nds) => applyNodeChanges(filteredChanges, nds));
  }, [nodes, drawerOpen]);

  const onEdgesChange = useCallback(async (changes) => {
    const filteredChanges = changes.filter(change => {
      if (change.type === 'remove' && drawerOpen) {
        console.log('Cannot delete edges while drawer is open');
        return false;
      }
      return true;
    });
    console.log('onEdgesChange: ', filteredChanges);
    
    // Calculate updated edges
    const updatedEdges = applyEdgeChanges(filteredChanges, edges);
    
    // Update edges state
    setEdges(updatedEdges);
    
    // Save flow after edge changes
    try {
      const flowData = buildFlowSubmitPayload({
        nodes,
        edges: updatedEdges,
        flowId: currentFlowId,
      });
      console.log('Saving flow after edge changes:', flowData);
      await api.flowUpdate(flowData);
    } catch (error) {
      console.error('Error saving flow after edge changes:', error);
    }
  }, [drawerOpen, nodes, edges, currentFlowId]);

  const addNode = React.useCallback(async (node, sourceNodeId, nodes2) => {
    // compute id and position (same logic as before)
    const id = node.id || `node-${Date.now()}`;
    const offset = 120; // vertical shift when collision (changed from 80 to 120)
    const tolerance = 48; // consider nodes colliding within this px
    const nodeWidth = 180; // Node width including padding
    const currentNodes = nodes2 || nodes;

    // starting position
    let startPos;
    if (sourceNodeId) {
      // If adding node from another node, position it to the right of current node
      const sourceNode = currentNodes.find(n => n.id === sourceNodeId || n.data?.nodeId === sourceNodeId) ;
      console.log('sourceNode:', sourceNode, currentNodes);
      
      if (sourceNode) {
        startPos = { 
          x: (sourceNode.position?.x ?? 300) + nodeWidth + 120, // Current node position + node width + 120px
          y: sourceNode.position?.y ?? 100 // Same y position as current node
        };
      } else {
        startPos = { x: 300, y: 100 };
      }
    } else {
      startPos = node.position ? { x: node.position.x ?? 300, y: node.position.y ?? 100 } : { x: 300, y: 100 };
    }


    console.log('sourceNodeId:', sourceNodeId, startPos);
    


    const isOverlap = (p) => currentNodes.some((n) => {
      const nx = n.position?.x ?? 0;
      const ny = n.position?.y ?? 0;
      return Math.abs(nx - p.x) < tolerance && Math.abs(ny - p.y) < tolerance;
    });

    let pos = { ...startPos };
    let tries = 0;
    // shift down until no overlap (limit tries to avoid infinite loop)
    while (isOverlap(pos) && tries < 50) {
      pos.y += offset;
      tries += 1;
    }

    const newNode = { ...node, id, position: pos };

    // build httpData consistent with onFinish
    const httpData = {
      flowId: currentFlowId,
      nodeType: newNode.type || (newNode.data && newNode.data.type) || undefined,
      nodeName: newNode.data?.label || newNode.data?.name || '节点',
      config: newNode.data?.config || (newNode.data?.custom ? { mdmDataSetId: newNode.data.custom[newNode.data.custom.length - 1] } : {}),
      outputFields: newNode.data?.outputFields || [],
      posX: newNode.position?.x ?? 300,
      posY: newNode.position?.y ?? 100,
    };
    console.log('addNode httpData:', httpData);

    try {
      const res = await api.createNode(httpData);
      // const res = { data: { nodeId: id }};
      // attach returned nodeId if available
      newNode.data = { ...(newNode.data || {}), nodeId: res?.data?.nodeId };
    } catch (err) {
      console.error('createNode failed:', err);
    }

    // finally add node to local state
    setNodes((nds) => {
      const list = [...nds, newNode];


      // 自动关联：添加节点后自动连线
      let sourceNode = null;
      if (sourceNodeId) {
        sourceNode = list.find(n => n.id === sourceNodeId) || null;
        
        console.log('addNode: sourceNode', sourceNode, 'newNode', newNode);
        
        if (sourceNode && sourceNode.id !== newNode.id) {
          const edgeId = `${sourceNode.id}->${newNode.id}`;
          setEdges((eds) => {
            if (eds.some((e) => e.id === edgeId)) return eds;
            const next = [...eds, { id: edgeId, source: sourceNode.id, target: newNode.id, type: 'custom-edge' }];
            console.log('addNode: adding edge', edgeId, 'current edges count:', eds.length, 'next edges count:', next.length, next);
            return next;
          });
        }
      }

      // 保存流程：在本地状态更新后，构建提交负载并调用保存接口
      try {
        const nodesNext = [...list];
        let edgesNext = edges;
        if (sourceNodeId && sourceNode && sourceNode.id !== newNode.id) {
          const maybeEdge = { id: `${sourceNode.id}->${newNode.id}`, source: sourceNode.id, target: newNode.id, type: 'custom-edge' };
          edgesNext = [...edges, maybeEdge];
        }
        console.log('addNode: persisting flow', { nodes: nodesNext.length, edges: edgesNext.length });
        // buildFlowSubmitPayload({ nodes: nodesNext, edges: edgesNext, flowId: currentFlowId });
      } catch (err) {
        console.error('addNode: persist failed', err);
      }


      return list;
    });
  }, [nodes, edges, currentFlowId]);

  const updateNode = async (id, partial) => {
    setNodes((nds) => nds.map((n) => {
      if (n.id !== id) return n;
      const next = {
        ...n,
        ...partial,
        data: { ...(n.data || {}), ...(partial.data || {}), openHandle: false, placeholder: false },
      };

      // persist update to backend if needed
      try {
        const httpData = {
          flowId: currentFlowId,
          nodeType: next.type || (next.data && next.data.type) || undefined,
          nodeName: next.data?.label || next.data?.name || '节点',
          config: next.data?.config || {},
          outputFields: next.data?.outputFields || [],
          posX: next.position.x,
          posY: next.position.y,
          nodeId: next.data?.nodeId,
        };
        const request = next.data?.nodeId ? api.updateNode : api.createNode;
        request && request(httpData).then((res) => {
          if (res?.data?.nodeId) {
            setNodes((ns) => ns.map(x => x.id === id ? { ...x, data: { ...(x.data||{}), nodeId: res.data.nodeId } } : x));
          }
        }).catch(() => {});
      } catch (err) {
        // ignore
      }

      return next;
    }));
  };

  const createNodeByType = useCallback((type, position) => {
    const libraryItem = NODE_LIBRARY.find((item) => item.type === type);
    if (!libraryItem) {
      return null;
    }

    const nextNode = {
      id: `node-${Date.now()}`,
      type,
      data: {
        label: libraryItem.label,
      },
      position,
    };

    if (type === 'ifElseProcess') {
      nextNode.data.config = {
        branches: [
          { condition: '' },
          { condition: '' },
        ],
      };
    }

    return nextNode;
  }, []);

  const handleDragStart = useCallback((event, item) => {
    event.dataTransfer.setData(DRAG_MIME_TYPE, item.type);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((event) => {
    event.preventDefault();

    const type = event.dataTransfer.getData(DRAG_MIME_TYPE);
    if (!type || !reactFlowInstanceRef.current || !reactFlowWrapperRef.current) {
      return;
    }

    const bounds = reactFlowWrapperRef.current.getBoundingClientRect();
    const position = reactFlowInstanceRef.current.screenToFlowPosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const nextNode = createNodeByType(type, position);
    if (nextNode) {
      addNode(nextNode);
    }
  }, [addNode, createNodeByType, nodes]);

  const handleInit = useCallback((instance) => {
    reactFlowInstanceRef.current = instance;
  }, []);

  const copyNode = async (pro) => {
    // 找到源节点（使用当前闭包中的 nodes 状态）
    // const src = nodes.find(n => n.id === id);
    if (!pro) return;

    const newId = `node-${Date.now()}`;
    const newNode = {
      ...pro,
      id: newId,
      position: { x: (pro.position?.x ?? 0) + 20, y: (pro.position?.y ?? 0) + 20 },
      data: { ...(pro.data || {}), label: `${(pro.data?.label || '节点')} 复制` }
    };

    try {
      // 在外部执行异步请求，避免向 setNodes 传递 async 回调
      const res = await api.createNode({ ...newNode.data, nodeId: undefined, nodeName: newNode.data?.label || '节点', posX: newNode.position.x + 120, posY: newNode.position.y  });
      newNode.data = { ...(newNode.data || {}), nodeId: res?.data?.nodeId };
    } catch (err) {
      console.error('createNode failed:', err);
    }

    // 同步地更新节点状态
    setNodes((nds) => [...nds, newNode]);
  };

  const deleteNode = ({ id, data, type, nodeId }) => {
    if (type === 'start') {
      return;
    }

    const backendNodeId = data?.nodeId || nodeId;

    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));

    setSelectedNode((currentSelectedNode) => {
      if (currentSelectedNode?.id === id) {
        setDrawerOpen(false);
        form.resetFields();
        return null;
      }

      return currentSelectedNode;
    });

    if (backendNodeId) {
      api.deleteNode({ nodeId: backendNodeId });
    }
  };

  const runNode = async (nodeId, nodeData, nodeType) => {
    console.log('Running node:', nodeId, nodeData, nodeType);
    
    // 构建运行节点的请求参数
    const runData = {
      flowId: currentFlowId,
      nodeId: nodeData?.nodeId || nodeId,
      nodeType: nodeType,
      config: nodeData?.config || {}
    };
    const nodeId2 = runData?.nodeId || runData.id || '';
    try {
      // 调用运行节点的 API
      const response = await api.runNode({nodeId: nodeId2});
      console.log('Node run response:', response);
      
      // 运行成功后查询日志
      if (response?.data) {
        // 首先调用 /etl/exec/log 获取日志列表
        const logResponse = await api.getFlowLog({
         logId: nodeId2 || response.data.nodeId || runData.nodeId
        });
        console.log('Log response:', logResponse);
        
        // 处理返回的日志数据
        if (logResponse?.data) {
          let logs = [];
          // 检查返回数据是否包含nodeExecLogs数组
          if (logResponse.data.nodeExecLogs && Array.isArray(logResponse.data.nodeExecLogs)) {
            // 使用nodeExecLogs作为日志数据
            logs = logResponse.data.nodeExecLogs;
          } else if (Array.isArray(logResponse.data)) {
            // 如果是数组，直接使用
            logs = logResponse.data;
          } else {
            // 否则包装成数组
            logs = [logResponse.data];
          }
          
          // 对每个节点日志调用 /etl/nodeExecLog/detail 获取详细信息
          const detailedLogs = await Promise.all(
            logs.map(async (log) => {
              if (log.nodeLogId) {
                try {
                  const detailResponse = await api.getNodeExecLogDetail({
                    nodeLogId: log.nodeLogId
                  });
                  return { ...log, ...detailResponse.data };
                } catch (error) {
                  console.error('获取节点执行日志详情失败:', error);
                  return log;
                }
              }
              return log;
            })
          );
          
          // 保存流程信息
          setFlowInfo(logResponse.data);
          
          // 保留logResponse中的数据，同时添加详细信息
          if (logResponse.data.nodeExecLogs) {
            // 如果有nodeExecLogs，使用详细的节点日志
            setFlowLog(detailedLogs);
          } else {
            // 否则使用整个响应数据
            setFlowLog([logResponse.data]);
          }
          // 显示日志模态框
          !logModalOpen && setLogModalOpen(true);
          console.log('logModalOpen', logModalOpen);

        }
      }
      
      // 显示运行成功的提示
      // alert('节点运行成功！');
      return response;
    } catch (error) {
      console.error('Node run failed:', error);
      // 显示运行失败的提示
      alert('节点运行失败，请检查配置！');
      throw error;
    }
  };

  // 获取流程日志
  const fetchFlowLog = async (nodeId) => {
    setLogLoading(true);
    try {
      const response = await api.getFlowLog({
        logId: nodeId // 使用nodeId作为logId
      });
      
      // 处理返回的日志数据
      if (response?.data) {
        let logs = [];
        // 检查返回数据是否包含nodeExecLogs数组
        if (response.data.nodeExecLogs && Array.isArray(response.data.nodeExecLogs)) {
          // 使用nodeExecLogs作为日志数据
          logs = response.data.nodeExecLogs;
        } else if (Array.isArray(response.data)) {
          // 如果是数组，直接使用
          logs = response.data;
        } else {
          // 否则包装成数组
          logs = [response.data];
        }
        
        // 获取每个节点的详细信息
        const detailedLogs = await Promise.all(
          logs.map(async (log) => {
            if (log.nodeLogId) {
              try {
                const detailResponse = await api.getNodeExecLogDetail({ nodeLogId: log.nodeLogId });
                return { ...log, ...detailResponse.data };
              } catch (error) {
                console.error('获取节点执行日志详情失败:', error);
                return log;
              }
            }
            return log;
          })
        );
        
        // 保存流程信息
        setFlowInfo(response.data);
        
        // 保存节点日志
        if (response.data.nodeExecLogs) {
          setFlowLog(detailedLogs);
        } else {
          setFlowLog([response.data]);
        }
      } else {
        setFlowInfo({});
        setFlowLog([]);
      }
      
      // 显示日志模态框
      !logModalOpen && setLogModalOpen(true);
      console.log('logModalOpen', logModalOpen);

    } catch (error) {
      console.error('获取流程日志失败:', error);
      alert('获取流程日志失败，请重试！');
    } finally {
      setLogLoading(false);
    }
  };

  // 打开日志模态框
  const openLogModal = (nodeId) => {
    fetchFlowLog(nodeId);
  };

  const StartWrapper = (props) => <CustomNodeStart {...props} onAddNode={addNode} type={props.type} onCopyNode={() => copyNode(props)} onDeleteNode={() => deleteNode(props)} />;

  const wrap = (Comp) => (props) => <Comp {...props}  onAddNode={addNode} onUpdateNode={updateNode} type={props.type} onCopyNode={() => copyNode(props)} onDeleteNode={() => deleteNode(props)} onRunNode={() => runNode(props.id, props.data, props.type)} onOpenLogModal={() => openLogModal(props.data?.nodeId || props.id)} />;

  const nodeTypes = useMemo(() => ( {
    // custom: wrap(CustomNode),
    start: StartWrapper,
    // LLM: wrap(CustomNodeLLM),
    end: wrap(CustomNodeEnd),
    sourceDataset: wrap(CustomNodeDefault),
    mysqlTableSource: wrap(CustomNodeDefault),
    mongoCollectionSource: wrap(CustomNodeDefault),
    fileSource: wrap(CustomNodeDefault),
    nlpProcess: wrap(CustomNodeDefault),
    fieldTransform: wrap(CustomNodeDefault),
    validateProcess: wrap(CustomNodeDefault),
    targetDataset: wrap(CustomNodeDefault),
    mysqlTableTarget: wrap(CustomNodeDefault),
    mongoCollectionTarget: wrap(CustomNodeDefault),
    fileTarget: wrap(CustomNodeDefault),
    scriptProcess: wrap(CustomNodeDefault),
    ifElseProcess: wrap(CustomNodeDefault),
    llmProcess: wrap(CustomNodeDefault),
  }), [ nodes]);

  // Memoize edgeTypes so its reference stays stable across renders.
  // Otherwise ReactFlow may treat a new object as a change and re-register edge types
  // when edges or hovered state update.


  const onConnect = useCallback(
    async (params) => {
      // Create new edge
      const newEdge = { ...params, type: 'custom-edge', id: `${params.source}->${params.target}` };

      const srcNode = nodes.find(n => n.id === params.source);
      let filtered = [];

      // 如果来源节点是 ifElseProcess 且为 branch handle（id 包含 -start-switch-），
      // 则仅清理该 ifElse 节点下其它 branch 绑定到相同 target 的旧连线，保留最新连接
      if (srcNode && srcNode.type === 'ifElseProcess' && params.sourceHandle && params.sourceHandle.indexOf('-start-switch-') !== -1) {
        filtered = edges.filter(e => e.id !== newEdge.id);
      } else {
        // 其它情况保留原有行为：移除指向相同 target 的旧连线
        filtered = edges;
      }

      // Update edges
      const updatedEdges = [...filtered, newEdge].map((e) => ({ ...e, type: e.type || 'custom-edge' }));
      setEdges(updatedEdges);

      // Save flow after edge creation
      try {
        const flowData = buildFlowSubmitPayload({
          nodes,
          edges: updatedEdges,
          flowId: currentFlowId,
        });
        console.log('Saving flow after edge creation:', flowData);
        await api.flowUpdate(flowData);
      } catch (error) {
        console.error('Error saving flow after edge creation:', error);
      }
    },
    [nodes, edges, currentFlowId]
  );

  const onNodeClick = useCallback((event, node) => {
    // 如果有当前选中的节点，保存表单值到它
    // if (selectedNode) {
      // const values = form.getFieldsValue();
      // setNodes((nds) =>
      //   nds.map((n) =>
      //     n.id === selectedNode.id ? { ...n, data: { ...n.data, ...values } } : n
      //   )
      // );
     

      
    // }else{
    //   form.resetFields();
    // }

    console.log('onNodeClick',node, selectedNode);
    
    // ifElseProcess节点点击时不显示编辑弹框
    if (node.type === 'ifElseProcess') {
      return;
    }
    
    setPreview(false)

    const custom =
      (node?.data?.flowId && node.data?.config?.mdmDataSetId && findTreePath(dataSetOptions, node.data?.config?.mdmDataSetId))
      || node.custom
      || node.data?.custom
      || ''

    setSelectedNode(r=> ({
      ...node,
      custom: custom, // 兼容已有流程数据
    }));
    

    console.log('custom:', custom);
    

    const nplIds = []
    let parent = edges.find(e => e.target === node.id)

    if(parent){

      const fn = (i) => {
        let targetId = i.target.indexOf('node-') !==-1;
        let sourceId = i.source.indexOf('node-') !==-1; 
        targetId && (targetId = nodes.find(n => n.id === i.target)?.data?.nodeId); 
        sourceId && (sourceId = nodes.find(n => n.id === i.source)?.data?.nodeId); 
        return {
          target: targetId ||  i.target, source: sourceId || i.source 
        }
      }

      const id_s = node.id.indexOf('node-') !==-1 ? nodes.find(n => n.id ===  node.id)?.data?.nodeId : node.id;

      const sss = getUpstreamNodeIds(id_s, edges.map(fn))
      
      nplIds.push(...sss)

      console.log('前置节点sss:', sss);
      



      // perentData = nodes.find(i => i.id === parent.sourceDataset)
      // setParentNode(perentData)
    }

    const nodeIds = nplIds
    // .map(i => i.node?.data?.nodeId).filter(i => i)
    

    console.log('Form values:-----------', node, nodeIds);
    let formDatas = {}

  

    // 如果是source类型的节点，且有数据集ID，加载表格数据
    if (node.type === 'sourceDataset' && (node.custom || node.data?.custom || node.data?.config?.mdmDataSetId)) {
      
      // const custom = node.custom || node.data?.custom || node.data?.config.mdmDataSetId &&  fn(dataSetOptions, node.data.config.mdmDataSetId)
      console.log(':custom:', node, custom);
      formDatas = {
        custom
      }
      // 如果custom是数组，取最后一个值作为数据集ID
      const dataSetId = Array.isArray(custom) ? custom[custom.length - 1] : custom;
      setSelectedDataSetId(dataSetId);

      if(dataSetId){
        fetchTableData(dataSetId, 1, 9999999);

      
      }

    }else if(node.type === 'nlpProcess' ) {
      // 处理NLP节点
      console.log('nplIds：', node?.data, nplIds);

      if(nplIds.length) {

 
        

        api.getNplTableList({
          nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || [])
          // setTableSelect(res?.data?.map(i => ({ label: `${i.name}(${i.dataTypeName})`, value: i.code })) || [])
          console.log('NPL表格数据:', res);
        })

      }else{
        setTableSelect([])
      }

      const outputFields = node?.data?.outputFields || []
      const fieldMapping = node?.data?.config?.fieldMapping || []
      if(outputFields.length || fieldMapping.length) {

        setTableTag(r=> outputFields.map(i=>(i.code|| '')))

          setTableData(fieldMapping?.map(i => {
          return {
            name: i.targetField,
            sourceField: i.sourceField,
          }
        }) || [])
      }
       if(node?.data?.config?.apiName || node?.apiName) {

        formDatas = {
         apiName: node?.data?.config?.apiName || node?.apiName
        }

        const confId = apiNpl.find(i => (i.value === node?.data?.config?.apiName || i.value === node?.apiName))?.confId

         confId && api.getNplInfo(confId).then(res => {
          console.log('getNplInfo：', res);
          
          setTableData(per => res?.data?.vars?.map(i => ({ ...i, key: i.name,  })) || [])
          // name: `${i.label}(${i.name})`
          setTableTag(per => res?.data?.result || [])
          
        })


        setTableData(node?.data?.config.fieldMapping?.map(i => {
          return {
            name: i.targetField,
            sourceField: i.sourceField,
          }
        }) || [])

      }else{
        setTableData([]);
        setTableTag([]);
      }

    }else if(node.type === 'llmProcess' ) {
      // 处理LLM节点
      console.log('llmIds：', node?.data, nplIds);

      if(nplIds.length) {
        api.getNplTableList({
          nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || [])
          console.log('LLM表格数据:', res);
        })
      }else{
        setTableSelect([])
      }

      const outputFields = node?.data?.outputFields || []
      const fieldMapping = node?.data?.config?.fieldMapping || []
      if(outputFields.length || fieldMapping.length) {
        setTableTag(r=> outputFields.map(i=>(i.code|| '')))
        setTableData(fieldMapping?.map(i => {
          return {
            name: i.targetField,
            sourceField: i.sourceField,
          }
        }) || [])
      }
       if(node?.data?.config?.apiName || node?.apiName) {
        formDatas = {
         apiName: node?.data?.config?.apiName || node?.apiName
        }

        const confId = apiNpl.find(i => (i.value === node?.data?.config?.apiName || i.value === node?.apiName))?.confId

         confId && api.getNplInfo(confId).then(res => {
          console.log('getLLMInfo：', res);
          
          setTableData(per => res?.data?.vars?.map(i => ({ ...i, key: i.name,  })) || [])
          setTableTag(per => res?.data?.result || [])
          
        })

        setTableData(node?.data?.config.fieldMapping?.map(i => {
          return {
            name: i.targetField,
            sourceField: i.sourceField,
          }
        }) || [])

      }else{
        setTableData([]);
        setTableTag([]);
      }

    }else if(node.type === 'fieldTransform' ) {

      //  1059 行
      // 处理字段转换节点
      // && e.source === 'data-source'
      // api.getNplList()
      console.log('nplIds：', node?.data);

      if(node.data?.nodeId){
        // { id: '1', enName: 'disease_name', cnName: '诊断名称', dataType: 'varchar', typeName: '日期类型' },
        // {
        //       "code": "disease_name",
        //       "dataType": "varchar",
        //       "name": "诊断名称"
        //   },
        
        const list = node?.data?.outputFields?.map( (i,index) => ({ 
          ...i,
          id: i.id || (index+''), 
          enName: i.code, 
          cnName: i.name,
          dataType: i.dataType,
          typeName: i.typeName,
        })) || []
        setConversionList(p=>list)
        const initialRules = {};
        node?.data?.config?.fieldMapping?.forEach((fm, index) => {

          console.log('fm:', fm);
          if(index === 0){
            setSelectedConversionId(r => ({...fm, id: fm.id || '0'} ));
            formDatas = { 
              ruleType: fm.sourceField && 'patient_id' || fm.rule && 'rule', 
              mapping: fm.mapping || fm.sourceField || initialRules['0']?.mapping || '', 
              rule: fm.rule || initialRules['0']?.rule || '' 
            }
          }

          // try find by targetField (enName)
            initialRules[fm.id || (index+'')] = {
              ruleType:  fm.sourceField && 'patient_id' || fm.rule && 'rule',
              mapping: fm.sourceField,
              rule: fm.rule,
            };
        });

        setConversionRules(initialRules);

        !formDatas && setSelectedConversionId(null);

      }else{
        // form.setFieldsValue({ ruleType: '', mapping: '', rule: '' });
        setSelectedConversionId(null);
        setConversionList([]);
      }
      
      if(nplIds.length) {


        

        api.getNplTableList({
          nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || [])
          // setTableSelect(res?.data?.map(i => ({ label: `${i.name}(${i.dataTypeName})`, value: i.code })) || [])
          console.log('NPL表格数据:', res);
        })

      }


    
    }else if(node.type === 'targetDataset') {
        // const custom = node.data?.custom || node.data?.config.mdmDataSetId &&  fn(dataSetOptions, node.data.config.mdmDataSetId)

        const dataSetId = Array.isArray(custom) ? custom[custom.length - 1] : custom;

        // setTableData(node?.data?.config.fieldMapping?.map(i => {
        //   return {
        //     name: i.targetField,
        //     sourceField: i.sourceField,
        //   }
        // }) || [])

        // setTableTag(node?.data?.outputFields?.map(i => i.code) || [])

        // setTableSelect(node?.data?.tableSelect || [])

        // 如果custom是数组，取最后一个值作为数据集ID
        setSelectedDataSetId(dataSetId);

       nodeIds.length && api.getNplTableList({
          nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || [])
          // setTableSelect(res?.data?.map(i => ({ label: `${i.name}(${i.dataTypeName})`, value: i.code })) || [])
          console.log('NPL表格数据:', res);
        }) || setTableSelect([])

        //  if(node?.data?.nodeId && dataSetId && node?.data?.config?.fieldMapping){
        //   setTableData(response?.data?.pageRecords?.map(i => {
        //   if(obj[i.code]){
        //     i.sourceField = obj[i.code]
        //   }
        //   return i
        // }) || []);
        // }else
        // 判断id  获取表格
        if(node.data?.nodeId && dataSetId){

        console.log('-----output-------', node);

        const params = {
        pageArg: {
          currentPage: 1,
          pageSize: 9999999,
        },
        query: {
          dataSetId: dataSetId,
          propType: "2",
        },
      };
      // const response = await api.getDataProperties(params);
      setTableLoading(true);
      api.getDataProperties(params).then(response => {
        setTableLoading(false);
        const obj =  {}
        if(node?.data?.config.fieldMapping){
          node?.data?.config.fieldMapping.forEach(i => {
            obj[i.targetField] = {...i}
          })
        }

        setTableData(r=>response?.data?.pageRecords?.map(i => {
          if(obj[i.code]){
            i = {...i,...obj[i.code], key: i.dataPropId+''}
          }
          return ({...i, key: i.dataPropId+''})
        }) || []);
      });

        
        formDatas = {
          custom
        }

      }else{
        setTableData([]);
      }

      
      if(nplIds.length) {

     

        api.getNplTableList({
          nodeIds,
        }).then(res => {
           setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || [])
          // setTableSelect(res?.data?.map(i => ({ label: `${i.name}(${i.dataTypeName})`, value: i.code })) || [])
          console.log('NPL表格数据:', res);
        })

      }

    }else if(node.type === 'scriptProcess' ) {
      // 处理字段转换节点
     

      if(node.data?.nodeId || node.nodeId){
  
        setCode(node?.data?.config?.scriptContent || '')

      }else{
  
        setCode('')
      }
      
      


    }else if(node.type === 'ifElseProcess' ) {
      // 处理字段转换节点


      if(node.data?.nodeId || node.nodeId){
        console.log('ifElseProcess node:', node);
        
        const list = ((node?.config?.branches || node?.data?.config?.branches).map((i, index) => ({...i, name: i.label,  code: i.condition || '', id: (index+'')})) || [])
        console.log('node:', node, list);

        setCode(per => (list[0]?.code || list[0]?.condition || ''));
        setSelectedConversionId(per =>'0');
        setConversionList(per=> list)

      }else{
        setSelectedConversionId('1');
        setCode('');
        setConversionList([
          {id:'1', code: ''},
          {id:'2', code: ''},
        ]);
      }

    }else if(node.type === 'mysqlTableSource' || node.type === 'mysqlTableTarget' || 
             node.type === 'mongoCollectionSource' || node.type === 'mongoCollectionTarget' || 
             node.type === 'fileSource' || node.type === 'fileTarget') {


      if(node.type === 'mongoCollectionSource' || node.type === 'mysqlTableSource') {
        // 调用api.getNodeDetail获取节点详情
        if(node.data?.nodeId) {
          api.getNodeDetail({ nodeId: node.data.nodeId }).then(res => {
            console.log('节点详情数据:', res);
            // 处理返回的outputFields
            const outputFields = res?.data?.outputFields ? JSON.parse(res?.data?.outputFields) || [] :  [];
            setTableTag(outputFields.map(i => i.code || ''));
            
            // 如果有fieldMapping，设置表格数据
            const fieldMapping = res?.data?.config?.fieldMapping || [];
            setTableData(fieldMapping.map(i => ({
              name: i.targetField,
              sourceField: i.sourceField,
            })) || []);
          }).catch(error => {
            console.error('获取节点详情失败:', error);
          });
        }
        
        // 加载数据源表字段
        if(node.type === 'mysqlTableSource' && node.data?.config?.dexSourceId && node.data?.config?.tableName) {
          api.getMySQLTableFields(node.data.config.dexSourceId, node.data.config.tableName).then(response => {
            setDataSourceTableFields(response?.data || []);
          });
        }
        
        // 加载MongoDB集合字段
        if(node.type === 'mongoCollectionSource' && node.data?.config?.dexSourceId && node.data?.config?.tableName) {
          api.getMongoCollectionFields(node.data.config.dexSourceId, node.data.config.tableName).then(response => {
            setDataSourceTableFields(response?.data || []);
          });
        }
      }

      // 处理数据库和文件节点
      if(node.data?.config) {
        formDatas = {
          ...node.data.config
        };
        
        // 对于mongoCollectionTarget，将fieldMapping转换为fields
        if (node.type === 'mongoCollectionTarget' && node.data.config.fieldMapping) {
          // 从fieldMapping中提取sourceField，转换为fields数组
          formDatas.fields = node.data.config.fieldMapping.map(item => {
            // 查找对应的字段对象，获取name
            const field = dataSourceTableFields.find(f => f.label === item.sourceField);
            return field?.name || item.sourceField;
          });
        }
        
        // 加载MySQL表名列表
        if (node.type === 'mysqlTableSource' && node.data.config.dexSourceId) {
          api.getDataSourceTables({ dexSourceId: node.data.config.dexSourceId }).then((response) => {
            setTableData(response?.data || []);
          });
        }
        
        // 如果是mysqlTableTarget，加载数据源和表名
        if (node.type === 'mysqlTableTarget' && node.data.config?.dexSourceId) {
          // 加载表名列表
          api.getDataSourceTables({ dexSourceId: node.data.config.dexSourceId }).then((response) => {
            setTableData(response?.data || []);
          });
          
          // 如果有表名，加载字段列表
          if (node.data.config?.tableName) {
            api.getMySQLTableFields(node.data.config.dexSourceId, node.data.config.tableName).then((response) => {
              console.log('MySQL表字段:', response);
              setDataSourceTableFields(response?.data || []);
            });
          }
        }
        
        // 如果是mysqlTableTarget，从上游节点获取字段作为目标字段
        if (node.type === 'mysqlTableTarget' && nodeIds.length) {
          api.getNplTableList({
            nodeIds: nodeIds,
          }).then(res => {
            // 获取已保存的字段映射
            const savedFieldMapping = node.data.config?.fieldMapping || [];
            // 将保存的 sourceField 合并到字段数据中
            const fieldsWithMapping = (res?.data || []).map(item => {
              const savedMapping = savedFieldMapping.find(fm => fm.targetField === (item.code || item.name));
              return {
                ...item,
                key: item.code,
                label: item.name,
                comment: item.name,
                value: item.code,
                name: item.code,
                sourceField: savedMapping?.sourceField || undefined,
              };
            });
            setTableSelect(fieldsWithMapping);
            console.log('MySQL目标表目标字段:', res);
          });
        }
        
        // 如果是mysqlTableTarget，确保在没有上游节点时也能正常打开
        if (node.type === 'mysqlTableTarget' && !nodeIds.length) {
          // 清空tableSelect，避免显示错误数据
          setTableSelect([]);
        }
        
        // 加载MongoDB集合列表
        if (node.type === 'mongoCollectionSource' && node.data.config.dexSourceId) {
          api.getMongoCollections(node.data.config.dexSourceId).then((response) => {
            setTableData(response?.data || []);
            
            // 如果有集合名，加载字段列表
            if (node.data.config?.tableName) {
              // api.getMongoCollectionFields(node.data.config.dexSourceId, node.data.config.tableName).then((response) => {
              //   console.log('MongoDB集合字段:', response);
              //   setDataSourceTableFields(response?.data || []);
              // });
            }
          });
        }
        
        // 如果是mongoCollectionTarget，加载数据源和集合名
        if (node.type === 'mongoCollectionTarget' && node.data.config?.dexSourceId) {
          // 加载集合列表
          api.getMongoCollections(node.data.config.dexSourceId).then((response) => {
            setTableData(response?.data || []);
          });
        }
        
        // 如果是mongoCollectionTarget，从上游节点获取字段
        if (node.type === 'mongoCollectionTarget' && nodeIds.length) {
          api.getNplTableList({
            nodeIds: nodeIds,
          }).then(res => {
            // 获取已保存的字段
            const savedFields = node.data.config?.fields || [];
            // 转换字段数据
            const fieldsWithMapping = (res?.data || []).map(item => ({
              ...item,
              key: item.code,
              label: item.name,
              comment: item.name,
              value: item.code,
              name: item.code
            }));
            setTableSelect(fieldsWithMapping);
            console.log('MongoDB集合存储字段:', res);
          });
        }
        
        // 如果是mongoCollectionTarget，确保在没有上游节点时也能正常打开
        if (node.type === 'mongoCollectionTarget' && !nodeIds.length) {
          // 清空tableSelect，避免显示错误数据
          setTableSelect([]);
        }
      }
      if(selectedNode && nodeIds.length && selectedNode.type !== 'mysqlTableTarget' && selectedNode.type !== 'mongoCollectionTarget') {
        api.getNplTableList({
          nodeIds: nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || []);
          console.log('表格数据:', res);
        });
      } else if (selectedNode && !nodeIds.length && selectedNode.type !== 'mysqlTableTarget' && selectedNode.type !== 'mongoCollectionTarget') {
        setTableSelect([]);
      }
    }else if(node.type === 'validateProcess') {
      // 处理数据校验节点
      if(node.data?.nodeId || node.nodeId) {
        const rules = node?.data?.config?.validateRules || [];
        const list = rules.map((rule, index) => ({
          id: index.toString(),
          fieldName: rule.fieldName,
          ruleExpression: rule.ruleExpression,
          failReason: rule.failReason
        }));
        setConversionList(list);
        if(list.length > 0) {
          setSelectedConversionId(list[0].id);
        }
      } else {
        setConversionList([]);
        setSelectedConversionId(null);
      }
      if(nodeIds.length) {
        api.getNplTableList({
          nodeIds,
        }).then(res => {
          setTableSelect(res?.data?.map(i => ({ ...i, label: i.name, value: i.code })) || []);
          console.log('表格数据:', res);
        });
      } else {
        setTableSelect([]);
      }
    }

    
    setDrawerOpen(true);

    console.log('formDatas:', formDatas);
    const formData =  {
      ...node.data,
      apiName: node.data?.apiName || '',
      custom:  node.data.custom   || node.data.mdmDataSetId,
      ...formDatas
    }
    console.log('FORM formData:', formData)
    form.setFieldsValue(formData);


  }, [selectedNode, form, dataSetOptions, edges, apiNpl]);

  // synchronize form values with selected node
  React.useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        ...selectedNode.data
      });
    } else {
      form.resetFields();
    }
  }, [selectedNode, form]);

  // 当抽屉打开且已经选中source节点时，初始化请求参数并拉取表格数据
  React.useEffect(() => {
    if (drawerOpen && selectedNode && selectedNode.type === 'sourceDataset' ) {
      const dataSetId = Array.isArray(selectedNode.data.custom)
        ? selectedNode.data.custom[selectedNode.data.custom.length - 1]
        : selectedNode.data.custom;
      setSelectedDataSetId(dataSetId || null);
      // 重置分页到第一页
      // setPagination(prev => ({ ...prev, current: 1, pageSize: 10, total: 0 }));
      // 清空上一次数据再请求
      console.log('---------------');
      
      // setTableData([]);


      if(selectedNode.data?.custom){
        fetchTableData(dataSetId, 1, 9999999);
      }
    }

  }, [drawerOpen, selectedNode]);

  const getNodeDataInfo = (id) => {
    return api.getComputedStyle(id)
  }

  const [formLoading, setFormLoading] = useState(false);

  const onFinish = (values) => {
    if (!selectedNode) return;

    let nodeData;
    nodes.forEach((node) => {
      if (node.id === selectedNode.id) {
        nodeData = { ...node.data, ...values };
      }
    });

    setFormLoading(true);

    const httpData = buildNodeRequestPayload({
      selectedNode,
      values,
      nodeData,
      flowId: currentFlowId,
      tableData,
      tableTag,
      conversionList,
      conversionRules,
      tableSelect,
      code,
      dataSourceTableFields,
    });

    const request = selectedNode.data.nodeId ? api.updateNode : api.createNode;

    if (selectedNode.data.nodeId) {
      httpData.nodeId = selectedNode.data.nodeId;
    }

    httpData.posX = selectedNode.position.x;
    httpData.posY = selectedNode.position.y;

    const response = {data: {}}
    request(httpData)
      .then((response) => {
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.id !== selectedNode.id) {
              return node;
            }

            const nextData = {
              ...node.data,
              ...values,
              ...httpData,
              mdmDataSetId: nodeData?.custom || response?.data?.mdmDataSetId,
              nodeId: response?.data?.nodeId,
              apiName: values.apiName,
            };

            setSelectedNode((currentSelectedNode) =>
              currentSelectedNode ? { ...currentSelectedNode, data: nextData } : currentSelectedNode,
            );

            return { ...node, data: nextData };
          }),
        );
      })
      .finally(() => {
        setFormLoading(false);
        setDrawerOpen(false);
        form.resetFields();
      });
  };


  const [isModalOpen, setIsModalOpen] = useState(false);

  const [conversionList, setConversionList] = useState([
    { id: '1', enName: 'disease_name', cnName: '诊断名称', dataType: 'varchar', typeName: '日期类型', code: '' },
    { id: '2', enName: 'visit_date', cnName: '就诊日期', dataType: 'date', typeName: '日期类型', code: '' },
    { id: '3', enName: 'dbp', cnName: '舒张压(mmHg)', dataType: 'int', typeName: '数值类型', code: '' },
  ]);

  // editing state for logic list item names (for if/else list)
  const [editingLogicId, setEditingLogicId] = useState(null);
  const [editingLogicName, setEditingLogicName] = useState('');

  // Selected conversion field id and per-field rules mapping
  const [selectedConversionId, setSelectedConversionId] = useState(null);
  const [conversionRules, setConversionRules] = useState({});

  // 当切换选中的 conversion item 时，加载对应的 code 到编辑器；
  React.useEffect(() => {
    if (selectedConversionId) {
      const item = conversionList.find(i => i.id === (selectedConversionId?.id || selectedConversionId));
      setCode(item?.code || '');
    } else {
      setCode('');
    }
  }, [selectedConversionId, conversionList]);

  

  const handleOk = () => {
    forms.validateFields().then(values => {

      const newField = {
        id: values.id || `field-${Date.now()}`,
        enName: values.enName,
        cnName: values.cnName,
        dataType: values.dataType,
        typeName: dict.find(i => i.itemCode === values.dataType).itemName ,
        // key: values.key || new Date().getTime(), // 临时key，编辑时用来标识更新哪个字段
      };

      console.log('values: ', values, 'newField: ', newField);
      

      if(values.id) {
        // 编辑模式，更新对应字段
        setConversionList(conversionList.map(item => item.id === values.id ? { ...item, ...newField } : item));
      } else {
        // 新增模式，添加新字段
        setConversionList([...conversionList, newField]);
        const newRules = {
          ruleType: 'patient_id',
          mapping: undefined,
          rule: undefined,
        }
        setConversionRules(prev => ({
          ...prev,
          [newField.id]: {...newRules}
        }));

        if(!conversionList.length){
          setSelectedConversionId(newField);
          form.setFieldsValue(newRules);
        }
      }
      // setConversionList([...conversionList, newField]);
      setIsModalOpen(false);
    }).catch(info => {
      console.log('Validate Failed:', info);
    })
  }
  const handleCancel = () => {
    forms.resetFields();
    setIsModalOpen(false);
  }
  const handleAddField = (values) => {
    console.log('Add field with values:', values);
    // Here you would typically update the state to add the new field to the list
    setIsModalOpen(false);
  };

  const [preview, setPreview] = useState(false)

  // 流程日志状态
  const [flowLog, setFlowLog] = useState([]);
  const [flowInfo, setFlowInfo] = useState({});
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logLoading, setLogLoading] = useState(false);

  // 悬停节点高亮：记录当前 hover 的节点 id
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const onNodeMouseEnter = useCallback((_, node) => {
    // 清除之前的超时
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // 立即设置悬停节点
    setHoveredNodeId(node.id);
  }, []);

  const onNodeMouseLeave = useCallback(() => {
    // 添加防抖，避免快速移动时的闪烁
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredNodeId(null);
    }, 100);
  }, []);

  // 当有悬停节点时，为与其相关的连线附加 highlighted 标记
  const displayEdges = useMemo(() => {
    if (!hoveredNodeId) return edges;
    return edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        // only set highlighted to true for connected edges; do not clear existing highlights
        highlighted: edge.data?.highlighted || edge.source === hoveredNodeId || edge.target === hoveredNodeId,
      },
    }));
  }, [edges, hoveredNodeId]);

  // 刷新日志状态
  const refreshLogs = async () => {
    if (flowLog.length > 0) {
      const firstLog = flowLog[0];
      const logId = firstLog.logId || firstLog.nodeId;
      if (logId) {
        setLogLoading(true);
        try {
          const logResponse = await api.getFlowLog({ logId });
          if (logResponse?.data) {
            let logs = [];
            if (logResponse.data.nodeExecLogs && Array.isArray(logResponse.data.nodeExecLogs)) {
              logs = logResponse.data.nodeExecLogs;
            } else if (Array.isArray(logResponse.data)) {
              logs = logResponse.data;
            } else {
              logs = [logResponse.data];
            }
            
            // 获取详细信息
            const detailedLogs = await Promise.all(
              logs.map(async (log) => {
                if (log.nodeLogId) {
                  try {
                    const detailResponse = await api.getNodeExecLogDetail({ nodeLogId: log.nodeLogId });
                    return { ...log, ...detailResponse.data };
                  } catch (error) {
                    console.error('获取节点执行日志详情失败:', error);
                    return log;
                  }
                }
                return log;
              })
            );
            
            // 保存流程信息
            setFlowInfo(logResponse.data);
            
            // 保留logResponse中的数据，同时添加详细信息
            if (logResponse.data.nodeExecLogs) {
              // 如果有nodeExecLogs，使用详细的节点日志
              setFlowLog(detailedLogs);
            } else {
              // 否则使用整个响应数据
              setFlowLog([logResponse.data]);
            }
          }
        } catch (error) {
          console.error('刷新日志失败:', error);
        } finally {
          setLogLoading(false);
        }
      }
    }
  };

  // 流程日志模态框组件
  const LogModal = () => {
    // 检查是否有未执行完成的节点或失败的节点
    // const hasRunningNodes = flowLog.some(item => 
    //   item.execStatusName === '运行中' || 
    //   item.execStatusName === '执行中' || 
    //   item.execStatusName === '未执行' ||
    //   item.execStatusName === 'pending' ||
    //   item.execStatusName === 'processing' ||
    //   item.execStatusName === '失败' ||
    //   item.execStatusName === '异常'
    // );
    
    return (
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>执行明细</span>
            {flowInfo?.execStatusName !== '执行中' && (
              <Tooltip title="刷新状态" style={{ marginLeft: '15px' }}>
                <Button 
                  type="text" 
                  icon={<SyncOutlined />} 
                  onClick={refreshLogs}
                  loading={logLoading}
                />
              </Tooltip>
            )}
          </div>
        }
        open={logModalOpen}
        onCancel={() => setLogModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setLogModalOpen(false)}>
            关闭
          </Button>
        ]}
        width={800}
        style={{
          top: 20,
        }}
      >
      <Spin spinning={logLoading} description="Loading">
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {/* 流程基本信息 */}
          <div style={{ padding: '20px' }}>
            {/* <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>任务编码：</span>
              {flowInfo.flowCode || '-'}
            </p>
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>任务名称：</span>
              {flowInfo.flowName || '-'}
            </p>
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>执行类型：</span>
              {flowInfo.execType === 1 ? '手动执行' : flowInfo.execType === 2 ? '自动执行' : '-'}
            </p> */}
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>开始时间：</span>
              {flowInfo.startTimeName || '-'}
            </p>
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>结束时间：</span>
              {flowInfo.endTimeName || '-'}
            </p>
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>任务状态：</span>
              {flowInfo.execStatusName || '-'}
            </p>
            {flowInfo.execProgress && (
              <p style={{ margin: '8px 0' }}>
                <span style={{ color: '#72767b', marginRight: '10px' }}>执行进度：</span>
                {flowInfo.execProgress}
              </p>
            )}
            <p style={{ margin: '8px 0' }}>
              <span style={{ color: '#72767b', marginRight: '10px' }}>异常信息：</span>
              {flowInfo.errorMsg || '暂无'}
            </p>
          </div>
          
          {/* 节点执行日志 */}
          <div style={{ padding: '0 20px 20px' }}>
            <h3 style={{ margin: '20px 0' }}>节点执行详情</h3>
            <Timeline>
              {flowLog.map((item, index) => {
                let statusColor = '';
                let statusIcon = <CheckCircleOutlined />;
                
                switch (item.execStatusName) {
                  case '已完成':
                  case '成功':
                    statusColor = 'green';
                    statusIcon = <CheckCircleOutlined />;
                    break;
                  case '运行中':
                  case '执行中':
                    statusColor = 'blue';
                    statusIcon = <LoadingOutlined />;
                    break;
                  case '未执行':
                    statusColor = 'blue';
                    statusIcon = <PlayCircleOutlined />;
                    break;
                  case '失败':
                  case '异常':
                    statusColor = 'red';
                    statusIcon = <CloseCircleOutlined />;
                    break;
                  default:
                    statusColor = 'gray';
                }
                
                return (
                  <Timeline.Item 
                    key={item.nodeLogId || index}
                    color={statusColor}
                    dot={statusIcon}
                  >
                    <Card style={{ position: 'relative' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                          节点 ID: {item.nodeId}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          执行状态: {item.execStatusName}
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ margin: '4px 0' }}>开始时间: {item.startTimeName}</p>
                        <p style={{ margin: '4px 0' }}>结束时间: {item.endTimeName || ''}</p>
                      </div>
                      
                      <Descriptions bordered column={3} size="small">
                        <Descriptions.Item label="输入数量">
                          {item.inputCount || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="输出数量">
                          {item.outputCount || 0}
                        </Descriptions.Item>
                        <Descriptions.Item label="成功数量">
                          {item.successCount || 0}
                        </Descriptions.Item>
                      </Descriptions>
                      
                      {/* 节点异常信息 */}
                      {item.errorMsg && (
                        <div style={{ marginTop: '12px', padding: '10px', backgroundColor: '#fff2f0', borderRadius: '4px' }}>
                          <p style={{ margin: '0' }}>
                            <span style={{ color: '#f56c6c', marginRight: '8px' }}>异常信息：</span>
                            {item.errorMsg}
                          </p>
                        </div>
                      )}
                      
                      <Tag 
                        color={statusColor === 'green' ? 'success' : statusColor === 'red' ? 'error' : 'blue'}
                        style={{ position: 'absolute', top: '12px', right: '12px' }}
                      >
                        {item.execStatusName}
                      </Tag>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </div>
        </div>
        {/* ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            暂无日志记录
          </div>
        )} */}
      </Spin>
      </Modal>
    );
  };
  //   if (drawerOpen && selectedNode && selectedNode.type === 'conversion') {
  //     if (conversionList && conversionList.length) {
  //       const firstId = conversionList[0].id;
  //       setSelectedConversionId((prev) => prev || firstId);
  //     }

  //     // initialize conversionRules from node config if available
  //     const initialRules = {};
  //     conversionList.forEach((item) => {
  //       if(!initialRules[item.id]) {
  //         console.log('清空/重置：', item);
          
  //         initialRules[item.id] = {
  //           ruleType: 'patient_id',
  //           mapping: undefined,
  //           rule: undefined,
  //         };
  //       }
        
  //     });

  //     if (selectedNode?.data?.config?.fieldMapping) {
  //       selectedNode.data.config.fieldMapping.forEach((fm) => {

  //         console.log('fm:', fm);
          

  //         // try find by targetField (enName)
  //         const matched = conversionList.find((i) => i.enName === fm.targetField || i.id === fm.id);
  //         if (matched) {
  //           initialRules[matched.id] = {
  //             ruleType: fm.ruleType || (fm.rule ? 'rule' : 'patient_id'),
  //             mapping: fm.mapping,
  //             rule: fm.rule,
  //           };
  //         }
  //       });
  //     }

  //     // setConversionRules(initialRules);

  //     // // populate form with first field's rule values
  //     // const selId = conversionList && conversionList[0] ? conversionList[0].id : null;
  //     // if (selId && initialRules[selId]) {

  //     //   console.log('initialRules:', initialRules);

  //     //   form.setFieldsValue({
  //     //     ruleType: initialRules[selId].ruleType,
  //     //     mapping: initialRules[selId].mapping,
  //     //     rule: initialRules[selId].rule,
  //     //   });
  //     // }
  //   }
  // }, [drawerOpen, selectedNode, conversionList]);

  const handleDataTypeChange = (value, record, index) => {

    console.log('value, record, index：', value, record, index);
    
    
    setTableSelect((prev) => {
      const newData = prev.map((item, index_) => {

        // if (item.dataPropId === record.dataPropId && record.dataPropId || item.code === record.code && record.code || item.name === record.name && record.name) {
        if (index === index_) {
          return { ...item, sourceField: value, targetField: item.code || item.name };
        }
        return item;
      });
      
      return newData;
    });
  };
  const FlowSuubmit = () => buildFlowSubmitPayload({
    nodes,
    edges,
    flowId: currentFlowId,
  });

  window.FlowSuubmit = FlowSuubmit

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    setSelectedNode(null);
    form.resetFields();
  }, [form]);

  const handleDrawerValuesChange = useCallback((changedValues) => {
    if (selectedNode?.type === 'fieldTransform' && selectedConversionId) {
      const updates = {};

      if ('ruleType' in changedValues) updates.ruleType = changedValues.ruleType;
      if ('mapping' in changedValues) updates.mapping = changedValues.mapping;
      if ('rule' in changedValues) updates.rule = changedValues.rule;

      setConversionRules((previous) => ({
        ...previous,
        [selectedConversionId?.id || selectedConversionId]: {
          ...(previous[selectedConversionId?.id || selectedConversionId] || {}),
          ...updates,
        },
      }));
    } else if (selectedNode?.type === 'validateProcess' && selectedConversionId) {
      setConversionList((previous) => {
        return previous.map((item) => {
          if (item.id === (selectedConversionId?.id || selectedConversionId)) {
            return {
              ...item,
              ...changedValues,
            };
          }
          return item;
        });
      });
    }
  }, [selectedNode, selectedConversionId]);

  // 整体执行流程
  const executeFlow = async () => {
    try {
      // 构建并保存流程
      const flowData = buildFlowSubmitPayload({
        nodes,
        edges,
        flowId: currentFlowId,
      });
      
      // 调用流程更新接口
      const saveResponse = await api.flowUpdate(flowData);
      
      if (saveResponse?.success) {
        // 保存成功后，调用异步执行接口
        const executeResponse = await api.executeAsync(currentFlowId);
        
        if (executeResponse?.data?.lastExecId) {
          const lastExecId = executeResponse.data.lastExecId;
          
          // 循环检查执行状态
          const checkStatus = async () => {
            try {
              // 直接调用api.getFlowLog获取最新状态
              const logResponse = await api.getFlowLog({ logId: lastExecId });
              
              if (logResponse?.data) {
                // 处理返回的日志数据
                const newLogs = logResponse.data.nodeExecLogs;
                
                // 一次性更新所有状态
                setFlowInfo(logResponse.data);
                setFlowLog(newLogs);
                
                // 只在第一次打开弹框
                if (!logModalOpen) {
                  // 使用setTimeout确保状态更新完成后再打开弹框
                  setTimeout(() => {
                    setLogModalOpen(true);
                  }, 0);
                }
                
                // 检查是否需要继续刷新
                const hasRunningNodes = logResponse.data.execStatusName === '运行中';
                
                if (hasRunningNodes) {
                  // 3秒后再次检查
                  setTimeout(checkStatus, 3000);
                }
              }else{
                console.warn(logResponse.message);
                setLogModalOpen(false);
              }
            } catch (error) {
              console.error('检查执行状态失败:', error);
            }
          };
          
          // 开始检查状态
          await checkStatus();
        }
      }
    } catch (error) {
      console.error('执行流程失败:', error);
      alert('执行流程失败，请检查配置！');
    }
  };
  window.ExecuteFlow = executeFlow

  return (
    <>

      {/* <div className="flow-editor">
        <aside className="flow-sidebar">
          <div className="flow-sidebar__title">节点库</div>
          <div className="flow-sidebar__hint">从左侧拖动到画布中创建节点</div>
          <div className="flow-sidebar__list">
            {NODE_LIBRARY.map((item) => (
              <div
                key={item.type}
                className="flow-sidebar__item"
                draggable
                onDragStart={(event) => handleDragStart(event, item)}
              >
                <div className="flow-sidebar__item-header">
                  <span
                    className="flow-sidebar__item-icon app-iconify"
                    style={{ background: defaultColors[item.type] || 'rgb(74, 168, 255)' }}
                  >
                    {getNodeIcon(item.type)}
                  </span>
                  <div className="flow-sidebar__item-copy">
                    <div className="flow-sidebar__item-title">{item.label}</div>
                    <div className="flow-sidebar__item-desc">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div
          className="flow-canvas"
          ref={reactFlowWrapperRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        > */}
          <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
              <Button type="primary" onClick={executeFlow}>
                整体执行
              </Button>
            </div>
            <ReactFlow
              nodes={nodes}
              edges={displayEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              onInit={handleInit}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodeMouseEnter={onNodeMouseEnter}
              onNodeMouseLeave={onNodeMouseLeave}
              fitView
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        {/* </div>
      </div> */}
      <NodeConfigDrawer
        selectedNode={selectedNode}
        drawerOpen={drawerOpen}
        form={form}
        forms={forms}
        formLoading={formLoading}
        onClose={handleDrawerClose}
        onFinish={onFinish}
        onValuesChange={handleDrawerValuesChange}
        preview={preview}
        setPreview={setPreview}
        dataSetOptions={dataSetOptions}
        setSelectedDataSetId={setSelectedDataSetId}
        fetchTableData={fetchTableData}
        tableData={tableData}
        tableLoading={tableLoading}
        apiNpl={apiNpl}
        api={api}
        setTableData={setTableData}
        tableTag={tableTag}
        setTableTag={setTableTag}
        onTableMappingChange={handleDataTypeChange}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        handleAddField={handleAddField}
        dict={dict}
        conversionList={conversionList}
        selectedConversionId={selectedConversionId}
        setSelectedConversionId={setSelectedConversionId}
        conversionRules={conversionRules}
        setConversionRules={setConversionRules}
        ruleType={ruleType}
        code={code}
        setCode={setCode}
        editingLogicId={editingLogicId}
        setEditingLogicId={setEditingLogicId}
        editingLogicName={editingLogicName}
        setEditingLogicName={setEditingLogicName}
        tableSelect={tableSelect}
        setConversionList={setConversionList}
        dataSourceList={dataSourceList}
        dataSourceTableFields={dataSourceTableFields}
        setDataSourceTableFields={setDataSourceTableFields}
      />
       {LogModal()}
      {/* <LogModal /> */}
    </>
  );
};

export default ConnectionLineFlow;
