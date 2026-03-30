import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const DEFAULT_HANDLE_STYLE = {
  width: 10,
  height: 10,
  bottom: -5,
  right: -5,
};

export default memo((props) => {
  const { data, isConnectable, onCopyNode, onDeleteNode } = props;

  // console.log('props:', props);
  

  // ifElseProcess: 根据 data 中的数量或分支数组动态渲染 Handle
  const renderSwitchHandles = () => {
    // 优先使用 data.count，其次尝试 data.branches.length，否则默认 4 个
    const count = (data && (data.count || (Array.isArray(data.branches) && data.branches.length))) || 4;
    const colors = ['#ff4d4f', '#2f54eb', '#fa8c16', '#fadb14', '#13c2c2', '#722ed1'];
    const handles = [];
    for (let i = 0; i < count; i++) {
      const topPercent = `${Math.round(((i + 1) / (count + 1)) * 100)}%`;
      handles.push(
        <Handle
          key={`switch-${i}`}
          type="source"
          id={`switch-${i}`}
          position={Position.Right}
          style={{ ...DEFAULT_HANDLE_STYLE, top: topPercent, background: colors[i % colors.length] }}
          isConnectable={isConnectable}
        />
      );
    }
    return handles;
  };

  return (
    <>
      <div style={{ padding: 25}} >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Node</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={(e)=>{ e.stopPropagation(); onCopyNode && onCopyNode(); }} style={{ cursor: 'pointer', padding: '2px 6px' }}>复制</button>
            <button onClick={(e)=>{ e.stopPropagation(); onDeleteNode && onDeleteNode(); }} style={{ cursor: 'pointer', padding: '2px 6px' }}>删除</button>
          </div>
        </div>
        {renderSwitchHandles()}
      </div>
    </>
  );
});
