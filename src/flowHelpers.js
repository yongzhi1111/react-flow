export const getFlowId = () => new URLSearchParams(window.location.search).get('flowId') || '';
import { message } from "antd";
import { api } from './api.js';
export const dedupeEdges = (edges) => {
  const uniqueEdges = [];
  const seen = new Set();

  edges.forEach((edge) => {
    const key = edge.id || `${edge.source}->${edge.target}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEdges.push(edge);
    }
  });

  return uniqueEdges;
};

export const findTreePath = (options, targetId) => {
  for (const item of options) {
    if (item.value == targetId) {
      return [item.value];
    }

    if (item.children?.length) {
      const childPath = findTreePath(item.children, targetId);
      if (childPath.length) {
        return [item.value, ...childPath];
      }
    }
  }

  return [];
};


export const getUpstreamNodeIds = (targetNodeId, edges) =>  {
  const result = [];
  const visited = new Set();

  const traverse = (currentTargetId) => {
    if (visited.has(currentTargetId)) {
      return;
    }
    visited.add(currentTargetId);

    // 查找指向当前节点的边（上游）
    const previousEdges = edges.filter((edge) => {
      const target = edge.targetId ?? edge.target;
      return String(target) === String(currentTargetId);
    });

    const previousSources = [...new Set(previousEdges.map((edge) => 
      edge.sourceId ?? edge.source
    ))];

    if (previousSources.length > 0) {
      // 有上游节点，递归获取
      result.push(...previousSources);
      previousSources.forEach(traverse);
    } else {
      // 没有上游了，加入当前节点
      result.push(currentTargetId);
    }
  };

  traverse(targetNodeId);
  console.log('result:',result);
  
  return [...new Set(result)];
};

// export const getUpstreamNodeIds = (targetNodeId, edges) => {
//   const result = [];
//   const visited = new Set();

//   const traverse = (currentTargetId) => {
//     if (visited.has(currentTargetId)) {
//       return;
//     }
//     visited.add(currentTargetId);

//     const previousEdges = edges.filter((edge) => edge.target === currentTargetId);
//     const previousSources = [...new Set(previousEdges.map((edge) => edge.source))];

//     result.push(...previousSources);
//     previousSources.forEach(traverse);
//   };

//   traverse(targetNodeId);
//   return result;
// };

const normalizeNodeData = (node) => {
  const data = {};

  if (typeof node.config === 'string' || typeof node.outputFields === 'string') {
    if (node.config) {
      data.config = JSON.parse(node.config);
    }
    if (node.outputFields) {
      data.outputFields = JSON.parse(node.outputFields);
    }

    if (node.nodeType === 'fieldTransform' && node.outputFieldList) {
      data.outputFields = node.outputFieldList;
    }
  } else if (node.nodeType === 'sourceDataset') {
    data.mdmDataSetId = node?.dataPath || node.config?.mdmDataSetId;
  } else if (node.nodeType === 'nlpProcess' || node.nodeType === 'fieldTransform') {
    data.config = {
      ...(node.configData || {}),
      fieldMapping: (node.fieldMapping || []).map((item) => ({
        ruleType: item.sourceField ? 'patient_id' : item.rule ? 'rule' : '',
        rule: item.rule,
        mapping: item.sourceField,
      })),
    };
  } else if (node.nodeType === 'targetDataset') {
    data.config = {
      ...(node.configData || {}),
      mdmDataSetId: node?.dataPath || node.config?.mdmDataSetId,
    };
  } else if (node.nodeType === 'scriptProcess' || node.nodeType === 'ifElseProcess') {
    data.config = {
      ...(node.configData || {}),
    };
  }

  return data;
};

export const normalizeFlowDetail = (detail) => {
  const allNodes = {};
  const parsedConfig = JSON.parse(detail?.config || '{}') || {};
  const currentNodes = detail?.nodes || parsedConfig.nodes || [];
  const nextNodes = [];

  currentNodes.forEach((item) => {
    const extraData = normalizeNodeData(item);
    const normalizedNode = {
      id: `${item.nodeId}`,
      type: item.type || item.nodeType,
      data: {
        label: item.nodeName || `${item.nodeId}`,
        flowId: item.flowId,
        nodeId: item.nodeId,
        nodeType: item.type || item.nodeType,
        outputFields: item.outputFields || [],
        ...extraData,
      },
      position: {
        x: item.posX,
        y: item.posY,
      },
    };

    allNodes[item.nodeId] = normalizedNode;
    nextNodes.push(normalizedNode);
  });

  const nextEdges = [];

  if (parsedConfig.edges?.length) {
    parsedConfig.edges.forEach((item) => {
      let labelIndex = -1;

      if (item.label !== undefined) {
        labelIndex = allNodes[item.source]?.data?.config?.branches?.[item.label] ?? -1;
      }

      nextEdges.push({
        type: 'custom-edge',
        targetHandle: item.target ? `${item.target}-end` : undefined,
        sourceHandle:
          labelIndex !== -1
            ? `${item.source}-start-switch-${item.label}`
            : item.source
              ? `${item.source}-start`
              : undefined,
        id: `${item.source}->${item.target}`,
        source: `${item.source}`,
        target: `${item.target}`,
      });
    });
  }

  return {
    nodes: nextNodes,
    edges: dedupeEdges(nextEdges).map((edge) => ({
      ...edge,
      type: edge.type || 'custom-edge',
    })),
  };
};

export const buildNodeRequestPayload = ({
  selectedNode,
  values,
  nodeData,
  flowId,
  tableData,
  tableTag,
  conversionList,
  conversionRules,
  tableSelect,
  code,
  dataSourceTableFields,
}) => {
  if (!selectedNode) {
    return null;
  }

  switch (selectedNode.type) {
    case 'start':
    case 'end':
      return {
        flowId,
        nodeType: selectedNode.type,
        nodeName: values.label || nodeData?.name,
      };
    case 'sourceDataset':
      return {
        flowId,
        nodeType: 'sourceDataset',
        nodeName: values.label || nodeData?.name,
        outputFields: tableData.map((item) => ({
          code: item.code,
          name: item.cnName,
          dataType: item.dataType,
        })),
        config: {
          mdmDataSetId: nodeData?.custom?.[nodeData.custom.length - 1],
        },
      };
    case 'nlpProcess':
      return {
        flowId,
        nodeType: 'nlpProcess',
        nodeName: values.label,
        config: {
          apiName: values.apiName || selectedNode?.data?.config?.apiName,
          fieldMapping: tableData.map((item) => ({
            targetField: item.name,
            sourceField: item.sourceField,
          })),
        },
        outputFields: tableTag.map((item) => ({ code: item, dataType: 4 })),
      };
    case 'fieldTransform': {
      const outputFields = [];
      const fieldMapping = conversionList.map((item) => {
        const currentRule = conversionRules[item.id] || {};

        outputFields.push({
          code: item.enName,
          dataType: item.dataType || item.dataTypeName,
          name: item.cnName,
          typeName: item.typeName,
        });

        if (currentRule.ruleType === 'rule') {
          return {
            targetField: item.enName,
            targetFieldType: item.dataType,
            rule: currentRule.rule,
          };
        }

        const selectedField = tableSelect.find((option) => option.code === currentRule.mapping) || {};
        return {
          targetField: item.enName,
          targetFieldType: item.dataType,
          sourceField: currentRule.mapping,
          sourceFieldType: selectedField?.dataType,
        };
      });

      return {
        flowId,
        nodeType: 'fieldTransform',
        nodeName: values.label,
        config: {
          fieldMapping,
        },
        outputFields,
      };
    }
    case 'targetDataset':
      return {
        flowId,
        nodeType: 'targetDataset',
        nodeName: values.label,
        config: {
          mdmDataSetId: nodeData?.custom?.[nodeData.custom.length - 1],
          fieldMapping: tableData.map((item) => {
            const selectedField = item.sourceField
              ? tableSelect.find((option) => option.code === item.sourceField) || {}
              : {};

            return {
              targetField: item.targetField || item.code,
              targetFieldType: item.dataType,
              sourceField: item.sourceField,
              sourceFieldType: selectedField?.dataType,
            };
          }),
        },
      };
    case 'scriptProcess':
      return {
        flowId,
        nodeType: 'scriptProcess',
        config: {
          ...(selectedNode?.data?.config || selectedNode?.config || { scriptLanguage: 'javascript', timeout: 5000 }),
          scriptContent: code,
        },
      };
    case 'ifElseProcess': {
      const branches = conversionList.map((item, index) => ({
        condition: item.code,
        label: item.name || item.cnName || (index ? 'IF' : 'ELSE IF'),
      }));

      return {
        flowId,
        nodeType: 'ifElseProcess',
        config: {
          branches,
        },
        outputFields: branches,
      };
    }
    case 'mysqlTableSource': {
      return {
        flowId,
        nodeType: 'mysqlTableSource',
        nodeName: values.label,
        config: {
          dexSourceId: values.dexSourceId,
          tableName: values.tableName,
        },
        outputFields: [],
      };
    }
    case 'mongoCollectionSource': {
      return {
        flowId,
        nodeType: 'mongoCollectionSource',
        nodeName: values.label,
        config: {
          dexSourceId: values.dexSourceId,
          tableName: values.tableName,
          connectionString: values.connectionString,
          database: values.database,
        },
        outputFields: [],
      };
    }
    case 'fileSource': {
      return {
        flowId,
        nodeType: 'fileSource',
        nodeName: values.label,
        config: {
          storageType: values.storageType || '1', // 1 远程 2 本地文件
          filePath: values.filePath,
          headerRow: values.headerRow,
          dataStartRow: values.dataStartRow || '2',
          sheetName: values.sheetName,
        },
        outputFields: [],
      };
    }
    case 'mysqlTableTarget': {
      console.log('tableSelect', tableSelect);
      return {
        flowId,
        nodeType: 'mysqlTableTarget',
        nodeName: values.label,
        config: {
          dexSourceId: values.dexSourceId,
          tableName: values.tableName,
          fieldMapping: tableSelect.map((item) => {
            const selectedField = item.sourceField
              ? dataSourceTableFields.find((option) => (option.code || option.name) === item.sourceField) || {}
              : {};
            return {
              sourceField: item.sourceField,
              targetField: item.code || item.name,
              targetFieldType: item.dataType,
              sourceFieldType: item.sourceField && selectedField?.dataType,
            };
          }),
        },
        outputFields: [],
      };
    }
    case 'mongoCollectionTarget': {
      // 将选中的字段转换为fieldMapping格式
      const fieldMapping = (values.fields || []).map(fieldCode => {
        // 查找对应的字段对象
        const field = tableSelect?.find(item => item.code === fieldCode);
        return {
          sourceField: fieldCode
        };
      });
      return {
        flowId,
        nodeType: 'mongoCollectionTarget',
        nodeName: values.label,
        config: {
          dexSourceId: values.dexSourceId,
          tableName: values.tableName,
          fieldMapping: fieldMapping,
        },
        outputFields: [],
      };
    }
    case 'fileTarget': {

      return {
        flowId,
        nodeType: 'fileTarget',
        nodeName: values.label,
        config: {
          "storageType": 1,
          "fileType": values.fileType || 'excel',
          "fieldMapping": tableData.map((item) => ({
            sourceField: item.sourceField,
            targetField: item.targetField || item.code,
          })),
        },
        outputFields: [],
      };
    }
    case 'validateProcess': {
      const validateRules = conversionList.map((rule) => ({
        fieldName: rule.fieldName,
        ruleExpression: rule.ruleExpression,
        failReason: rule.failReason
      }));
      return {
        flowId,
        nodeType: 'validateProcess',
        nodeName: values.label,
        config: {
          validateRules,
        },
        outputFields: [],
      };
    }
    default:
      return null;
  }
};

export const buildFlowSubmitPayload = ({ nodes, edges, flowId }) => {
  const nodeMap = {};
  const submitNodes = [];
  const submitEdges = [];
  const ifBranchMap = {};

  nodes.forEach((node) => {
    if ((node.type === 'start' || node.type === 'end') && !node.data.nodeId) {
      return;
    }

    const submitNode = {
      nodeId: node.data.nodeId,
      flowId: node.data.flowId,
      nodeType: node.type,
      posX: node.position?.x || 300,
      posY: node.position?.y || 100,
      status: node.data.status,
      outputFields:
        node?.data?.outputFields && (JSON.stringify(node.data.outputFields || []) || '[]'),
    };

    if (node.type === 'sourceDataset') {
      submitNode.config = {
        mdmDataSetId: Array.isArray(node.data.mdmDataSetId)
          ? node.data.mdmDataSetId[node.data.mdmDataSetId.length - 1]
          : node.data.mdmDataSetId,
      };
      submitNode.outputFields = node?.data?.outputFields?.map((item) => ({
        code: item.code,
        name: item.cnName,
        dataType: item.dataTypeName,
      })) || [];
    } else if (node.type === 'nlpProcess' || node.type === 'fieldTransform') {
      submitNode.config = node?.data?.config;
    } else if (node.type === 'targetDataset' || node.type === 'scriptProcess') {
      submitNode.config = {
        mdmDataSetId: Array.isArray(node?.data?.mdmDataSetId)
          ? node?.data?.mdmDataSetId[node?.data?.mdmDataSetId.length - 1]
          : node?.data?.mdmDataSetId,
        fieldMapping: node?.data?.config?.fieldMapping || [],
      };
    } else if (node.type === 'ifElseProcess') {
      submitNode.config = {
        branches:
          node?.data?.config?.branches?.map((item, index) => ({
            ...item,
            label: item.label || item.name || (index ? 'ELSE IF' : 'IF'),
          })) || [
            { condition: '', label: 'IF' },
            { condition: '', label: 'ELSE IF' },
          ],
      };
      submitNode.outputFields = [];
      ifBranchMap[submitNode.nodeId] = submitNode.config.branches;
    }

    if (submitNode.config) {
      submitNode.config = JSON.stringify(submitNode.config);
    }

    nodeMap[node.id] = submitNode;
    submitNodes.push(submitNode);
  });

  const branchIndexMap = {};

  edges.forEach((edge) => {
    if (edge.source === 'start' || edge.source === 'end') {
      return;
    }

    const sourceNodeId = nodeMap[edge.source]?.nodeId;
    if (!sourceNodeId || !nodeMap[edge.target]?.nodeId) {
      return;
    }

    if (edge.sourceHandle?.includes('-start-switch-') && branchIndexMap[sourceNodeId] === undefined) {
      branchIndexMap[sourceNodeId] = 0;
    } else if (branchIndexMap[sourceNodeId] !== undefined) {
      branchIndexMap[sourceNodeId] += 1;
    }

    submitEdges.push({
      source: sourceNodeId,
      target: nodeMap[edge.target].nodeId,
      label: branchIndexMap[sourceNodeId] !== undefined ? branchIndexMap[sourceNodeId] : edge.label,
    });
  });

  const obj = {
    flowId,
    config: {
      nodes: submitNodes,
      edges: submitEdges.filter((item) => item.source && item.target),
    },
  };
  
  // api.flowUpdate(obj).then(res => {
  //   console.log('Flow updated successfully:', res);
  //   if(res.success && location.href.includes('http://localhost/')) {
  //     message.success('流程保存成功');
  //     // iframe交互：通知父窗口流程已更新
  //     window.parent.postMessage({
  //       type: 'flowUpdated',
  //       flowId: flowId,
  //       data: obj
  //     }, '*');
  //   }
  // });

  return obj;
};
