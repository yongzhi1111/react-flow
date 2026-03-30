import React, { memo, useState, useEffect, useCallback } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';

import { Popover, Button, Dropdown, Space, Typography, Drawer, Tooltip } from 'antd';
import { EllipsisOutlined, PlayCircleOutlined, LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export const HandleStart = React.memo((props) => {
  const { data, isConnectable, onCopyNode, onDeleteNode, onAddNode, onUpdateNode, type, isEdge, edgeFn } = props;
  const [open, setOpen1] = useState(false);

  const setOpen = (value) => {
    setOpen1(value);
    edgeFn && edgeFn(value);
  };

  const HandleContent = () => {
    const handleOpenChange = (o) => {
      setOpen(o);
    };

    return (
      <span className={['jia', open && 'selected-jia'].join(' ')} >
        <Popover
          trigger="click"
          placement="right"
          open={open}
          onOpenChange={handleOpenChange}
          destroyOnHidden={false}
          content={
            <>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'sourceDataset', data: { label: '数据源' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'sourceDataset',
                        data: { label: '数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'sourceDataset',
                        data: { label: '数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#2B7FFF', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('sourceDataset')}
                  </span>
                  <span>数据源</span>
                </div>
                
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'nlpProcess', data: { label: 'NLP模型' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'nlpProcess',
                        data: { label: 'NLP模型' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'nlpProcess',
                        data: { label: 'NLP模型' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#AD46FF', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('nlpProcess')}
                  </span>
                  <span>NPL模型</span>
                </div>
                
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'fieldTransform', data: { label: '字段转换' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fieldTransform',
                        data: { label: '字段转换' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fieldTransform',
                        data: { label: '字段转换' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF6900', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('fieldTransform')}
                  </span>
                  <span>字段转换</span>
                </div>
                
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'targetDataset', data: { label: '输出目标字段' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'targetDataset',
                        data: { label: '输出目标字段' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'targetDataset',
                        data: { label: '输出目标字段' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#00C950', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('targetDataset')}
                  </span>
                  <span>输出目标字段</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'scriptProcess', data: { label: '脚本执行' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'scriptProcess',
                        data: { label: '脚本执行' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'scriptProcess',
                        data: { label: '脚本执行' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FD9D2F', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('scriptProcess')}
                  </span>
                  <span>脚本执行</span>
                </div>
              </div>


              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { 
                      type: 'ifElseProcess', 
                      data: { 
                        label: '条件分支',
                        config: {
                          branches: [
                            { condition: '' },
                            { condition: '' },
                          ]
                        }
                      }
                    });
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'ifElseProcess',
                        data: { 
                          label: '条件分支',
                          config: {
                            branches: [
                              { condition: '' },
                              { condition: '' },
                            ]
                          }
                        }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'ifElseProcess',
                        data: { 
                          label: '条件分支',
                          config: {
                            branches: [
                              { condition: '' },
                              { condition: '' },
                            ]
                          }
                        }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#00C950', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('ifElseProcess')}
                  </span>
                  <span>条件分支</span>
                </div>
              </div>


              {/* <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'llmProcess', data: { label: 'LLM模型' }});
                  } else if (typeof onAddNode === 'function') {
                    // 创建起始节点对象
                    const sourceNode = {
                      id: props.id,
                      type: 'llmProcess',
                      data: { label: 'LLM模型' },
                      position: {
                        x: (props && props.positionAbsoluteX) ? props.positionAbsoluteX : 0,
                        y: (props && props.positionAbsoluteY) ? props.positionAbsoluteY : 0
                      }
                    };
                    onAddNode(sourceNode, props.id);
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#4165D7', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('llmProcess')}
                  </span>
                  <span>LLM模型</span>
                </div>
              </div> */}

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'mysqlTableSource', data: { label: 'MySQL数据源' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mysqlTableSource',
                        data: { label: 'MySQL数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mysqlTableSource',
                        data: { label: 'MySQL数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#4CAF50', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('mysqlTableSource')}
                  </span>
                  <span>MySQL数据源</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'mongoCollectionSource', data: { label: 'MongoDB数据源' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mongoCollectionSource',
                        data: { label: 'MongoDB数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mongoCollectionSource',
                        data: { label: 'MongoDB数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#47A248', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('mongoCollectionSource')}
                  </span>
                  <span>MongoDB数据源</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'fileSource', data: { label: 'Excel文件数据源' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fileSource',
                        data: { label: 'Excel文件数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fileSource',
                        data: { label: 'Excel文件数据源' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF9800', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('fileSource')}
                  </span>
                  <span>Excel文件数据源</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'validateProcess', data: { label: '数据校验' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'validateProcess',
                        data: { label: '数据校验' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'validateProcess',
                        data: { label: '数据校验' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#9C27B0', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('validateProcess')}
                  </span>
                  <span>数据校验</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'mysqlTableTarget', data: { label: 'MySQL目标表' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mysqlTableTarget',
                        data: { label: 'MySQL目标表' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mysqlTableTarget',
                        data: { label: 'MySQL目标表' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#2196F3', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('mysqlTableTarget')}
                  </span>
                  <span>MySQL目标表</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'mongoCollectionTarget', data: { label: 'MongoDB集合存储' }});
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mongoCollectionTarget',
                        data: { label: 'MongoDB集合存储' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'mongoCollectionTarget',
                        data: { label: 'MongoDB集合存储' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#1976D2', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('mongoCollectionTarget')}
                  </span>
                  <span>MongoDB集合存储</span>
                </div>
              </div>

              <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                    onUpdateNode(props.id, { type: 'fileTarget', data: { label: '导出Excel文件' } });
                  } else if (typeof onAddNode === 'function') {
                    if (props.isEdge) {
                      // 连接线模式：创建新节点对象并传递源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fileTarget',
                        data: { label: '导出Excel文件' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    } else {
                      // 节点模式：传递新节点对象和源节点ID
                      const newNode = {
                        id: `node-${Date.now()}`,
                        type: 'fileTarget',
                        data: { label: '导出Excel文件' }
                        // 不传递position，让addNode函数计算位置
                      };
                      onAddNode(newNode, props.id);
                    }
                  }
                  handleOpenChange(false);
                }}>
                  <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF5722', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('fileTarget')}
                  </span>
                  <span>导出Excel文件</span>
                </div>
              </div>

              {/* <div className='popover-content' >
                <div onClick={(e) => {
                  e.stopPropagation();
                  console.log(data, props, '-----------');

                  const newNode = {
                    id: `node-${Date.now()}`,
                    type: 'end',
                    data: { label: '结束' },

                    position: { x: (props && props.positionAbsoluteX) ? props.positionAbsoluteX + props.width + 100 : 300, y: (props && props.positionAbsoluteY) ? props.positionAbsoluteY + 0 : 100 },
                  };
                  if (typeof onAddNode === 'function') onAddNode(newNode);
                  setOpen(false);
                }}>
                  <span className="app-iconify anticon" style={{ height: 18, fontSize: 16, padding: '1px 2px', borderRadius: 4, background: '#EE4A4A', color: 'white', display: 'inline-flex' }}>
                    {getNodeIcon('end')}
                  </span>
                  <span>结束</span>
                </div>
              </div> */}

            </>
          }
        >
          {
            !isEdge && (
              <>
                <Tooltip 
                  placement="top"
                  color={'#fff'}
                  title={(
                    <>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span style={{ fontSize: 14 }}>点击添加节点</span>
                        <span style={{ fontSize: 14 }}>
                          拖拽链接节点
                        </span>
                      </div>
                    </>
                  )}
                  >
                  <div
                    className="iconSvg" 
                    onClick={(e) => {
                      setOpen(true); e.stopPropagation(); 
                    }} 
                  >
                    {/* <span style={{color: '#000'}}>11</span> */}
                    {/* {jiaSvg} */}
                    <div className="svg"  >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" data-icon="Plus02" aria-hidden="true"><g id="plus"><path id="Icon" d="M5.00004 2.08325V7.91659M2.08337 4.99992H7.91671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                    </div>
                  </div>
                </Tooltip>
              
              
              </>
            ) || (
              <>
                <div
                    className="iconSvg" 
                    onClick={(e) => {
                      setOpen(true); e.stopPropagation(); 
                    }} 
                  >
                    {/* <span style={{color: '#000'}}>22</span> */}
                    {/* {jiaSvg} */}
                    <div className="svg"  >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" data-icon="Plus02" aria-hidden="true"><g id="plus"><path id="Icon" d="M5.00004 2.08325V7.91659M2.08337 4.99992H7.91671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                    </div>
                  </div>
              </>
            )
          }
          

        </Popover>
      </span>
    )
  }

  if (type === 'ifElseProcess' && !isEdge) {
    const [openNum, setOpenNum] = useState(null);
    
    const handleOpenChange = (index, open) => {
      setOpenNum(open ? index : null)
    };
    
    return (
      <>
        {
          (data?.config?.branches || [{label: 'IF'}, {label: 'ELSE IF'}]).map((branch, index) => {
            const topPx = `${38 + index * 18}px`;
            const isOpen = openNum === index || false;
            return (
              <React.Fragment key={index}>
                <div style={{ textAlign: 'right' }}>
                  <label>{branch.label || branch.name || (index ? 'ELSE IF' : 'IF')}</label>
                </div>
                <Handle
                  key={`switch-${index}`}
                  type="source"
                  id={props.id + '-start-switch-' + index}
                  position={Position.Right}
                  style={{ ...DEFAULT_HANDLE_STYLE, top: topPx, }}
                  isConnectable={isConnectable}
                >
                  <span 
                    className={['jia', isOpen && 'selected-jia'].join(' ')}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenChange(index, !isOpen);
                    }}
                  >
                    <Popover
                      trigger="manual"
                      placement="right"
                      open={isOpen}
                      destroyOnHidden={false}
                      content={
                        <>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'sourceDataset', data: { label: '数据源' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'sourceDataset',
                                    data: { label: '数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'sourceDataset',
                                    data: { label: '数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#2B7FFF', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('sourceDataset')}
                              </span>
                              <span>数据源</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'nlpProcess', data: { label: 'NLP模型' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'nlpProcess',
                                    data: { label: 'NLP模型' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'nlpProcess',
                                    data: { label: 'NLP模型' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#AD46FF', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('nlpProcess')}
                              </span>
                              <span>NPL模型</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'fieldTransform', data: { label: '字段转换' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fieldTransform',
                                    data: { label: '字段转换' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fieldTransform',
                                    data: { label: '字段转换' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF6900', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('fieldTransform')}
                              </span>
                              <span>字段转换</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'targetDataset', data: { label: '输出目标字段' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'targetDataset',
                                    data: { label: '输出目标字段' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'targetDataset',
                                    data: { label: '输出目标字段' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#00C950', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('targetDataset')}
                              </span>
                              <span>输出目标字段</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'scriptProcess', data: { label: '脚本执行' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'scriptProcess',
                                    data: { label: '脚本执行' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'scriptProcess',
                                    data: { label: '脚本执行' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FD9D2F', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('scriptProcess')}
                              </span>
                              <span>脚本执行</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { 
                                  type: 'ifElseProcess', 
                                  data: { 
                                    label: '条件分支',
                                    config: {
                                      branches: [
                                        { condition: '' },
                                        { condition: '' },
                                      ]
                                    }
                                  }
                                });
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'ifElseProcess',
                                    data: { 
                                      label: '条件分支',
                                      config: {
                                        branches: [
                                          { condition: '' },
                                          { condition: '' },
                                        ]
                                      }
                                    }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'ifElseProcess',
                                    data: { 
                                      label: '条件分支',
                                      config: {
                                        branches: [
                                          { condition: '' },
                                          { condition: '' },
                                        ]
                                      }
                                    }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#00C950', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('ifElseProcess')}
                              </span>
                              <span>条件分支</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'mysqlTableSource', data: { label: 'MySQL数据源' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mysqlTableSource',
                                    data: { label: 'MySQL数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mysqlTableSource',
                                    data: { label: 'MySQL数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#4CAF50', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('mysqlTableSource')}
                              </span>
                              <span>MySQL数据源</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'mongoCollectionSource', data: { label: 'MongoDB数据源' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mongoCollectionSource',
                                    data: { label: 'MongoDB数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mongoCollectionSource',
                                    data: { label: 'MongoDB数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#47A248', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('mongoCollectionSource')}
                              </span>
                              <span>MongoDB数据源</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'fileSource', data: { label: 'Excel文件数据源' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fileSource',
                                    data: { label: 'Excel文件数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fileSource',
                                    data: { label: 'Excel文件数据源' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF9800', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('fileSource')}
                              </span>
                              <span>Excel文件数据源</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'validateProcess', data: { label: '数据校验' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'validateProcess',
                                    data: { label: '数据校验' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'validateProcess',
                                    data: { label: '数据校验' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#9C27B0', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('validateProcess')}
                              </span>
                              <span>数据校验</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'mysqlTableTarget', data: { label: 'MySQL目标表' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mysqlTableTarget',
                                    data: { label: 'MySQL目标表' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mysqlTableTarget',
                                    data: { label: 'MySQL目标表' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#2196F3', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('mysqlTableTarget')}
                              </span>
                              <span>MySQL目标表</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'mongoCollectionTarget', data: { label: 'MongoDB集合存储' }});
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mongoCollectionTarget',
                                    data: { label: 'MongoDB集合存储' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'mongoCollectionTarget',
                                    data: { label: 'MongoDB集合存储' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#1976D2', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('mongoCollectionTarget')}
                              </span>
                              <span>MongoDB集合存储</span>
                            </div>
                          </div>
                          <div className='popover-content' >
                            <div onClick={(e) => {
                              e.stopPropagation();
                              console.log(data, props, '-----------');

                              if (props?.data?.placeholder && typeof onUpdateNode === 'function') {
                                onUpdateNode(props.id, { type: 'fileTarget', data: { label: '导出Excel文件' } });
                              } else if (typeof onAddNode === 'function') {
                                if (props.isEdge) {
                                  // 连接线模式：创建新节点对象并传递源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fileTarget',
                                    data: { label: '导出Excel文件' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                } else {
                                  // 节点模式：传递新节点对象和源节点ID
                                  const newNode = {
                                    id: `node-${Date.now()}`,
                                    type: 'fileTarget',
                                    data: { label: '导出Excel文件' }
                                    // 不传递position，让addNode函数计算位置
                                  };
                                  onAddNode(newNode, props.id);
                                }
                              }
                              handleOpenChange(index, false);
                            }}>
                              <span className="app-iconify anticon" style={{ fontSize: 16, background: '#FF5722', color: 'white', display: 'inline-flex' }}>
                                {getNodeIcon('fileTarget')}
                              </span>
                              <span>导出Excel文件</span>
                            </div>
                          </div>
                        </>
                      }
                    >
                      <div
                        className="iconSvg" 
                        onClick={(e) => {
                          setOpen(true);
                        }} 
                      >
                        <div className="svg"  >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5" data-icon="Plus02" aria-hidden="true"><g id="plus"><path id="Icon" d="M5.00004 2.08325V7.91659M2.08337 4.99992H7.91671" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></g></svg>
                        </div>
                      </div>
                    </Popover>
                  </span>
                </Handle>
              </React.Fragment>
            )
          })
        }
      </>
    );
  }

  return (
    <>
      <Handle
          type="source"
          id={props.id + '-start'}
          data={{ portType: "text", group: "llm", }}
          position={Position.Right}
          style={{ ...DEFAULT_HANDLE_STYLE, top: '50%', right: (props.type === 'start') ? '-6px' : DEFAULT_HANDLE_STYLE.right }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        >
         <HandleContent />
        </Handle>
    </>
  )
})

const HandleEnd = React.memo((props) => {
    const { data, isConnectable, onCopyNode, onDeleteNode } = props;
    
  return (
    <>
      <Handle
        type="target"
        id={props.id + '-end'}
        data={{ portType: "text", group: "llm", }}
        position={Position.Left}
        style={{ ...DEFAULT_HANDLE_STYLE, left: (props.type === 'end') ? '-6px' : '-11px', top: '50%' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      >
        
      </Handle>
    </>
  )
});

export const defaultColors = {
  sourceDataset: '#2B7FFF',
  mysqlTableSource: '#4CAF50',
  mongoCollectionSource: '#47A248',
  fileSource: '#FF9800',
  nlpProcess: '#AD46FF',
  fieldTransform: '#FF6900',
  validateProcess: '#9C27B0',
  targetDataset: '#00C950',
  mysqlTableTarget: '#2196F3',
  mongoCollectionTarget: '#1976D2',
  fileTarget: '#FF5722',
  scriptProcess: '#FD9D2F',
  ifElseProcess: '#4165D7',
  llmProcess: '#4165D7',
  end: '#EE4A4A',
}

const DEFAULT_HANDLE_STYLE = {
  position: 'absolute',
  width: 2,
  height: 10,
  bottom: -5,
  right: -11,
};


const Operate = React.memo(({ del, onCopyNode, onDeleteNode, onOpenLogModal }) => {
  const items = [
    { key: '1', label: '复制' },
    { key: '2', label: '删除' },
    { key: '3', label: '查看日志' },
  ].filter(item => !(del && item.key === '1')); // 如果 del 为 true，则过滤掉复制选项

  const stopMenuEvent = (event) => {
    if (event && typeof event.stopPropagation === 'function') {
      event.stopPropagation();
    }
  };

  const handleMenuClick = ({ key, domEvent }) => {
    // prevent the menu interaction from bubbling up and triggering
    // the parent node's click handler (which opens the edit drawer)
    if (domEvent && typeof domEvent.stopPropagation === 'function') {
      domEvent.stopPropagation();
    }

    if (key === '1') {
      onCopyNode && onCopyNode();
    } else if (key === '2') {
      onDeleteNode && onDeleteNode();
    } else if (key === '3') {
      onOpenLogModal && onOpenLogModal();
    }
  };

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        items,
        onClick: handleMenuClick,
      }}
    >
      <Space onClick={stopMenuEvent} onPointerDown={stopMenuEvent}>
        <EllipsisOutlined />
      </Space>
    </Dropdown>
  );
});


const jiaSvg = <svg t="1772521474781" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3271" width="8" height="8"><path d="M469.333333 469.333333V170.666667h85.333334v298.666666h298.666666v85.333334h-298.666666v298.666666h-85.333334v-298.666666H170.666667v-85.333334h298.666666z" fill="#444444" p-id="3272"></path></svg>

// 定义不同节点类型的SVG图标
export const getNodeIcon = (type) => {
  switch (type) {
    case 'start':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify iconify--tabler">
          <g fill="none" stroke="currentColor"  strokeLinejoin="round" strokeWidth="2">
            <path d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
          </g>
        </svg>
      );
    case 'sourceDataset':
      return (
        <svg version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="12px" height="14px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="BGPattern" patternUnits="userSpaceOnUse" alignment="0 0" image-repeat="None" />
            <mask fill="white" id="Clip215">
              <path d="M 2.5390625 5.664062500000001  C 3.611979166666667 5.888020833333334  4.765625 6  6 6  C 7.234375 6  8.388020833333334 5.888020833333334  9.4609375 5.664062500000001  C 10.533854166666668 5.440104166666665  11.380208333333334 5.109374999999999  12 4.671874999999999  L 12 6  C 12 6.359375  11.731770833333332 6.692708333333333  11.1953125 7  C 10.658854166666668 7.307291666666665  9.9296875 7.550781249999999  9.0078125 7.73046875  C 8.0859375 7.91015625  7.083333333333334 8  6 8  C 4.916666666666667 8  3.9140625 7.91015625  2.9921875 7.73046875  C 2.0703125 7.550781249999999  1.3411458333333335 7.307291666666665  0.8046875 7  C 0.26822916666666663 6.692708333333333  0 6.359375  0 6  L 0 4.671874999999999  C 0.6197916666666667 5.109374999999999  1.4661458333333335 5.440104166666665  2.5390625 5.664062500000001  Z M 2.5390625 11.6640625  C 3.611979166666667 11.888020833333336  4.765625 12  6 12  C 7.234375 12  8.388020833333334 11.888020833333336  9.4609375 11.6640625  C 10.533854166666668 11.440104166666666  11.380208333333334 11.109375  12 10.671875  L 12 12  C 12 12.359375  11.731770833333332 12.692708333333334  11.1953125 13  C 10.658854166666668 13.307291666666666  9.9296875 13.55078125  9.0078125 13.73046875  C 8.0859375 13.91015625  7.083333333333334 14  6 14  C 4.916666666666667 14  3.9140625 13.91015625  2.9921875 13.73046875  C 2.0703125 13.55078125  1.3411458333333335 13.307291666666666  0.8046875 13  C 0.26822916666666663 12.692708333333334  0 12.359375  0 12  L 0 10.671875  C 0.6197916666666667 11.109375  1.4661458333333335 11.440104166666666  2.5390625 11.6640625  Z M 2.5390625 8.6640625  C 3.611979166666667 8.888020833333332  4.765625 9  6 9  C 7.234375 9  8.388020833333334 8.888020833333332  9.4609375 8.6640625  C 10.533854166666668 8.440104166666666  11.380208333333334 8.109375  12 7.671875  L 12 9  C 12 9.359375  11.731770833333332 9.692708333333332  11.1953125 10  C 10.658854166666668 10.307291666666668  9.9296875 10.55078125  9.0078125 10.73046875  C 8.0859375 10.91015625  7.083333333333334 11  6 11  C 4.916666666666667 11  3.9140625 10.91015625  2.9921875 10.73046875  C 2.0703125 10.55078125  1.3411458333333335 10.307291666666668  0.8046875 10  C 0.26822916666666663 9.692708333333332  0 9.359375  0 9  L 0 7.671875  C 0.6197916666666667 8.109375  1.4661458333333335 8.440104166666666  2.5390625 8.6640625  Z M 2.9921875 0.26953124999999933  C 3.9140625 0.08984374999999978  4.916666666666667 0  6 0  C 7.083333333333334 0  8.0859375 0.08984374999999978  9.0078125 0.26953124999999933  C 9.9296875 0.44921875000000044  10.658854166666668 0.6927083333333328  11.1953125 0.9999999999999996  C 11.731770833333332 1.3072916666666663  12 1.640625  12 2.000000000000001  L 12 3  C 12 3.359374999999999  11.731770833333332 3.6927083333333313  11.1953125 4  C 10.658854166666668 4.307291666666666  9.9296875 4.55078125  9.0078125 4.73046875  C 8.0859375 4.91015625  7.083333333333334 4.999999999999999  6 4.999999999999999  C 4.916666666666667 4.999999999999999  3.9140625 4.91015625  2.9921875 4.73046875  C 2.0703125 4.55078125  1.3411458333333335 4.307291666666666  0.8046875 4  C 0.26822916666666663 3.6927083333333313  0 3.359374999999999  0 3  L 0 2.000000000000001  C 0 1.640625  0.26822916666666663 1.3072916666666663  0.8046875 0.9999999999999996  C 1.3411458333333335 0.6927083333333328  2.0703125 0.44921875000000044  2.9921875 0.26953124999999933  Z " fillRule="evenodd" />
            </mask>
          </defs>
          <g transform="matrix(1 0 0 1 -29 -153 )">
            <path d="M 2.5390625 5.664062500000001  C 3.611979166666667 5.888020833333334  4.765625 6  6 6  C 7.234375 6  8.388020833333334 5.888020833333334  9.4609375 5.664062500000001  C 10.533854166666668 5.440104166666665  11.380208333333334 5.109374999999999  12 4.671874999999999  L 12 6  C 12 6.359375  11.731770833333332 6.692708333333333  11.1953125 7  C 10.658854166666668 7.307291666666665  9.9296875 7.550781249999999  9.0078125 7.73046875  C 8.0859375 7.91015625  7.083333333333334 8  6 8  C 4.916666666666667 8  3.9140625 7.91015625  2.9921875 7.73046875  C 2.0703125 7.550781249999999  1.3411458333333335 7.307291666666665  0.8046875 7  C 0.26822916666666663 6.692708333333333  0 6.359375  0 6  L 0 4.671874999999999  C 0.6197916666666667 5.109374999999999  1.4661458333333335 5.440104166666665  2.5390625 5.664062500000001  Z M 2.5390625 11.6640625  C 3.611979166666667 11.888020833333336  4.765625 12  6 12  C 7.234375 12  8.388020833333334 11.888020833333336  9.4609375 11.6640625  C 10.533854166666668 11.440104166666666  11.380208333333334 11.109375  12 10.671875  L 12 12  C 12 12.359375  11.731770833333332 12.692708333333334  11.1953125 13  C 10.658854166666668 13.307291666666666  9.9296875 13.55078125  9.0078125 13.73046875  C 8.0859375 13.91015625  7.083333333333334 14  6 14  C 4.916666666666667 14  3.9140625 13.91015625  2.9921875 13.73046875  C 2.0703125 13.55078125  1.3411458333333335 13.307291666666666  0.8046875 13  C 0.26822916666666663 12.692708333333334  0 12.359375  0 12  L 0 10.671875  C 0.6197916666666667 11.109375  1.4661458333333335 11.440104166666666  2.5390625 11.6640625  Z M 2.5390625 8.6640625  C 3.611979166666667 8.888020833333332  4.765625 9  6 9  C 7.234375 9  8.388020833333334 8.888020833333332  9.4609375 8.6640625  C 10.533854166666668 8.440104166666666  11.380208333333334 8.109375  12 7.671875  L 12 9  C 12 9.359375  11.731770833333332 9.692708333333332  11.1953125 10  C 10.658854166666668 10.307291666666668  9.9296875 10.55078125  9.0078125 10.73046875  C 8.0859375 10.91015625  7.083333333333334 11  6 11  C 4.916666666666667 11  3.9140625 10.91015625  2.9921875 10.73046875  C 2.0703125 10.55078125  1.3411458333333335 10.307291666666668  0.8046875 10  C 0.26822916666666663 9.692708333333332  0 9.359375  0 9  L 0 7.671875  C 0.6197916666666667 8.109375  1.4661458333333335 8.440104166666666  2.5390625 8.6640625  Z M 2.9921875 0.26953124999999933  C 3.9140625 0.08984374999999978  4.916666666666667 0  6 0  C 7.083333333333334 0  8.0859375 0.08984374999999978  9.0078125 0.26953124999999933  C 9.9296875 0.44921875000000044  10.658854166666668 0.6927083333333328  11.1953125 0.9999999999999996  C 11.731770833333332 1.3072916666666663  12 1.640625  12 2.000000000000001  L 12 3  C 12 3.359374999999999  11.731770833333332 3.6927083333333313  11.1953125 4  C 10.658854166666668 4.307291666666666  9.9296875 4.55078125  9.0078125 4.73046875  C 8.0859375 4.91015625  7.083333333333334 4.999999999999999  6 4.999999999999999  C 4.916666666666667 4.999999999999999  3.9140625 4.91015625  2.9921875 4.73046875  C 2.0703125 4.55078125  1.3411458333333335 4.307291666666666  0.8046875 4  C 0.26822916666666663 3.6927083333333313  0 3.359374999999999  0 3  L 0 2.000000000000001  C 0 1.640625  0.26822916666666663 1.3072916666666663  0.8046875 0.9999999999999996  C 1.3411458333333335 0.6927083333333328  2.0703125 0.44921875000000044  2.9921875 0.26953124999999933  Z " fillRule="nonzero" fill="rgba(255, 255, 255, 1)" stroke="none" transform="matrix(1 0 0 1 29 153 )" className="fill" />
            <path d="M 2.5390625 5.664062500000001  C 3.611979166666667 5.888020833333334  4.765625 6  6 6  C 7.234375 6  8.388020833333334 5.888020833333334  9.4609375 5.664062500000001  C 10.533854166666668 5.440104166666665  11.380208333333334 5.109374999999999  12 4.671874999999999  L 12 6  C 12 6.359375  11.731770833333332 6.692708333333333  11.1953125 7  C 10.658854166666668 7.307291666666665  9.9296875 7.550781249999999  9.0078125 7.73046875  C 8.0859375 7.91015625  7.083333333333334 8  6 8  C 4.916666666666667 8  3.9140625 7.91015625  2.9921875 7.73046875  C 2.0703125 7.550781249999999  1.3411458333333335 7.307291666666665  0.8046875 7  C 0.26822916666666663 6.692708333333333  0 6.359375  0 6  L 0 4.671874999999999  C 0.6197916666666667 5.109374999999999  1.4661458333333335 5.440104166666665  2.5390625 5.664062500000001  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 29 153 )" className="stroke" mask="url(#Clip215)" />
            <path d="M 2.5390625 11.6640625  C 3.611979166666667 11.888020833333336  4.765625 12  6 12  C 7.234375 12  8.388020833333334 11.888020833333336  9.4609375 11.6640625  C 10.533854166666668 11.440104166666666  11.380208333333334 11.109375  12 10.671875  L 12 12  C 12 12.359375  11.731770833333332 12.692708333333334  11.1953125 13  C 10.658854166666668 13.307291666666666  9.9296875 13.55078125  9.0078125 13.73046875  C 8.0859375 13.91015625  7.083333333333334 14  6 14  C 4.916666666666667 14  3.9140625 13.91015625  2.9921875 13.73046875  C 2.0703125 13.55078125  1.3411458333333335 13.307291666666666  0.8046875 13  C 0.26822916666666663 12.692708333333334  0 12.359375  0 12  L 0 10.671875  C 0.6197916666666667 11.109375  1.4661458333333335 11.440104166666666  2.5390625 11.6640625  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 29 153 )" className="stroke" mask="url(#Clip215)" />
            <path d="M 2.5390625 8.6640625  C 3.611979166666667 8.888020833333332  4.765625 9  6 9  C 7.234375 9  8.388020833333334 8.888020833333332  9.4609375 8.6640625  C 10.533854166666668 8.440104166666666  11.380208333333334 8.109375  12 7.671875  L 12 9  C 12 9.359375  11.731770833333332 9.692708333333332  11.1953125 10  C 10.658854166666668 10.307291666666668  9.9296875 10.55078125  9.0078125 10.73046875  C 8.0859375 10.91015625  7.083333333333334 11  6 11  C 4.916666666666667 11  3.9140625 10.91015625  2.9921875 10.73046875  C 2.0703125 10.55078125  1.3411458333333335 10.307291666666668  0.8046875 10  C 0.26822916666666663 9.692708333333332  0 9.359375  0 9  L 0 7.671875  C 0.6197916666666667 8.109375  1.4661458333333335 8.440104166666666  2.5390625 8.6640625  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 29 153 )" className="stroke" mask="url(#Clip215)" />
            <path d="M 2.9921875 0.26953124999999933  C 3.9140625 0.08984374999999978  4.916666666666667 0  6 0  C 7.083333333333334 0  8.0859375 0.08984374999999978  9.0078125 0.26953124999999933  C 9.9296875 0.44921875000000044  10.658854166666668 0.6927083333333328  11.1953125 0.9999999999999996  C 11.731770833333332 1.3072916666666663  12 1.640625  12 2.000000000000001  L 12 3  C 12 3.359374999999999  11.731770833333332 3.6927083333333313  11.1953125 4  C 10.658854166666668 4.307291666666666  9.9296875 4.55078125  9.0078125 4.73046875  C 8.0859375 4.91015625  7.083333333333334 4.999999999999999  6 4.999999999999999  C 4.916666666666667 4.999999999999999  3.9140625 4.91015625  2.9921875 4.73046875  C 2.0703125 4.55078125  1.3411458333333335 4.307291666666666  0.8046875 4  C 0.26822916666666663 3.6927083333333313  0 3.359374999999999  0 3  L 0 2.000000000000001  C 0 1.640625  0.26822916666666663 1.3072916666666663  0.8046875 0.9999999999999996  C 1.3411458333333335 0.6927083333333328  2.0703125 0.44921875000000044  2.9921875 0.26953124999999933  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 29 153 )" className="stroke" mask="url(#Clip215)" />
          </g>
        </svg>
      );
    case 'nlpProcess':
      return (
        <svg version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="14px" height="14px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="BGPattern" patternUnits="userSpaceOnUse" alignment="0 0" image-repeat="None" />
            <mask fill="white" id="Clip216">
              <path d="M 9.884765625 9.884765625  C 10.373914930555557 9.395616319444443  10.715711805555557 8.822916666666666  10.91015625 8.166666666666666  L 9.916666666666668 8.166666666666666  C 9.758680555555557 8.166666666666666  9.621961805555557 8.108940972222221  9.506510416666668 7.993489583333334  C 9.39105902777778 7.878038194444444  9.333333333333332 7.741319444444444  9.333333333333332 7.583333333333334  L 9.333333333333332 6.416666666666667  C 9.333333333333332 6.2586805555555545  9.39105902777778 6.1219618055555545  9.506510416666668 6.006510416666667  C 9.621961805555557 5.891059027777779  9.758680555555557 5.833333333333333  9.916666666666668 5.833333333333333  L 10.91015625 5.833333333333333  C 10.715711805555557 5.177083333333333  10.373914930555557 4.6043836805555545  9.884765625 4.115234375  C 9.395616319444445 3.6260850694444438  8.822916666666668 3.2842881944444438  8.166666666666668 3.08984375  L 8.166666666666668 4.083333333333333  C 8.166666666666668 4.241319444444444  8.108940972222223 4.378038194444444  7.993489583333333 4.493489583333333  C 7.8780381944444455 4.6089409722222205  7.7413194444444455 4.666666666666667  7.583333333333333 4.666666666666667  L 6.416666666666666 4.666666666666667  C 6.258680555555556 4.666666666666667  6.121961805555556 4.6089409722222205  6.006510416666666 4.493489583333333  C 5.891059027777779 4.378038194444444  5.833333333333334 4.241319444444444  5.833333333333334 4.083333333333333  L 5.833333333333334 3.08984375  C 5.177083333333334 3.2842881944444438  4.604383680555555 3.6260850694444438  4.115234375 4.115234375  C 3.6260850694444446 4.6043836805555545  3.284288194444445 5.177083333333333  3.08984375 5.833333333333333  L 4.083333333333334 5.833333333333333  C 4.241319444444445 5.833333333333333  4.378038194444445 5.891059027777779  4.493489583333334 6.006510416666667  C 4.608940972222222 6.1219618055555545  4.666666666666666 6.2586805555555545  4.666666666666666 6.416666666666667  L 4.666666666666666 7.583333333333334  C 4.666666666666666 7.741319444444444  4.608940972222222 7.878038194444444  4.493489583333334 7.993489583333334  C 4.378038194444445 8.108940972222221  4.241319444444445 8.166666666666666  4.083333333333334 8.166666666666666  L 3.08984375 8.166666666666666  C 3.284288194444445 8.822916666666666  3.6260850694444446 9.395616319444443  4.115234375 9.884765625  C 4.604383680555555 10.373914930555554  5.177083333333334 10.715711805555555  5.833333333333334 10.91015625  L 5.833333333333334 9.916666666666666  C 5.833333333333334 9.758680555555554  5.891059027777779 9.621961805555554  6.006510416666666 9.506510416666666  C 6.121961805555556 9.391059027777779  6.258680555555556 9.333333333333334  6.416666666666666 9.333333333333334  L 7.583333333333333 9.333333333333334  C 7.7413194444444455 9.333333333333334  7.8780381944444455 9.391059027777779  7.993489583333333 9.506510416666666  C 8.108940972222223 9.621961805555554  8.166666666666668 9.758680555555554  8.166666666666668 9.916666666666666  L 8.166666666666668 10.91015625  C 8.822916666666668 10.715711805555555  9.395616319444445 10.373914930555554  9.884765625 9.884765625  Z M 13.826822916666668 6.006510416666667  C 13.942274305555555 6.1219618055555545  14 6.2586805555555545  14 6.416666666666667  L 14 7.583333333333334  C 14 7.741319444444444  13.942274305555555 7.878038194444444  13.826822916666668 7.993489583333334  C 13.71137152777778 8.108940972222221  13.57465277777778 8.166666666666666  13.416666666666668 8.166666666666666  L 12.11328125 8.166666666666666  C 11.888454861111112 9.144965277777779  11.419053819444445 9.991102430555554  10.705078125 10.705078125  C 9.991102430555557 11.419053819444443  9.144965277777779 11.88845486111111  8.166666666666668 12.11328125  L 8.166666666666668 13.416666666666668  C 8.166666666666668 13.574652777777777  8.108940972222223 13.711371527777777  7.993489583333333 13.826822916666668  C 7.8780381944444455 13.942274305555557  7.7413194444444455 14  7.583333333333333 14  L 6.416666666666666 14  C 6.258680555555556 14  6.121961805555556 13.942274305555557  6.006510416666666 13.826822916666668  C 5.891059027777779 13.711371527777777  5.833333333333334 13.574652777777777  5.833333333333334 13.416666666666668  L 5.833333333333334 12.11328125  C 4.855034722222222 11.88845486111111  4.008897569444445 11.419053819444443  3.294921875 10.705078125  C 2.580946180555556 9.991102430555554  2.1115451388888893 9.144965277777779  1.88671875 8.166666666666666  L 0.5833333333333333 8.166666666666666  C 0.42534722222222227 8.166666666666666  0.2886284722222222 8.108940972222221  0.17317708333333331 7.993489583333334  C 0.05772569444444445 7.878038194444444  0 7.741319444444444  0 7.583333333333334  L 0 6.416666666666667  C 0 6.2586805555555545  0.05772569444444445 6.1219618055555545  0.17317708333333331 6.006510416666667  C 0.2886284722222222 5.891059027777779  0.42534722222222227 5.833333333333333  0.5833333333333333 5.833333333333333  L 1.88671875 5.833333333333333  C 2.1115451388888893 4.855034722222221  2.580946180555556 4.008897569444444  3.294921875 3.294921875  C 4.008897569444445 2.5809461805555545  4.855034722222222 2.1115451388888875  5.833333333333334 1.88671875  L 5.833333333333334 0.5833333333333328  C 5.833333333333334 0.4253472222222203  5.891059027777779 0.2886284722222203  6.006510416666666 0.17317708333333282  C 6.121961805555556 0.057725694444443754  6.258680555555556 0  6.416666666666666 0  L 7.583333333333333 0  C 7.7413194444444455 0  7.8780381944444455 0.057725694444443754  7.993489583333333 0.17317708333333282  C 8.108940972222223 0.2886284722222203  8.166666666666668 0.4253472222222203  8.166666666666668 0.5833333333333328  L 8.166666666666668 1.88671875  C 9.144965277777779 2.1115451388888875  9.991102430555557 2.5809461805555545  10.705078125 3.294921875  C 11.419053819444445 4.008897569444444  11.888454861111112 4.855034722222221  12.11328125 5.833333333333333  L 13.416666666666668 5.833333333333333  C 13.57465277777778 5.833333333333333  13.71137152777778 5.891059027777779  13.826822916666668 6.006510416666667  Z " fillRule="evenodd" />
            </mask>
          </defs>
          <g transform="matrix(1 0 0 1 -28 -218 )">
            <path d="M 9.884765625 9.884765625  C 10.373914930555557 9.395616319444443  10.715711805555557 8.822916666666666  10.91015625 8.166666666666666  L 9.916666666666668 8.166666666666666  C 9.758680555555557 8.166666666666666  9.621961805555557 8.108940972222221  9.506510416666668 7.993489583333334  C 9.39105902777778 7.878038194444444  9.333333333333332 7.741319444444444  9.333333333333332 7.583333333333334  L 9.333333333333332 6.416666666666667  C 9.333333333333332 6.2586805555555545  9.39105902777778 6.1219618055555545  9.506510416666668 6.006510416666667  C 9.621961805555557 5.891059027777779  9.758680555555557 5.833333333333333  9.916666666666668 5.833333333333333  L 10.91015625 5.833333333333333  C 10.715711805555557 5.177083333333333  10.373914930555557 4.6043836805555545  9.884765625 4.115234375  C 9.395616319444445 3.6260850694444438  8.822916666666668 3.2842881944444438  8.166666666666668 3.08984375  L 8.166666666666668 4.083333333333333  C 8.166666666666668 4.241319444444444  8.108940972222223 4.378038194444444  7.993489583333333 4.493489583333333  C 7.8780381944444455 4.6089409722222205  7.7413194444444455 4.666666666666667  7.583333333333333 4.666666666666667  L 6.416666666666666 4.666666666666667  C 6.258680555555556 4.666666666666667  6.121961805555556 4.6089409722222205  6.006510416666666 4.493489583333333  C 5.891059027777779 4.378038194444444  5.833333333333334 4.241319444444444  5.833333333333334 4.083333333333333  L 5.833333333333334 3.08984375  C 5.177083333333334 3.2842881944444438  4.604383680555555 3.6260850694444438  4.115234375 4.115234375  C 3.6260850694444446 4.6043836805555545  3.284288194444445 5.177083333333333  3.08984375 5.833333333333333  L 4.083333333333334 5.833333333333333  C 4.241319444444445 5.833333333333333  4.378038194444445 5.891059027777779  4.493489583333334 6.006510416666667  C 4.608940972222222 6.1219618055555545  4.666666666666666 6.2586805555555545  4.666666666666666 6.416666666666667  L 4.666666666666666 7.583333333333334  C 4.666666666666666 7.741319444444444  4.608940972222222 7.878038194444444  4.493489583333334 7.993489583333334  C 4.378038194444445 8.108940972222221  4.241319444444445 8.166666666666666  4.083333333333334 8.166666666666666  L 3.08984375 8.166666666666666  C 3.284288194444445 8.822916666666666  3.6260850694444446 9.395616319444443  4.115234375 9.884765625  C 4.604383680555555 10.373914930555554  5.177083333333334 10.715711805555555  5.833333333333334 10.91015625  L 5.833333333333334 9.916666666666666  C 5.833333333333334 9.758680555555554  5.891059027777779 9.621961805555554  6.006510416666666 9.506510416666666  C 6.121961805555556 9.391059027777779  6.258680555555556 9.333333333333334  6.416666666666666 9.333333333333334  L 7.583333333333333 9.333333333333334  C 7.7413194444444455 9.333333333333334  7.8780381944444455 9.391059027777779  7.993489583333333 9.506510416666666  C 8.108940972222223 9.621961805555554  8.166666666666668 9.758680555555554  8.166666666666668 9.916666666666666  L 8.166666666666668 10.91015625  C 8.822916666666668 10.715711805555555  9.395616319444445 10.373914930555554  9.884765625 9.884765625  Z M 13.826822916666668 6.006510416666667  C 13.942274305555555 6.1219618055555545  14 6.2586805555555545  14 6.416666666666667  L 14 7.583333333333334  C 14 7.741319444444444  13.942274305555555 7.878038194444444  13.826822916666668 7.993489583333334  C 13.71137152777778 8.108940972222221  13.57465277777778 8.166666666666666  13.416666666666668 8.166666666666666  L 12.11328125 8.166666666666666  C 11.888454861111112 9.144965277777779  11.419053819444445 9.991102430555554  10.705078125 10.705078125  C 9.991102430555557 11.419053819444443  9.144965277777779 11.88845486111111  8.166666666666668 12.11328125  L 8.166666666666668 13.416666666666668  C 8.166666666666668 13.574652777777777  8.108940972222223 13.711371527777777  7.993489583333333 13.826822916666668  C 7.8780381944444455 13.942274305555557  7.7413194444444455 14  7.583333333333333 14  L 6.416666666666666 14  C 6.258680555555556 14  6.121961805555556 13.942274305555557  6.006510416666666 13.826822916666668  C 5.891059027777779 13.711371527777777  5.833333333333334 13.574652777777777  5.833333333333334 13.416666666666668  L 5.833333333333334 12.11328125  C 4.855034722222222 11.88845486111111  4.008897569444445 11.419053819444443  3.294921875 10.705078125  C 2.580946180555556 9.991102430555554  2.1115451388888893 9.144965277777779  1.88671875 8.166666666666666  L 0.5833333333333333 8.166666666666666  C 0.42534722222222227 8.166666666666666  0.2886284722222222 8.108940972222221  0.17317708333333331 7.993489583333334  C 0.05772569444444445 7.878038194444444  0 7.741319444444444  0 7.583333333333334  L 0 6.416666666666667  C 0 6.2586805555555545  0.05772569444444445 6.1219618055555545  0.17317708333333331 6.006510416666667  C 0.2886284722222222 5.891059027777779  0.42534722222222227 5.833333333333333  0.5833333333333333 5.833333333333333  L 1.88671875 5.833333333333333  C 2.1115451388888893 4.855034722222221  2.580946180555556 4.008897569444444  3.294921875 3.294921875  C 4.008897569444445 2.5809461805555545  4.855034722222222 2.1115451388888875  5.833333333333334 1.88671875  L 5.833333333333334 0.5833333333333328  C 5.833333333333334 0.4253472222222203  5.891059027777779 0.2886284722222203  6.006510416666666 0.17317708333333282  C 6.121961805555556 0.057725694444443754  6.258680555555556 0  6.416666666666666 0  L 7.583333333333333 0  C 7.7413194444444455 0  7.8780381944444455 0.057725694444443754  7.993489583333333 0.17317708333333282  C 8.108940972222223 0.2886284722222203  8.166666666666668 0.4253472222222203  8.166666666666668 0.5833333333333328  L 8.166666666666668 1.88671875  C 9.144965277777779 2.1115451388888875  9.991102430555557 2.5809461805555545  10.705078125 3.294921875  C 11.419053819444445 4.008897569444444  11.888454861111112 4.855034722222221  12.11328125 5.833333333333333  L 13.416666666666668 5.833333333333333  C 13.57465277777778 5.833333333333333  13.71137152777778 5.891059027777779  13.826822916666668 6.006510416666667  Z " fillRule="nonzero" fill="rgba(255, 255, 255, 1)" stroke="none" transform="matrix(1 0 0 1 28 218 )" className="fill" />
            <path d="M 9.884765625 9.884765625  C 10.373914930555557 9.395616319444443  10.715711805555557 8.822916666666666  10.91015625 8.166666666666666  L 9.916666666666668 8.166666666666666  C 9.758680555555557 8.166666666666666  9.621961805555557 8.108940972222221  9.506510416666668 7.993489583333334  C 9.39105902777778 7.878038194444444  9.333333333333332 7.741319444444444  9.333333333333332 7.583333333333334  L 9.333333333333332 6.416666666666667  C 9.333333333333332 6.2586805555555545  9.39105902777778 6.1219618055555545  9.506510416666668 6.006510416666667  C 9.621961805555557 5.891059027777779  9.758680555555557 5.833333333333333  9.916666666666668 5.833333333333333  L 10.91015625 5.833333333333333  C 10.715711805555557 5.177083333333333  10.373914930555557 4.6043836805555545  9.884765625 4.115234375  C 9.395616319444445 3.6260850694444438  8.822916666666668 3.2842881944444438  8.166666666666668 3.08984375  L 8.166666666666668 4.083333333333333  C 8.166666666666668 4.241319444444444  8.108940972222223 4.378038194444444  7.993489583333333 4.493489583333333  C 7.8780381944444455 4.6089409722222205  7.7413194444444455 4.666666666666667  7.583333333333333 4.666666666666667  L 6.416666666666666 4.666666666666667  C 6.258680555555556 4.666666666666667  6.121961805555556 4.6089409722222205  6.006510416666666 4.493489583333333  C 5.891059027777779 4.378038194444444  5.833333333333334 4.241319444444444  5.833333333333334 4.083333333333333  L 5.833333333333334 3.08984375  C 5.177083333333334 3.2842881944444438  4.604383680555555 3.6260850694444438  4.115234375 4.115234375  C 3.6260850694444446 4.6043836805555545  3.284288194444445 5.177083333333333  3.08984375 5.833333333333333  L 4.083333333333334 5.833333333333333  C 4.241319444444445 5.833333333333333  4.378038194444445 5.891059027777779  4.493489583333334 6.006510416666667  C 4.608940972222222 6.1219618055555545  4.666666666666666 6.2586805555555545  4.666666666666666 6.416666666666667  L 4.666666666666666 7.583333333333334  C 4.666666666666666 7.741319444444444  4.608940972222222 7.878038194444444  4.493489583333334 7.993489583333334  C 4.378038194444445 8.108940972222221  4.241319444444445 8.166666666666666  4.083333333333334 8.166666666666666  L 3.08984375 8.166666666666666  C 3.284288194444445 8.822916666666666  3.6260850694444446 9.395616319444443  4.115234375 9.884765625  C 4.604383680555555 10.373914930555554  5.177083333333334 10.715711805555555  5.833333333333334 10.91015625  L 5.833333333333334 9.916666666666666  C 5.833333333333334 9.758680555555554  5.891059027777779 9.621961805555554  6.006510416666666 9.506510416666666  C 6.121961805555556 9.391059027777779  6.258680555555556 9.333333333333334  6.416666666666666 9.333333333333334  L 7.583333333333333 9.333333333333334  C 7.7413194444444455 9.333333333333334  7.8780381944444455 9.391059027777779  7.993489583333333 9.506510416666666  C 8.108940972222223 9.621961805555554  8.166666666666668 9.758680555555554  8.166666666666668 9.916666666666666  L 8.166666666666668 10.91015625  C 8.822916666666668 10.715711805555555  9.395616319444445 10.373914930555554  9.884765625 9.884765625  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 218 )" className="stroke" mask="url(#Clip216)" />
            <path d="M 13.826822916666668 6.006510416666667  C 13.942274305555555 6.1219618055555545  14 6.2586805555555545  14 6.416666666666667  L 14 7.583333333333334  C 14 7.741319444444444  13.942274305555555 7.878038194444444  13.826822916666668 7.993489583333334  C 13.71137152777778 8.108940972222221  13.57465277777778 8.166666666666666  13.416666666666668 8.166666666666666  L 12.11328125 8.166666666666666  C 11.888454861111112 9.144965277777779  11.419053819444445 9.991102430555554  10.705078125 10.705078125  C 9.991102430555557 11.419053819444443  9.144965277777779 11.88845486111111  8.166666666666668 12.11328125  L 8.166666666666668 13.416666666666668  C 8.166666666666668 13.574652777777777  8.108940972222223 13.711371527777777  7.993489583333333 13.826822916666668  C 7.8780381944444455 13.942274305555557  7.7413194444444455 14  7.583333333333333 14  L 6.416666666666666 14  C 6.258680555555556 14  6.121961805555556 13.942274305555557  6.006510416666666 13.826822916666668  C 5.891059027777779 13.711371527777777  5.833333333333334 13.574652777777777  5.833333333333334 13.416666666666668  L 5.833333333333334 12.11328125  C 4.855034722222222 11.88845486111111  4.008897569444445 11.419053819444443  3.294921875 10.705078125  C 2.580946180555556 9.991102430555554  2.1115451388888893 9.144965277777779  1.88671875 8.166666666666666  L 0.5833333333333333 8.166666666666666  C 0.42534722222222227 8.166666666666666  0.2886284722222222 8.108940972222221  0.17317708333333331 7.993489583333334  C 0.05772569444444445 7.878038194444444  0 7.741319444444444  0 7.583333333333334  L 0 6.416666666666667  C 0 6.2586805555555545  0.05772569444444445 6.1219618055555545  0.17317708333333331 6.006510416666667  C 0.2886284722222222 5.891059027777779  0.42534722222222227 5.833333333333333  0.5833333333333333 5.833333333333333  L 1.88671875 5.833333333333333  C 2.1115451388888893 4.855034722222221  2.580946180555556 4.008897569444444  3.294921875 3.294921875  C 4.008897569444445 2.5809461805555545  4.855034722222222 2.1115451388888875  5.833333333333334 1.88671875  L 5.833333333333334 0.5833333333333328  C 5.833333333333334 0.4253472222222203  5.891059027777779 0.2886284722222203  6.006510416666666 0.17317708333333282  C 6.121961805555556 0.057725694444443754  6.258680555555556 0  6.416666666666666 0  L 7.583333333333333 0  C 7.7413194444444455 0  7.8780381944444455 0.057725694444443754  7.993489583333333 0.17317708333333282  C 8.108940972222223 0.2886284722222203  8.166666666666668 0.4253472222222203  8.166666666666668 0.5833333333333328  L 8.166666666666668 1.88671875  C 9.144965277777779 2.1115451388888875  9.991102430555557 2.5809461805555545  10.705078125 3.294921875  C 11.419053819444445 4.008897569444444  11.888454861111112 4.855034722222221  12.11328125 5.833333333333333  L 13.416666666666668 5.833333333333333  C 13.57465277777778 5.833333333333333  13.71137152777778 5.891059027777779  13.826822916666668 6.006510416666667  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 218 )" className="stroke" mask="url(#Clip216)" />
          </g>
        </svg>
      );
    case 'fieldTransform':
      return (
        <svg version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="17px" height="10px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="BGPattern" patternUnits="userSpaceOnUse" alignment="0 0" image-repeat="None" />
            <mask fill="white" id="Clip217">
              <path d="M 11.271354166666665 9.539930555555555  C 11.31267361111111 9.597800925925927  11.333333333333332 9.658564814814815  11.333333333333332 9.722222222222221  C 11.333333333333332 9.797453703703704  11.30529513888889 9.86255787037037  11.24921875 9.917534722222221  C 11.193142361111112 9.972511574074073  11.126736111111112 10  11.05 10  L 2.55 10  C 2.5027777777777778 10  2.4629340277777776 9.994212962962962  2.43046875 9.98263888888889  C 2.3980034722222223 9.971064814814815  2.3714409722222225 9.950810185185185  2.35078125 9.921875  C 2.3301215277777776 9.892939814814815  2.313888888888889 9.869791666666666  2.302083333333333 9.852430555555555  C 2.2902777777777783 9.835069444444445  2.2814236111111117 9.801793981481483  2.275520833333333 9.752604166666666  C 2.269618055555556 9.703414351851851  2.2666666666666666 9.67013888888889  2.2666666666666666 9.652777777777779  L 2.2666666666666666 9.539930555555555  L 2.2666666666666666 9.444444444444445  L 2.2666666666666666 8.055555555555555  L 2.2666666666666666 4.444444444444445  L 0.5666666666666667 4.444444444444445  C 0.41319444444444453 4.444444444444445  0.2803819444444445 4.389467592592592  0.16822916666666665 4.279513888888888  C 0.05607638888888889 4.169560185185185  0 4.039351851851851  0 3.8888888888888884  C 0 3.75  0.04427083333333333 3.6313657407407396  0.1328125 3.5329861111111116  L 2.966145833333333 0.1996527777777779  C 3.0782986111111117 0.0723379629629628  3.2229166666666664 0.008680555555555802  3.4000000000000004 0.008680555555555802  C 3.577083333333334 0.008680555555555802  3.7217013888888895 0.0723379629629628  3.833854166666667 0.1996527777777779  L 6.667187500000001 3.5329861111111116  C 6.755729166666667 3.6313657407407396  6.800000000000001 3.75  6.800000000000001 3.8888888888888884  C 6.800000000000001 4.039351851851851  6.743923611111112 4.169560185185185  6.6317708333333325 4.279513888888888  C 6.519618055555555 4.389467592592592  6.386805555555555 4.444444444444445  6.2333333333333325 4.444444444444445  L 4.533333333333333 4.444444444444445  L 4.533333333333333 7.777777777777778  L 9.633333333333333 7.777777777777778  C 9.72777777777778 7.777777777777778  9.8015625 7.809606481481483  9.8546875 7.873263888888888  L 11.271354166666665 9.539930555555555  Z M 16.831770833333334 5.720486111111112  C 16.943923611111114 5.830439814814814  17.000000000000004 5.960648148148147  17 6.111111111111112  C 17.000000000000004 6.25  16.955729166666668 6.368634259259258  16.8671875 6.467013888888888  L 14.033854166666668 9.800347222222221  C 13.915798611111112 9.933449074074073  13.771180555555556 10  13.600000000000001 10  C 13.428819444444445 10  13.284201388888889 9.933449074074073  13.166145833333335 9.800347222222221  L 10.3328125 6.467013888888888  C 10.244270833333335 6.368634259259258  10.2 6.25  10.2 6.111111111111112  C 10.2 5.960648148148147  10.25607638888889 5.830439814814814  10.368229166666666 5.720486111111112  C 10.480381944444444 5.6105324074074066  10.613194444444444 5.555555555555555  10.766666666666666 5.555555555555555  L 12.466666666666665 5.555555555555555  L 12.466666666666665 2.2222222222222223  L 7.366666666666667 2.2222222222222223  C 7.272222222222224 2.2222222222222223  7.198437500000002 2.1875  7.145312499999999 2.118055555555556  L 5.728645833333333 0.4513888888888884  C 5.687326388888889 0.3993055555555558  5.666666666666666 0.3414351851851849  5.666666666666666 0.2777777777777779  C 5.666666666666666 0.2025462962962954  5.694704861111111 0.1374421296296291  5.750781249999999 0.0824652777777779  C 5.806857638888888 0.027488425925924487  5.873263888888888 0  5.949999999999999 0  L 14.45 0  C 14.497222222222224 0  14.537065972222223 0.005787037037036091  14.56953125 0.017361111111111605  C 14.601996527777777 0.028935185185184897  14.628559027777778 0.04918981481481399  14.64921875 0.078125  C 14.669878472222223 0.1070601851851849  14.686111111111112 0.1302083333333337  14.697916666666668 0.1475694444444442  C 14.709722222222222 0.1649305555555558  14.718576388888891 0.1982060185185175  14.724479166666665 0.2473958333333337  C 14.730381944444444 0.2965856481481466  14.733333333333334 0.3298611111111116  14.733333333333334 0.3472222222222221  L 14.733333333333334 0.4600694444444442  L 14.733333333333334 0.5555555555555558  L 14.733333333333334 1.9444444444444442  L 14.733333333333334 5.555555555555555  L 16.433333333333334 5.555555555555555  C 16.586805555555557 5.555555555555555  16.719618055555557 5.6105324074074066  16.831770833333334 5.720486111111112  Z " fillRule="evenodd" />
            </mask>
          </defs>
          <g transform="matrix(1 0 0 1 -27 -285 )">
            <path d="M 11.271354166666665 9.539930555555555  C 11.31267361111111 9.597800925925927  11.333333333333332 9.658564814814815  11.333333333333332 9.722222222222221  C 11.333333333333332 9.797453703703704  11.30529513888889 9.86255787037037  11.24921875 9.917534722222221  C 11.193142361111112 9.972511574074073  11.126736111111112 10  11.05 10  L 2.55 10  C 2.5027777777777778 10  2.4629340277777776 9.994212962962962  2.43046875 9.98263888888889  C 2.3980034722222223 9.971064814814815  2.3714409722222225 9.950810185185185  2.35078125 9.921875  C 2.3301215277777776 9.892939814814815  2.313888888888889 9.869791666666666  2.302083333333333 9.852430555555555  C 2.2902777777777783 9.835069444444445  2.2814236111111117 9.801793981481483  2.275520833333333 9.752604166666666  C 2.269618055555556 9.703414351851851  2.2666666666666666 9.67013888888889  2.2666666666666666 9.652777777777779  L 2.2666666666666666 9.539930555555555  L 2.2666666666666666 9.444444444444445  L 2.2666666666666666 8.055555555555555  L 2.2666666666666666 4.444444444444445  L 0.5666666666666667 4.444444444444445  C 0.41319444444444453 4.444444444444445  0.2803819444444445 4.389467592592592  0.16822916666666665 4.279513888888888  C 0.05607638888888889 4.169560185185185  0 4.039351851851851  0 3.8888888888888884  C 0 3.75  0.04427083333333333 3.6313657407407396  0.1328125 3.5329861111111116  L 2.966145833333333 0.1996527777777779  C 3.0782986111111117 0.0723379629629628  3.2229166666666664 0.008680555555555802  3.4000000000000004 0.008680555555555802  C 3.577083333333334 0.008680555555555802  3.7217013888888895 0.0723379629629628  3.833854166666667 0.1996527777777779  L 6.667187500000001 3.5329861111111116  C 6.755729166666667 3.6313657407407396  6.800000000000001 3.75  6.800000000000001 3.8888888888888884  C 6.800000000000001 4.039351851851851  6.743923611111112 4.169560185185185  6.6317708333333325 4.279513888888888  C 6.519618055555555 4.389467592592592  6.386805555555555 4.444444444444445  6.2333333333333325 4.444444444444445  L 4.533333333333333 4.444444444444445  L 4.533333333333333 7.777777777777778  L 9.633333333333333 7.777777777777778  C 9.72777777777778 7.777777777777778  9.8015625 7.809606481481483  9.8546875 7.873263888888888  L 11.271354166666665 9.539930555555555  Z M 16.831770833333334 5.720486111111112  C 16.943923611111114 5.830439814814814  17.000000000000004 5.960648148148147  17 6.111111111111112  C 17.000000000000004 6.25  16.955729166666668 6.368634259259258  16.8671875 6.467013888888888  L 14.033854166666668 9.800347222222221  C 13.915798611111112 9.933449074074073  13.771180555555556 10  13.600000000000001 10  C 13.428819444444445 10  13.284201388888889 9.933449074074073  13.166145833333335 9.800347222222221  L 10.3328125 6.467013888888888  C 10.244270833333335 6.368634259259258  10.2 6.25  10.2 6.111111111111112  C 10.2 5.960648148148147  10.25607638888889 5.830439814814814  10.368229166666666 5.720486111111112  C 10.480381944444444 5.6105324074074066  10.613194444444444 5.555555555555555  10.766666666666666 5.555555555555555  L 12.466666666666665 5.555555555555555  L 12.466666666666665 2.2222222222222223  L 7.366666666666667 2.2222222222222223  C 7.272222222222224 2.2222222222222223  7.198437500000002 2.1875  7.145312499999999 2.118055555555556  L 5.728645833333333 0.4513888888888884  C 5.687326388888889 0.3993055555555558  5.666666666666666 0.3414351851851849  5.666666666666666 0.2777777777777779  C 5.666666666666666 0.2025462962962954  5.694704861111111 0.1374421296296291  5.750781249999999 0.0824652777777779  C 5.806857638888888 0.027488425925924487  5.873263888888888 0  5.949999999999999 0  L 14.45 0  C 14.497222222222224 0  14.537065972222223 0.005787037037036091  14.56953125 0.017361111111111605  C 14.601996527777777 0.028935185185184897  14.628559027777778 0.04918981481481399  14.64921875 0.078125  C 14.669878472222223 0.1070601851851849  14.686111111111112 0.1302083333333337  14.697916666666668 0.1475694444444442  C 14.709722222222222 0.1649305555555558  14.718576388888891 0.1982060185185175  14.724479166666665 0.2473958333333337  C 14.730381944444444 0.2965856481481466  14.733333333333334 0.3298611111111116  14.733333333333334 0.3472222222222221  L 14.733333333333334 0.4600694444444442  L 14.733333333333334 0.5555555555555558  L 14.733333333333334 1.9444444444444442  L 14.733333333333334 5.555555555555555  L 16.433333333333334 5.555555555555555  C 16.586805555555557 5.555555555555555  16.719618055555557 5.6105324074074066  16.831770833333334 5.720486111111112  Z " fillRule="nonzero" fill="rgba(255, 255, 255, 1)" stroke="none" transform="matrix(1 0 0 1 27 285 )" className="fill" />
            <path d="M 11.271354166666665 9.539930555555555  C 11.31267361111111 9.597800925925927  11.333333333333332 9.658564814814815  11.333333333333332 9.722222222222221  C 11.333333333333332 9.797453703703704  11.30529513888889 9.86255787037037  11.24921875 9.917534722222221  C 11.193142361111112 9.972511574074073  11.126736111111112 10  11.05 10  L 2.55 10  C 2.5027777777777778 10  2.4629340277777776 9.994212962962962  2.43046875 9.98263888888889  C 2.3980034722222223 9.971064814814815  2.3714409722222225 9.950810185185185  2.35078125 9.921875  C 2.3301215277777776 9.892939814814815  2.313888888888889 9.869791666666666  2.302083333333333 9.852430555555555  C 2.2902777777777783 9.835069444444445  2.2814236111111117 9.801793981481483  2.275520833333333 9.752604166666666  C 2.269618055555556 9.703414351851851  2.2666666666666666 9.67013888888889  2.2666666666666666 9.652777777777779  L 2.2666666666666666 9.539930555555555  L 2.2666666666666666 9.444444444444445  L 2.2666666666666666 8.055555555555555  L 2.2666666666666666 4.444444444444445  L 0.5666666666666667 4.444444444444445  C 0.41319444444444453 4.444444444444445  0.2803819444444445 4.389467592592592  0.16822916666666665 4.279513888888888  C 0.05607638888888889 4.169560185185185  0 4.039351851851851  0 3.8888888888888884  C 0 3.75  0.04427083333333333 3.6313657407407396  0.1328125 3.5329861111111116  L 2.966145833333333 0.1996527777777779  C 3.0782986111111117 0.0723379629629628  3.2229166666666664 0.008680555555555802  3.4000000000000004 0.008680555555555802  C 3.577083333333334 0.008680555555555802  3.7217013888888895 0.0723379629629628  3.833854166666667 0.1996527777777779  L 6.667187500000001 3.5329861111111116  C 6.755729166666667 3.6313657407407396  6.800000000000001 3.75  6.800000000000001 3.8888888888888884  C 6.800000000000001 4.039351851851851  6.743923611111112 4.169560185185185  6.6317708333333325 4.279513888888888  C 6.519618055555555 4.389467592592592  6.386805555555555 4.444444444444445  6.2333333333333325 4.444444444444445  L 4.533333333333333 4.444444444444445  L 4.533333333333333 7.777777777777778  L 9.633333333333333 7.777777777777778  C 9.72777777777778 7.777777777777778  9.8015625 7.809606481481483  9.8546875 7.873263888888888  L 11.271354166666665 9.539930555555555  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 27 285 )" className="stroke" mask="url(#Clip217)" />
            <path d="M 16.831770833333334 5.720486111111112  C 16.943923611111114 5.830439814814814  17.000000000000004 5.960648148148147  17 6.111111111111112  C 17.000000000000004 6.25  16.955729166666668 6.368634259259258  16.8671875 6.467013888888888  L 14.033854166666668 9.800347222222221  C 13.915798611111112 9.933449074074073  13.771180555555556 10  13.600000000000001 10  C 13.428819444444445 10  13.284201388888889 9.933449074074073  13.166145833333335 9.800347222222221  L 10.3328125 6.467013888888888  C 10.244270833333335 6.368634259259258  10.2 6.25  10.2 6.111111111111112  C 10.2 5.960648148148147  10.25607638888889 5.830439814814814  10.368229166666666 5.720486111111112  C 10.480381944444444 5.6105324074074066  10.613194444444444 5.555555555555555  10.766666666666666 5.555555555555555  L 12.466666666666665 5.555555555555555  L 12.466666666666665 2.2222222222222223  L 7.366666666666667 2.2222222222222223  C 7.272222222222224 2.2222222222222223  7.198437500000002 2.1875  7.145312499999999 2.118055555555556  L 5.728645833333333 0.4513888888888884  C 5.687326388888889 0.3993055555555558  5.666666666666666 0.3414351851851849  5.666666666666666 0.2777777777777779  C 5.666666666666666 0.2025462962962954  5.694704861111111 0.1374421296296291  5.750781249999999 0.0824652777777779  C 5.806857638888888 0.027488425925924487  5.873263888888888 0  5.949999999999999 0  L 14.45 0  C 14.497222222222224 0  14.537065972222223 0.005787037037036091  14.56953125 0.017361111111111605  C 14.601996527777777 0.028935185185184897  14.628559027777778 0.04918981481481399  14.64921875 0.078125  C 14.669878472222223 0.1070601851851849  14.686111111111112 0.1302083333333337  14.697916666666668 0.1475694444444442  C 14.709722222222222 0.1649305555555558  14.718576388888891 0.1982060185185175  14.724479166666665 0.2473958333333337  C 14.730381944444444 0.2965856481481466  14.733333333333334 0.3298611111111116  14.733333333333334 0.3472222222222221  L 14.733333333333334 0.4600694444444442  L 14.733333333333334 0.5555555555555558  L 14.733333333333334 1.9444444444444442  L 14.733333333333334 5.555555555555555  L 16.433333333333334 5.555555555555555  C 16.586805555555557 5.555555555555555  16.719618055555557 5.6105324074074066  16.831770833333334 5.720486111111112  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 27 285 )" className="stroke" mask="url(#Clip217)" />
          </g>
        </svg>
        
      );
    case 'targetDataset':
      return (
        <svg version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="15px" height="14px" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="BGPattern" patternUnits="userSpaceOnUse" alignment="0 0" image-repeat="None" />
            <mask fill="white" id="Clip218">
              <path d="M 11.3671875 12.71375  C 11.481370192307693 12.602916666666665  11.538461538461538 12.471666666666666  11.538461538461538 12.32  C 11.538461538461538 12.168333333333335  11.481370192307693 12.037083333333335  11.3671875 11.92625  C 11.253004807692308 11.815416666666666  11.117788461538463 11.76  10.961538461538462 11.76  C 10.805288461538462 11.76  10.670072115384617 11.815416666666666  10.555889423076923 11.92625  C 10.441706730769232 12.037083333333335  10.384615384615385 12.168333333333335  10.384615384615385 12.32  C 10.384615384615385 12.471666666666666  10.441706730769232 12.602916666666665  10.555889423076923 12.71375  C 10.670072115384617 12.824583333333335  10.805288461538462 12.88  10.961538461538462 12.88  C 11.117788461538463 12.88  11.253004807692308 12.824583333333335  11.3671875 12.71375  Z M 13.674879807692308 12.71375  C 13.789062499999998 12.602916666666665  13.846153846153847 12.471666666666666  13.846153846153847 12.32  C 13.846153846153847 12.168333333333335  13.789062499999998 12.037083333333335  13.674879807692308 11.92625  C 13.560697115384617 11.815416666666666  13.42548076923077 11.76  13.269230769230768 11.76  C 13.11298076923077 11.76  12.977764423076923 11.815416666666666  12.863581730769232 11.92625  C 12.74939903846154 12.037083333333335  12.692307692307692 12.168333333333335  12.692307692307692 12.32  C 12.692307692307692 12.471666666666666  12.74939903846154 12.602916666666665  12.863581730769232 12.71375  C 12.977764423076923 12.824583333333335  13.11298076923077 12.88  13.269230769230768 12.88  C 13.42548076923077 12.88  13.560697115384617 12.824583333333335  13.674879807692308 12.71375  Z M 14.747596153846153 9.765  C 14.915865384615385 9.928333333333331  15 10.126666666666665  15 10.36  L 15 13.16  C 15 13.393333333333333  14.915865384615385 13.591666666666667  14.747596153846153 13.755  C 14.579326923076925 13.918333333333335  14.375000000000002 14  14.134615384615385 14  L 0.8653846153846154 14  C 0.6250000000000001 14  0.420673076923077 13.918333333333335  0.25240384615384615 13.755  C 0.08413461538461538 13.591666666666667  0 13.393333333333333  0 13.16  L 0 10.36  C 0 10.126666666666665  0.08413461538461538 9.928333333333331  0.25240384615384615 9.765  C 0.420673076923077 9.601666666666668  0.6250000000000001 9.52  0.8653846153846154 9.52  L 4.714543269230769 9.52  C 4.8407451923076925 9.846666666666668  5.052584134615384 10.114999999999998  5.350060096153846 10.325000000000001  C 5.6475360576923075 10.535  5.979567307692308 10.64  6.346153846153846 10.64  L 8.653846153846153 10.64  C 9.020432692307693 10.64  9.352463942307692 10.535  9.649939903846153 10.325000000000001  C 9.947415865384615 10.114999999999998  10.159254807692308 9.846666666666668  10.285456730769232 9.52  L 14.134615384615385 9.52  C 14.375000000000002 9.52  14.579326923076925 9.601666666666668  14.747596153846153 9.765  Z M 11.944110576923077 4.08625  C 12.130408653846155 4.2612499999999995  12.172475961538463 4.4624999999999995  12.0703125 4.6899999999999995  C 11.96814903846154 4.923333333333332  11.790865384615385 5.04  11.538461538461538 5.04  L 9.230769230769232 5.04  L 9.230769230769232 8.96  C 9.230769230769232 9.111666666666666  9.173677884615385 9.242916666666666  9.059495192307692 9.353750000000002  C 8.945312500000002 9.464583333333334  8.810096153846153 9.52  8.653846153846153 9.52  L 6.346153846153846 9.52  C 6.189903846153847 9.52  6.054687500000001 9.464583333333334  5.9405048076923075 9.353750000000002  C 5.826322115384616 9.242916666666666  5.769230769230769 9.111666666666666  5.769230769230769 8.96  L 5.769230769230769 5.04  L 3.4615384615384617 5.04  C 3.2091346153846154 5.04  3.031850961538462 4.923333333333332  2.9296875 4.6899999999999995  C 2.8275240384615388 4.4624999999999995  2.8695913461538463 4.2612499999999995  3.055889423076923 4.08625  L 7.094350961538462 0.16624999999999956  C 7.202524038461538 0.055416666666666003  7.337740384615384 0  7.5 0  C 7.662259615384616 0  7.797475961538461 0.055416666666666003  7.905649038461539 0.16624999999999956  L 11.944110576923077 4.08625  Z " fillRule="evenodd" />
            </mask>
          </defs>
          <g transform="matrix(1 0 0 1 -28 -347 )">
            <path d="M 11.3671875 12.71375  C 11.481370192307693 12.602916666666665  11.538461538461538 12.471666666666666  11.538461538461538 12.32  C 11.538461538461538 12.168333333333335  11.481370192307693 12.037083333333335  11.3671875 11.92625  C 11.253004807692308 11.815416666666666  11.117788461538463 11.76  10.961538461538462 11.76  C 10.805288461538462 11.76  10.670072115384617 11.815416666666666  10.555889423076923 11.92625  C 10.441706730769232 12.037083333333335  10.384615384615385 12.168333333333335  10.384615384615385 12.32  C 10.384615384615385 12.471666666666666  10.441706730769232 12.602916666666665  10.555889423076923 12.71375  C 10.670072115384617 12.824583333333335  10.805288461538462 12.88  10.961538461538462 12.88  C 11.117788461538463 12.88  11.253004807692308 12.824583333333335  11.3671875 12.71375  Z M 13.674879807692308 12.71375  C 13.789062499999998 12.602916666666665  13.846153846153847 12.471666666666666  13.846153846153847 12.32  C 13.846153846153847 12.168333333333335  13.789062499999998 12.037083333333335  13.674879807692308 11.92625  C 13.560697115384617 11.815416666666666  13.42548076923077 11.76  13.269230769230768 11.76  C 13.11298076923077 11.76  12.977764423076923 11.815416666666666  12.863581730769232 11.92625  C 12.74939903846154 12.037083333333335  12.692307692307692 12.168333333333335  12.692307692307692 12.32  C 12.692307692307692 12.471666666666666  12.74939903846154 12.602916666666665  12.863581730769232 12.71375  C 12.977764423076923 12.824583333333335  13.11298076923077 12.88  13.269230769230768 12.88  C 13.42548076923077 12.88  13.560697115384617 12.824583333333335  13.674879807692308 12.71375  Z M 14.747596153846153 9.765  C 14.915865384615385 9.928333333333331  15 10.126666666666665  15 10.36  L 15 13.16  C 15 13.393333333333333  14.915865384615385 13.591666666666667  14.747596153846153 13.755  C 14.579326923076925 13.918333333333335  14.375000000000002 14  14.134615384615385 14  L 0.8653846153846154 14  C 0.6250000000000001 14  0.420673076923077 13.918333333333335  0.25240384615384615 13.755  C 0.08413461538461538 13.591666666666667  0 13.393333333333333  0 13.16  L 0 10.36  C 0 10.126666666666665  0.08413461538461538 9.928333333333331  0.25240384615384615 9.765  C 0.420673076923077 9.601666666666668  0.6250000000000001 9.52  0.8653846153846154 9.52  L 4.714543269230769 9.52  C 4.8407451923076925 9.846666666666668  5.052584134615384 10.114999999999998  5.350060096153846 10.325000000000001  C 5.6475360576923075 10.535  5.979567307692308 10.64  6.346153846153846 10.64  L 8.653846153846153 10.64  C 9.020432692307693 10.64  9.352463942307692 10.535  9.649939903846153 10.325000000000001  C 9.947415865384615 10.114999999999998  10.159254807692308 9.846666666666668  10.285456730769232 9.52  L 14.134615384615385 9.52  C 14.375000000000002 9.52  14.579326923076925 9.601666666666668  14.747596153846153 9.765  Z M 11.944110576923077 4.08625  C 12.130408653846155 4.2612499999999995  12.172475961538463 4.4624999999999995  12.0703125 4.6899999999999995  C 11.96814903846154 4.923333333333332  11.790865384615385 5.04  11.538461538461538 5.04  L 9.230769230769232 5.04  L 9.230769230769232 8.96  C 9.230769230769232 9.111666666666666  9.173677884615385 9.242916666666666  9.059495192307692 9.353750000000002  C 8.945312500000002 9.464583333333334  8.810096153846153 9.52  8.653846153846153 9.52  L 6.346153846153846 9.52  C 6.189903846153847 9.52  6.054687500000001 9.464583333333334  5.9405048076923075 9.353750000000002  C 5.826322115384616 9.242916666666666  5.769230769230769 9.111666666666666  5.769230769230769 8.96  L 5.769230769230769 5.04  L 3.4615384615384617 5.04  C 3.2091346153846154 5.04  3.031850961538462 4.923333333333332  2.9296875 4.6899999999999995  C 2.8275240384615388 4.4624999999999995  2.8695913461538463 4.2612499999999995  3.055889423076923 4.08625  L 7.094350961538462 0.16624999999999956  C 7.202524038461538 0.055416666666666003  7.337740384615384 0  7.5 0  C 7.662259615384616 0  7.797475961538461 0.055416666666666003  7.905649038461539 0.16624999999999956  L 11.944110576923077 4.08625  Z " fillRule="nonzero" fill="rgba(255, 255, 255, 1)" stroke="none" transform="matrix(1 0 0 1 28 347 )" className="fill" />
            <path d="M 11.3671875 12.71375  C 11.481370192307693 12.602916666666665  11.538461538461538 12.471666666666666  11.538461538461538 12.32  C 11.538461538461538 12.168333333333335  11.481370192307693 12.037083333333335  11.3671875 11.92625  C 11.253004807692308 11.815416666666666  11.117788461538463 11.76  10.961538461538462 11.76  C 10.805288461538462 11.76  10.670072115384617 11.815416666666666  10.555889423076923 11.92625  C 10.441706730769232 12.037083333333335  10.384615384615385 12.168333333333335  10.384615384615385 12.32  C 10.384615384615385 12.471666666666666  10.441706730769232 12.602916666666665  10.555889423076923 12.71375  C 10.670072115384617 12.824583333333335  10.805288461538462 12.88  10.961538461538462 12.88  C 11.117788461538463 12.88  11.253004807692308 12.824583333333335  11.3671875 12.71375  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 347 )" className="stroke" mask="url(#Clip218)" />
            <path d="M 13.674879807692308 12.71375  C 13.789062499999998 12.602916666666665  13.846153846153847 12.471666666666666  13.846153846153847 12.32  C 13.846153846153847 12.168333333333335  13.789062499999998 12.037083333333335  13.674879807692308 11.92625  C 13.560697115384617 11.815416666666666  13.42548076923077 11.76  13.269230769230768 11.76  C 13.11298076923077 11.76  12.977764423076923 11.815416666666666  12.863581730769232 11.92625  C 12.74939903846154 12.037083333333335  12.692307692307692 12.168333333333335  12.692307692307692 12.32  C 12.692307692307692 12.471666666666666  12.74939903846154 12.602916666666665  12.863581730769232 12.71375  C 12.977764423076923 12.824583333333335  13.11298076923077 12.88  13.269230769230768 12.88  C 13.42548076923077 12.88  13.560697115384617 12.824583333333335  13.674879807692308 12.71375  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 347 )" className="stroke" mask="url(#Clip218)" />
            <path d="M 14.747596153846153 9.765  C 14.915865384615385 9.928333333333331  15 10.126666666666665  15 10.36  L 15 13.16  C 15 13.393333333333333  14.915865384615385 13.591666666666667  14.747596153846153 13.755  C 14.579326923076925 13.918333333333335  14.375000000000002 14  14.134615384615385 14  L 0.8653846153846154 14  C 0.6250000000000001 14  0.420673076923077 13.918333333333335  0.25240384615384615 13.755  C 0.08413461538461538 13.591666666666667  0 13.393333333333333  0 13.16  L 0 10.36  C 0 10.126666666666665  0.08413461538461538 9.928333333333331  0.25240384615384615 9.765  C 0.420673076923077 9.601666666666668  0.6250000000000001 9.52  0.8653846153846154 9.52  L 4.714543269230769 9.52  C 4.8407451923076925 9.846666666666668  5.052584134615384 10.114999999999998  5.350060096153846 10.325000000000001  C 5.6475360576923075 10.535  5.979567307692308 10.64  6.346153846153846 10.64  L 8.653846153846153 10.64  C 9.020432692307693 10.64  9.352463942307692 10.535  9.649939903846153 10.325000000000001  C 9.947415865384615 10.114999999999998  10.159254807692308 9.846666666666668  10.285456730769232 9.52  L 14.134615384615385 9.52  C 14.375000000000002 9.52  14.579326923076925 9.601666666666668  14.747596153846153 9.765  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 347 )" className="stroke" mask="url(#Clip218)" />
            <path d="M 11.944110576923077 4.08625  C 12.130408653846155 4.2612499999999995  12.172475961538463 4.4624999999999995  12.0703125 4.6899999999999995  C 11.96814903846154 4.923333333333332  11.790865384615385 5.04  11.538461538461538 5.04  L 9.230769230769232 5.04  L 9.230769230769232 8.96  C 9.230769230769232 9.111666666666666  9.173677884615385 9.242916666666666  9.059495192307692 9.353750000000002  C 8.945312500000002 9.464583333333334  8.810096153846153 9.52  8.653846153846153 9.52  L 6.346153846153846 9.52  C 6.189903846153847 9.52  6.054687500000001 9.464583333333334  5.9405048076923075 9.353750000000002  C 5.826322115384616 9.242916666666666  5.769230769230769 9.111666666666666  5.769230769230769 8.96  L 5.769230769230769 5.04  L 3.4615384615384617 5.04  C 3.2091346153846154 5.04  3.031850961538462 4.923333333333332  2.9296875 4.6899999999999995  C 2.8275240384615388 4.4624999999999995  2.8695913461538463 4.2612499999999995  3.055889423076923 4.08625  L 7.094350961538462 0.16624999999999956  C 7.202524038461538 0.055416666666666003  7.337740384615384 0  7.5 0  C 7.662259615384616 0  7.797475961538461 0.055416666666666003  7.905649038461539 0.16624999999999956  L 11.944110576923077 4.08625  Z " strokeWidth="0" strokeDasharray="0" stroke="rgba(255, 255, 255, 0)" fill="none" transform="matrix(1 0 0 1 28 347 )" className="stroke" mask="url(#Clip218)" />
          </g>
        </svg>
      );

    case 'scriptProcess':
      return (
        <svg t="1773654446033" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5012" width="14" height="14">
          <path d="M787.4 918H238.8c-72 0-130.6-58.6-130.6-130.6V238.8c0-72 58.6-130.6 130.6-130.6h548.6c72 0 130.6 58.6 130.6 130.6v548.6c0 72-58.6 130.6-130.6 130.6zM238.8 168.2c-38.9 0-70.6 31.7-70.6 70.6v548.6c0 38.9 31.7 70.6 70.6 70.6h548.6c38.9 0 70.6-31.7 70.6-70.6V238.8c0-38.9-31.7-70.6-70.6-70.6H238.8z" p-id="5013" fill="#ffffff"></path>
          <path d="M451.1 728.8c-3.1 0-6.3-0.5-9.5-1.5-15.7-5.2-24.2-22.2-19-38l128-383.9c5.2-15.7 22.2-24.2 38-19 15.7 5.2 24.2 22.2 19 38l-128 383.9c-4.2 12.5-15.9 20.5-28.5 20.5zM643.1 661.9c-8.3 0-16.5-3.4-22.4-10.1-11-12.4-9.9-31.3 2.5-42.4l105.6-94-107.5-113c-11.4-12-10.9-31 1.1-42.4 12-11.4 31-10.9 42.4 1.1l128.8 135.6c5.6 5.9 8.6 13.8 8.2 21.9-0.3 8.1-4 15.7-10 21.2L663 654.3c-5.7 5.1-12.8 7.6-19.9 7.6zM385.9 661.9c-7.1 0-14.2-2.5-19.9-7.6L237.2 539.7c-6.1-5.4-9.7-13-10-21.2-0.3-8.1 2.6-16 8.2-21.9L364.2 361c11.4-12 30.4-12.5 42.4-1.1s12.5 30.4 1.1 42.4L300.2 515.5l105.6 94c12.4 11 13.5 30 2.5 42.4-5.9 6.6-14.2 10-22.4 10z" p-id="5014" fill="#ffffff"></path>
        </svg>
      );
    case 'ifElseProcess':
      return (
        <svg t="1773655651469" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7487" width="15" height="15"><path d="M832 272c0-62.4-51-112.9-113.6-112-60.7 0.9-110 50.6-110.4 111.3-0.3 52.6 35.6 96.8 84.2 109.2 14 3.6 23.8 16 24.1 30.4 0.5 27.3-4.4 57.4-22.3 82.5-28.7 40.3-80.7 54.9-126.6 67.8-29 8.1-50.1 10.2-68.7 12-26.4 2.6-51.4 5.1-82.6 23-6.6 3.8-13.1 8-19.2 12.6-5.3 4-12.8 0.2-12.8-6.4V241.3c0-12.2 6.8-23.5 17.7-28.9 37.1-18.4 62.6-56.8 62.3-101.1-0.5-62.8-53.2-113.4-116-111.2C288.1 2.1 240 51.4 240 112c0 44 25.4 82.1 62.3 100.4 10.9 5.4 17.7 16.5 17.7 28.6v541.7c0 12.2-6.8 23.5-17.7 28.9-37.1 18.4-62.6 56.8-62.3 101.1 0.4 62.8 53.1 113.3 115.9 111.2C416 1021.9 464 972.5 464 912c0-44-25.4-82.1-62.3-100.4-10.9-5.4-17.7-16.5-17.7-28.6v-19.2c0-42 19.9-81.8 54.3-105.9 3.1-2.2 6.4-4.3 9.7-6.2 19.3-11.1 33.5-12.5 57-14.8 20.2-2 45.3-4.5 79.7-14.1 50.5-14.2 119.6-33.5 161.4-92.3 24-33.7 35.4-75 34.1-123-0.2-6.9-0.7-13.8-1.4-20.9-1.1-10.7 3.5-21 11.8-27.8 25.3-20.4 41.4-51.7 41.4-86.8zM304 112c0-26.5 21.5-48 48-48s48 21.5 48 48-21.5 48-48 48-48-21.5-48-48z m96 800c0 26.5-21.5 48-48 48s-48-21.5-48-48 21.5-48 48-48 48 21.5 48 48z m320-592c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48z" p-id="7488" fill="#ffffff"></path></svg>
      );
    case 'llmProcess':
      return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" data-icon="Llm" aria-hidden="true"><g id="icons/llm"><path id="Vector (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M5.83333 2.40625C5.04971 2.40625 4.39011 2.94431 4.20689 3.67206C4.13982 3.93846 3.91391 4.1349 3.64078 4.16432C2.94692 4.23906 2.40625 4.82766 2.40625 5.54167C2.40625 5.92943 2.56471 6.27904 2.82212 6.53129C2.94807 6.65472 3.01905 6.82365 3.01905 7C3.01905 7.17635 2.94807 7.34528 2.82212 7.46871C2.56471 7.72096 2.40625 8.07057 2.40625 8.45833C2.40625 9.03652 2.76061 9.53347 3.26651 9.74092C3.45247 9.81717 3.59324 9.97444 3.64849 10.1677C3.8841 10.9917 4.64342 11.5938 5.54167 11.5938C5.82802 11.5938 6.09916 11.533 6.34375 11.4237V9.91667C6.34375 9.31258 5.85409 8.82292 5.25 8.82292C4.88756 8.82292 4.59375 8.5291 4.59375 8.16667C4.59375 7.80423 4.88756 7.51042 5.25 7.51042C5.64385 7.51042 6.0156 7.60503 6.34375 7.77278V2.48514C6.18319 2.43393 6.01183 2.40625 5.83333 2.40625ZM7.65625 2.48514V4.08333C7.65625 4.6874 8.14592 5.17708 8.75 5.17708C9.11244 5.17708 9.40625 5.4709 9.40625 5.83333C9.40625 6.19577 9.11244 6.48958 8.75 6.48958C8.35615 6.48958 7.9844 6.39496 7.65625 6.22722V11.4237C7.90087 11.533 8.17199 11.5938 8.45833 11.5938C9.35657 11.5938 10.1159 10.9917 10.3515 10.1677C10.4068 9.97444 10.5475 9.81717 10.7335 9.74092C11.2394 9.53347 11.5938 9.03652 11.5938 8.45833C11.5938 8.07056 11.4353 7.72096 11.1779 7.46871C11.0519 7.34528 10.981 7.17635 10.981 7C10.981 6.82365 11.0519 6.65472 11.1779 6.53129C11.4353 6.27904 11.5938 5.92944 11.5938 5.54167C11.5938 4.82766 11.0531 4.23906 10.3592 4.16432C10.0861 4.1349 9.86022 3.93847 9.79315 3.67208C9.6099 2.94432 8.95027 2.40625 8.16667 2.40625C7.98817 2.40625 7.81681 2.43393 7.65625 2.48514ZM7.00001 12.565C6.56031 12.7835 6.06472 12.9062 5.54167 12.9062C4.14996 12.9062 2.96198 12.0403 2.48457 10.8188C1.65595 10.3591 1.09375 9.47501 1.09375 8.45833C1.09375 7.9213 1.2511 7.42042 1.52161 7C1.2511 6.57958 1.09375 6.0787 1.09375 5.54167C1.09375 4.30153 1.93005 3.25742 3.06973 2.94157C3.51828 1.85715 4.586 1.09375 5.83333 1.09375C6.24643 1.09375 6.64104 1.17788 7 1.33013C7.35896 1.17788 7.75357 1.09375 8.16667 1.09375C9.41399 1.09375 10.4817 1.85716 10.9303 2.94157C12.0699 3.25742 12.9062 4.30153 12.9062 5.54167C12.9062 6.07869 12.7489 6.57958 12.4784 7C12.7489 7.42043 12.9062 7.92131 12.9062 8.45833C12.9062 9.47502 12.344 10.3591 11.5154 10.8188C11.038 12.0403 9.85003 12.9062 8.45833 12.9062C7.93526 12.9062 7.4397 12.7834 7.00001 12.565Z" fill="currentColor"></path></g></svg>
      );
    
    case 'mysqlTableSource':
      return (
        <svg t="1774403907983" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2649" width="14" height="14"><path d="M1001.632 793.792c-7.84-13.856-26.016-37.536-93.12-83.2a1096.224 1096.224 0 0 0-125.152-74.144c-30.592-82.784-89.824-190.112-176.256-319.36-93.056-139.168-201.12-197.792-321.888-174.56a756.608 756.608 0 0 0-40.928-37.696C213.824 78.688 139.2 56.48 96.32 60.736c-19.424 1.952-34.016 9.056-43.36 21.088-21.664 27.904-14.432 68.064 85.504 198.912 19.008 55.616 23.072 84.672 23.072 99.296 0 30.912 15.968 66.368 49.984 110.752l-32 109.504c-28.544 97.792 23.328 224.288 71.616 268.384 25.76 23.552 47.456 20.032 58.176 15.84 21.504-8.448 38.848-29.472 50.048-89.504 5.728 14.112 11.808 29.312 18.208 45.6 34.56 87.744 68.352 136.288 106.336 152.736a32.032 32.032 0 0 0 25.44-58.688c-9.408-4.096-35.328-23.712-72.288-117.504-31.168-79.136-53.856-132.064-69.376-161.856a32.224 32.224 0 0 0-35.328-16.48 32.032 32.032 0 0 0-25.024 29.92c-3.872 91.04-13.056 130.4-19.2 147.008-26.496-30.464-68.128-125.984-47.232-197.536 20.768-71.232 32.992-112.928 36.64-125.248a31.936 31.936 0 0 0-5.888-29.28c-41.664-51.168-46.176-75.584-46.176-83.712 0-29.472-9.248-70.4-28.288-125.152a31.104 31.104 0 0 0-4.768-8.896c-53.824-70.112-73.6-105.216-80.832-121.888 25.632 1.216 74.336 15.04 91.008 29.376a660.8 660.8 0 0 1 49.024 46.304c8 8.448 19.968 11.872 31.232 8.928 100.192-25.92 188.928 21.152 271.072 144 87.808 131.328 146.144 238.048 173.408 317.216a32 32 0 0 0 16.384 18.432 1004.544 1004.544 0 0 1 128.8 75.264c7.392 5.024 14.048 9.696 20.064 14.016h-98.848a32.032 32.032 0 0 0-24.352 52.736 3098.752 3098.752 0 0 0 97.856 110.464 32 32 0 1 0 46.56-43.872 2237.6 2237.6 0 0 1-50.08-55.328h110.08a32.032 32.032 0 0 0 27.84-47.776z" p-id="2650" fill="white"></path><path d="M320 289.472c12.672 21.76 22.464 37.344 29.344 46.784 8.288 16.256 21.184 29.248 29.44 45.536l2.016-1.984c14.528-9.952 25.92-49.504 2.752-75.488-12.032-18.176-51.04-17.664-63.552-14.848z" p-id="2651" fill="white"></path></svg>
      );

    case 'mongoCollectionSource':
      return (
        <svg t="1774405920231" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21135" width="14" height="14"><path d="M733.013333 406.101333c-53.888-237.226667-180.992-315.178667-194.645333-345.002666C523.349333 40.064 507.093333 0 507.093333 0l-0.213333 2.090667v0.554666h-0.042667a24.490667 24.490667 0 0 0-0.170666 1.664v0.64h-0.085334l-0.085333 1.109334v1.109333h-0.128c-0.042667 0.341333-0.042667 0.768-0.128 1.066667v0.896h-0.085333c0 0.298667 0 0.64-0.085334 0.896v0.853333h-0.085333l-0.085333 1.365333v0.085334l-0.384 2.133333v0.341333h-0.085334l-0.128 0.512v0.725334h-0.128v0.938666h-0.213333v0.768h-0.213333v0.896h-0.170667v0.810667h-0.170667v0.725333h-0.256v0.597334h-0.170666v0.768h-0.170667v0.597333h-0.213333v0.554667H503.466667v0.64h-0.170667l-0.042667 0.170666v0.426667h-0.128l-0.042666 0.256v0.256h-0.085334a1.877333 1.877333 0 0 0-0.085333 0.426667l-0.426667 0.896v0.085333a1.28 1.28 0 0 0-0.213333 0.298667v0.341333h-0.170667v0.341333h-0.213333v0.341334h-0.128v0.426666h-0.256v0.597334h-0.170667v0.170666h-0.170666v0.341334h-0.170667v0.469333h-0.170667v0.341333h-0.256v0.469334h-0.170666v0.341333h-0.213334v0.341333h-0.128v0.426667h-0.213333v0.341333h-0.170667v0.256h-0.170666v0.341334h-0.256V32.426667h-0.170667v0.256h-0.213333v0.341333h-0.170667v0.469333h-0.213333v0.170667h-0.128v0.341333h-0.256v0.170667h-0.170667v0.426667h-0.170667v0.170666h-0.170666v0.341334h-0.213334v0.256h-0.128l-0.085333 0.170666v0.170667h-0.085333l-0.085334 0.170667v0.042666h-0.042666a0.682667 0.682667 0 0 1-0.170667 0.298667v0.128h-0.042667L496.213333 37.12v0.042667c-0.085333 0.085333-0.298667 0.256-0.384 0.426666v0.085334h-0.042666l-0.128 0.128v0.128h-0.085334l-0.128 0.128v0.042666h-0.042666l-0.128 0.170667v0.170667h-0.128l-0.085334 0.085333v0.085333h-0.085333c0 0.085333-0.085333 0.085333-0.085333 0.128v0.128h-0.170667l-0.085333 0.128V39.253333h-0.128v0.170667h-0.170667V39.68h-0.170667v0.341333h-0.213333V39.68h-0.213333v0.170667h-0.170667V40.106667h-0.213333v0.341333h-0.213334v0.170667h-0.170666v0.256h-0.170667v0.170666h-0.170667V41.386667h-0.256v0.170666h-0.170666V41.813333h-0.213334v0.170667h-0.170666v0.213333h-0.213334v0.426667h-0.085333v0.170667h-0.256v0.213333h-0.170667v0.085333h-0.170666v0.170667h-0.213334v0.426667h-0.170666v0.170666h-0.213334v0.170667h-0.170666v0.256h-0.213334v0.170667h-0.213333v0.170666h-0.170667v0.170667h-0.170666v0.426667h-0.170667v0.213333h-0.256v0.170667h-0.170667v0.170666h-0.213333v0.256h-0.170667v0.170667h-0.213333v0.298667h-0.170667v0.170666h-0.256V46.933333h-0.085333v0.170667h-0.170667v0.170667h-0.213333v0.170666h-0.170667v0.256h-0.213333v0.170667h-0.128l-0.042667 0.085333v0.085334h-0.085333l-0.170667 0.170666-0.170666 0.128v0.256h-0.170667v0.213334h-0.170667v0.170666h-0.170666v0.170667h-0.128l-0.128 0.128v0.128h-0.085334l-0.085333 0.085333v0.128h-0.085333c-0.213333 0.256-0.298667 0.426667-0.597334 0.682667a15.616 15.616 0 0 0-2.176 1.792l-0.938666 0.725333v0.042667h-0.042667a120.362667 120.362667 0 0 1-2.090667 1.664v0.042667l-3.157333 2.645333V57.173333h-0.085333c-2.432 2.005333-4.992 4.266667-7.936 6.784V64h-0.042667c-7.210667 6.314667-15.786667 14.421333-25.386667 24.234667l-0.64 0.64-0.170666 0.170666C384 149.077333 292.565333 274.176 282.922667 476.330667c-0.853333 16.725333-0.682667 32.981333 0.256 48.810666v0.384c4.650667 79.658667 29.653333 147.669333 60.928 202.922667v0.042667c12.458667 22.016 25.898667 42.026667 39.509333 59.946666v0.042667c47.018667 62.08 95.018667 98.858667 107.264 107.776 18.816 43.648 17.066667 118.570667 17.066667 118.570667l27.477333 9.173333s-5.589333-72.576 2.261333-107.605333c2.432-10.965333 8.192-20.309333 14.890667-28.245334a357.546667 357.546667 0 0 0 34.005333-27.52c0.768-0.810667 1.194667-1.536 1.877334-2.304 64.896-60.501333 186.112-209.493333 144.554666-452.224z" p-id="21136" fill="white"></path></svg>
      );
    case 'fileSource':
      return (
        <svg t="1774404385973" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9211" width="14" height="14"><path fill="white" d="M733.6228025 357.50476098L604.7119751 228.65325904V357.50476098h128.9108274zM542.89904809 419.30285644V203.00952125h-247.19238329c-8.68634009 0-16.01806641 2.98608422-21.96551513 8.96319604-5.96228028 5.97216773-8.92858886 13.28411842-8.92858888 21.93585205v556.18286133c0 8.65173364 2.96630859 16.06750512 8.92858888 21.94079613 5.94250464 5.97216773 13.27917504 8.95825195 21.96057176 8.95825195h432.59655714c8.71105981 0 16.02795386-2.98608422 21.98034668-8.96319604 5.92272973-5.86834693 8.90881324-13.28411842 8.90881396-21.93585204v-370.78857422H542.89904809zM295.72149634 141.21142578h308.99047876L820.99047875 357.50476098v432.58666968c0 25.54486108-9.04724122 47.48071313-27.14172363 65.50598122-18.10931396 18.1290896-39.9462893 27.19116234-65.55541992 27.19116234h-432.5866704c-25.56958008 0-47.42633033-9.06207276-65.5356443-27.19116234C212.06170654 837.57214379 203.00952125 815.63629174 203.00952125 790.09143067V233.90856933C203.00952125 208.36370826 212.06170654 186.53167701 230.1710205 168.40258813S270.13708472 141.21142578 295.7066648 141.21142578h0.01977563z" p-id="9212"></path></svg>
      );
    case 'mysqlTableTarget':  
      return (
        // <svg t="1774407033799" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24063" width="32" height="32"><path d="M973.04064 931.072c-27.31008-0.8192-54.66624-0.26112-82.00192-0.26112-16.68096 0-23.552-6.72768-23.5776-23.25504-0.03584-56.192 0.31744-112.38912-0.19456-168.576-0.1792-19.54816 9.32864-26.42432 21.85728-27.27936 13.16864-0.90112 21.87264 10.69568 21.92896 27.36128 0.13312 40.33536 0.04608 80.67072 0.04608 121.00608 0 7.58272 0.39936 15.19616-0.13312 22.74304-0.4096 5.77024 1.93536 6.7584 7.0656 6.6816 18.33472-0.26112 36.7104 0.58368 55.00416-0.34816a26.112 26.112 0 0 1 25.36448 12.672v16.56832a26.624 26.624 0 0 1-25.35936 12.68736z m-199.2192-581.23264c-39.07584 22.016-81.74592 33.28-125.7984 40.6528a687.58528 687.58528 0 0 1-127.872 10.09664 553.856 553.856 0 0 1-67.00544-2.01728c-60.8256-6.33344-120.9856-15.77472-176.31744-43.67872-22.23616-11.2128-42.23488-25.69728-55.35232-47.87712a78.6944 78.6944 0 0 1-10.69568-42.44992c0.256-12.71808 18.54464-19.456 31.232-11.52 40.85248 25.4464 86.016 38.912 132.75136 48.17408a746.624 746.624 0 0 0 82.66752 10.80832 791.88992 791.88992 0 0 0 107.63776 1.09056 561.87904 561.87904 0 0 0 172.9792-34.69312 429.44 429.44 0 0 0 54.45632-26.16832 17.664 17.664 0 0 1 23.89504 4.608 68.34176 68.34176 0 0 0 8.704 11.21792 14.87872 14.87872 0 0 1 4.096 16.57344c-7.35232 31.16544-29.08672 50.3552-55.37792 65.18272zM732.16 230.46656a482.96448 482.96448 0 0 1-119.33696 31.26784 671.4112 671.4112 0 0 1-140.8 5.94944c-57.25184-3.51744-113.95072-11.96032-168.07936-32.60928-28.24704-10.752-55.36768-23.58272-77.05088-45.12256-35.79392-35.55328-31.01696-79.17568 5.95456-110.9504 37.27872-32.04096 82.432-46.0032 128.75776-57.09312a582.39488 582.39488 0 0 1 83.16416-13.312c11.22816-1.024 23.16288 1.81248 33.9968-3.47136H545.28c2.83136 3.98848 6.97856 1.81248 10.47552 1.98656 66.94912 3.38432 132.0192 15.39584 193.024 43.9808 25.05216 11.74016 47.98464 26.92608 62.75584 51.77856 14.98624 25.22112 12.63616 52.05504-4.4288 75.33568-19.072 25.99424-46.5664 40.11008-74.94656 52.25984zM179.2 930.816a18.944 18.944 0 0 1-20.52608-19.968c-0.0768-34.47808 0-68.95616-0.08192-103.424 0-2.21184 1.3568-5.504-1.16736-6.47168-3.456-1.32096-3.84512 2.56-5.39648 4.5568-7.83872 10.24-15.49824 20.67456-23.936 30.42304-9.56928 11.05408-20.87936 11.10528-30.27456 0.18432-8.41216-9.77408-16.07168-20.1984-23.936-30.43328-1.536-2.00704-1.85344-6.0928-5.29408-4.7872-3.10272 1.1776-1.3056 4.8896-1.31584 7.37792-0.128 32.06656-0.08704 64.128-0.08704 96.19456 0 14.59712-4.224 22.93248-13.14816 25.92768-10.4448 3.5072-19.77856-0.4352-28.42624-12.0064v-194.6624c11.16672-19.072 32.41472-12.288 41.66656 1.39264 13.00992 19.2768 27.23328 37.76 40.7552 56.704 3.8656 5.40672 6.59968 4.36736 9.99936-0.39936q20.56704-28.81024 41.43616-57.41056c8.54016-11.7248 20.00384-15.7952 29.74208-10.78784a18.944 18.944 0 0 1 11.008 18.1248q-0.04608 89.984-0.0512 179.97312c-0.01024 12.07808-8.25856 19.5328-20.9664 19.49184zM237.47072 385.50528c42.73664 27.136 90.624 40.26368 139.42784 49.87904a660.80768 660.80768 0 0 0 73.76384 9.216c29.696 2.432 59.31008 1.43872 88.9344 1.41824a588.2368 588.2368 0 0 0 120.25344-13.96224 444.58496 444.58496 0 0 0 120.76032-43.07968 40.12032 40.12032 0 0 1 18.60096-7.05024c20.096-0.30208 30.65344 13.44512 26.03008 33.08544-7.68 32.59904-29.75744 53.00736-57.52832 68.38272-38.97344 21.57056-81.32096 32.768-125.1328 39.64928-23.90528 3.7632-47.81056 6.46656-71.9104 8.61696-18.31424 1.63328-36.49024 0.31744-54.67136 1.50528a503.63904 503.63904 0 0 1-88.4736-4.35712c-53.76-6.528-107.008-16.384-155.648-41.74336-27.1872-14.1824-51.88608-31.93856-61.55776-63.21664-3.072-10.00448-7.79776-20.67968-1.08032-31.232 7.50592-11.77088 16.55296-14.5408 28.23168-7.11168z m3.80416 132.0192c42.63936 27.50976 90.59328 40.39168 139.33056 50.304a637.312 637.312 0 0 0 74.79296 9.30304 803.1488 803.1488 0 0 0 97.2544 1.23904c84.82816-3.328 166.69696-19.10784 241.77152-61.79328 13.99296-7.95648 26.15296 1.81248 26.81856 22.59968 0.62976 19.42528-8.93952 36.352-22.10816 50.56512-24.48384 26.44992-56.50944 40.28928-89.93792 50.90816a499.56352 499.56352 0 0 1-90.8032 19.15392A652.98944 652.98944 0 0 1 521.02144 665.6a520.63744 520.63744 0 0 1-68.17792-2.00192c-60.416-6.4768-120.2688-15.60064-175.33952-43.45856-22.64064-11.45344-42.73152-26.02496-56.22272-48.2816a76.03712 76.03712 0 0 1-10.43456-37.376 19.49696 19.49696 0 0 1 30.43328-16.95744z m3.53792 317.952a36.16768 36.16768 0 0 1-3.49696-19.03616 17.54112 17.54112 0 0 1 16.128-17.7664 21.376 21.376 0 0 1 23.30624 10.68032c7.6288 13.4144 14.848 27.0592 22.28736 40.58624 1.28 2.32448 1.80224 5.86752 4.5824 6.32832 3.584 0.59392 3.49696-3.6608 4.70016-5.69856 7.168-12.1344 13.93664-24.51968 20.82816-36.82304 9.216-16.50688 26.74688-19.92192 38.2976-7.45984 7.62368 8.22272 7.41376 16.384-2.048 24.45312a30.1056 30.1056 0 0 0-7.5008 10.24l-83.6352 166.44608c-3.072 6.144-4.88448 12.95872-11.52 16.56832h-10.3936c-1.664-4.94592-7.85408-4.82304-10.18368-9.37984-5.08416-9.94304-7.09632-19.3536-1.36704-30.12096 11.5968-21.79584 22.12352-44.15488 33.55136-66.048a16.24576 16.24576 0 0 0-0.13824-16.8704c-11.45856-21.87264-22.36928-44.01664-33.39776-66.10432z m200.04864 14.58176c13.3376-1.95072 23.936 4.81792 25.42592 17.11104a23.6544 23.6544 0 0 0 13.35808 17.92c21.2224 12.93312 54.66624 10.3168 70.45632-3.584 11.20768-9.87136 9.216-20.77696-4.87424-26.30656a78.464 78.464 0 0 0-24.0128-6.53824c-7.04512-0.34304-9.80992-0.95232-18.01728-1.62304-20.03968-3.33824-39.63392-8.192-56.43776-20.62848-28.93824-21.36576-29.56288-62.04928-0.17408-87.17824 33.76128-28.85632 93.89056-28.02176 124.416-6.10816 15.2832 10.97216 27.44832 24.38144 28.3648 44.4672a20.31616 20.31616 0 0 1-16.896 20.70016c-10.55232 1.20832-23.4496-6.97856-24.22784-17.13152a20.48 20.48 0 0 0-8.10496-14.52544c-18.14528-16.41472-60.17536-15.6928-77.09184 1.24416-8.38144 8.39168-8.50432 11.776 0.4608 19.78368 10.94656 9.7792 24.97024 11.05408 38.67648 12.65664 25.6 2.9952 50.91328 8.89856 69.23776 27.42272 25.78944 26.06592 25.66656 56.25344-2.42176 80.3584-35.77856 30.72-93.12768 30.65856-130.14016 3.6608a62.88384 62.88384 0 0 1-23.86944-37.7856 21.94432 21.94432 0 0 1 15.872-23.92064z m251.008-135.61856c21.39648-5.71392 44.032-4.35712 66.41152-1.37216a66.7648 66.7648 0 0 1 49.024 30.47424 60.416 60.416 0 0 1 10.40384 34.10432c0.03072 14.47424 0 28.9536 0 43.42784 0 12.75392-0.16384 25.50784 0.06656 38.25664a46.25408 46.25408 0 0 1-4.05504 21.55008 20.51072 20.51072 0 0 0 0.33792 21.16096c7.89504 14.16192 0.10752 24.64768-16.19456 24.62208-6.09792 0-12.46208 1.0752-17.72032-3.24608a3.21024 3.21024 0 0 0-4.49536 0.4864c-12.15488 7.90528-25.8304 7.54176-39.424 6.85056-15.06304-0.768-30.45376 2.75968-45.16352-2.048-26.99264-8.84224-44.13952-26.3168-48.04608-55.49056-4.224-31.54432-2.83648-63.2576-1.39776-94.72 1.6128-35.584 20.36224-56.064 50.2528-64.06144z m-7.12704 152.2176a20.352 20.352 0 0 0 15.7184 20.85888c11.20768 3.62496 22.528 1.10592 33.792 1.75616 2.72896 0.1536 6.8352 1.9456 8.192-1.62304 1.08544-2.84672-2.94912-4.096-4.49536-6.25152-4.27008-5.89312-7.20384-11.776-3.98848-19.49184a20.39808 20.39808 0 0 1 18.79552-14.336c8.48896-0.6656 13.8752 3.95264 21.31968 9.48736 0-28.16-0.73728-54.66624 0.32256-81.11104a21.09952 21.09952 0 0 0-21.0432-21.0944q-23.8848-0.30208-47.77984 0a21.92896 21.92896 0 0 0-20.82816 20.7616q-0.24064 45.50656-0.00512 91.03872z" fill="#37BEF0" p-id="24064"></path></svg>
        // <svg t="1774404505713" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11200" width="14" height="14"><path fill="white" d="M751.3088 459.8784c-145.1008 0-262.4512 117.3504-262.4512 262.4512 0 145.1008 117.3504 263.0656 262.4512 263.0656 145.1008 0 262.4512-117.9648 262.4512-263.0656S896.4096 459.8784 751.3088 459.8784zM585.728 562.3808h30.0032c0 0.7168-0.3072 2.3552 0 2.4576 14.2336 7.168 25.1904 19.968 42.9056 20.8896 29.184 1.4336 51.0976 17.3056 73.0112 33.6896 36.0448 26.9312 57.6512 63.488 74.24 103.6288 4.1984 10.24 9.3184 20.6848 15.36 30.0032 3.584 5.5296 9.216 10.9568 15.36 13.5168 28.3648 11.6736 52.8384 28.3648 74.8544 52.736-18.1248 3.7888-34.304 7.168-52.736 11.0592 3.584 3.8912 5.3248 6.4512 7.9872 8.6016 15.9744 13.0048 32.256 26.4192 48.4352 39.2192 1.9456 1.536 5.0176 2.048 7.3728 3.072v1.8432c-14.336-7.3728-28.9792-13.9264-42.9056-22.1184-10.4448-6.0416-21.1968-13.1072-29.3888-21.504-12.3904-12.4928-10.5472-16.4864 6.7584-20.2752 11.776-2.56 24.064-3.7888 36.7616-5.5296-0.6144-1.7408-0.9216-3.6864-1.8432-4.3008-18.6368-12.8-36.2496-27.5456-59.4944-32.4608-12.9024-2.7648-19.7632-11.0592-25.1904-22.1184-13.5168-27.7504-26.0096-55.9104-42.2912-82.1248-21.1968-34.0992-52.4288-58.4704-91.3408-73.0112-1.7408-0.6144-3.7888-1.9456-5.5296-1.8432-23.1424 2.048-39.8336-12.288-58.88-20.8896-2.7648-1.2288-5.7344-3.072-8.6016-3.072-3.584 0-8.4992 0.8192-10.4448 3.072-1.8432 2.1504-1.3312 6.8608 0 9.8304 2.2528 5.0176 6.4512 9.216 9.216 14.1312 7.68 13.5168 14.6432 26.8288 22.1184 40.448 7.5776 13.9264 15.7696 28.0576 22.7328 42.2912 1.8432 3.6864 2.048 9.728 0.6144 13.5168-7.68 19.5584-9.8304 38.912-6.144 59.4944 2.048 11.264 5.3248 21.7088 16.5888 30.6176 7.0656-17.1008 2.3552-36.1472 19.0464-47.2064 12.288 21.9136 24.8832 43.9296 37.376 66.2528-0.8192 0.7168-2.2528 1.2288-3.072 1.8432-11.3664-14.0288-22.2208-27.8528-34.304-42.9056-1.1264 6.4512-1.6384 12.4928-3.6864 17.8176-2.048 5.12-4.9152 11.9808-9.216 13.5168-4.1984 1.4336-12.1856-1.4336-15.9744-4.9152-13.1072-12.288-17.408-29.184-17.2032-45.9776 0.2048-14.9504 2.8672-30.1056 6.144-44.7488 1.6384-7.4752 1.2288-12.0832-3.072-19.0464-8.4992-13.9264-14.4384-29.3888-21.504-44.1344-3.7888-7.9872-6.7584-16.5888-12.288-23.3472-12.6976-15.6672-25.3952-30.9248-11.776-52.0192z m65.6384 56.32c3.4816 1.6384 7.9872 2.2528 9.8304 4.9152 2.1504 3.1744 1.7408 8.0896 2.4576 12.288-1.2288 0.1024-2.3552 0.512-3.6864 0.6144-3.4816-5.0176-6.9632-10.3424-10.4448-15.36 0.512-0.8192 1.3312-1.536 1.8432-2.4576z" p-id="11201"></path><path d="M469.1968 38.6048C207.0528 41.6768 1.3312 114.688 10.5472 201.728c9.216 87.1424 229.5808 155.7504 491.8272 152.6784s467.2512-75.9808 458.0352-163.1232-228.9664-155.648-491.2128-152.6784zM10.5472 215.8592v172.3392c-0.4096 3.6864-0.4096 7.8848 0 11.6736 9.216 87.1424 229.5808 155.136 491.8272 152.064h1.8432c39.3216-52.6336 96.1536-93.5936 165.5808-113.4592 84.0704-23.9616 170.3936-12.288 241.5616 25.8048 29.0816-19.5584 46.6944-41.472 49.0496-64.4096h0.6144V226.9184c-8.704 82.1248-207.7696 149.0944-458.6496 152.064-262.144 3.072-481.9968-64.9216-491.2128-152.064-0.4096-3.6864-0.4096-7.3728 0-11.0592h-0.6144z m0 201.728v172.9536c-0.4096 3.6864-0.4096 7.2704 0 11.0592 8.4992 80.6912 198.4512 144.7936 434.7904 151.4496-4.7104-60.8256 10.0352-120.4224 39.8336-171.7248-254.464-0.1024-465.1008-67.4816-474.0096-152.6784-0.4096-3.6864-0.4096-7.3728 0-11.0592h-0.6144z m950.4768 11.6736c-1.7408 16.7936-11.776 32.768-28.16 47.8208 9.6256 6.144 19.2512 12.3904 28.16 19.6608v-67.4816zM10.5472 619.9296v172.3392c-0.4096 3.6864-0.4096 7.2704 0 11.0592 9.216 87.1424 229.5808 155.7504 491.8272 152.6784 15.2576-0.2048 30.5152-0.6144 45.3632-1.2288-41.3696-36.1472-73.8304-83.1488-90.7264-138.5472-3.3792-11.0592-5.9392-22.016-7.9872-33.0752-237.9776-6.0416-429.2608-70.9632-437.8624-152.064-0.4096-3.6864-0.4096-7.3728 0-11.0592h-0.6144z" p-id="11202" fill="white"></path></svg>
        <svg t="1774407160634" className="icon" viewBox="0 0 1232 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="32209" width="14" height="14"><path fill="white" d="M1091.71386105 800.01259872a200.80158239 200.80158239 0 0 1 37.48296161 47.02103701l10.20741371 13.88877605c2.34268491 4.35070063 2.67735405 9.87274454 5.18737474 14.22344597v1.00400747a512.46237216 512.46237216 0 0 1-77.81061308-25.26753217c-28.78156034-12.5500986-82.99798781-36.81362329-84.6713344-38.31963571-141.06311181-67.60319938-129.01501655-71.95390003-148.42583647-87.01401852a371.65026202 371.65026202 0 0 1-26.60620962-28.44689116 229.13133909 229.13133909 0 0 1-45.68235958-62.58315963c-4.35070063-12.21542943-8.5340671-24.59819387-12.88476855-36.81362329l0.16733498-1.00400829a32.12825351 32.12825351 0 0 0-4.01603229 11.54609114c-7.36272465 20.74949654-5.85671305 45.51502539-24.59819386 51.37173846-21.41883567 6.86072053-34.13626924-17.9048075-39.32364319-29.45089946a199.69717394 199.69717394 0 0 1 3.01202403-144.07513504 135.54106792 135.54106792 0 0 1 12.38276441-31.2915802 30.83977657 30.83977657 0 0 0-8.53406713-15.56212263 192.60218444 192.60218444 0 0 1-11.71342609-27.61021788 553.37569445 553.37569445 0 0 1-14.89278429-59.5711356c-2.00801574-8.03206297-1.67334658-15.39478765-4.18336568-22.92484726a195.59747496 195.59747496 0 0 0-16.73346586-34.13626927c-8.03206297-15.06011848-31.79358355-45.18035624-18.23947668-71.95390082a31.4087139 31.4087139 0 0 1 34.63827259-18.23947668 143.15479506 143.15479506 0 0 1 63.08516455 33.29959598 140.79537665 140.79537665 0 0 0 16.56613009 16.56613007c9.87274454 1.67334658 20.08015825 3.34669317 29.95290278 5.02003977a170.54747746 170.54747746 0 0 1 48.86171857 22.59017811 417.73422553 417.73422553 0 0 1 138.21842278 175.36671525 425.49855335 425.49855335 0 0 1 15.06011848 50.70239933c7.53005965 25.76953632 16.23146093 52.37574593 25.26753217 77.14127476a202.69246445 202.69246445 0 0 0 12.88476857 34.63827339 47.57324165 47.57324165 0 0 0 14.72544931 9.53807538c12.71743359 8.70140209 27.61021787 15.72945759 39.49097816 25.60220133a606.53791397 606.53791397 0 0 1 60.07313974 59.06913226c7.0280555 8.03206297 11.04408699 18.90881579 17.40280419 27.44288292l-0.33466915 3.8486973c-6.69338635 1.33867743-13.21943773 2.51001989-19.7454891 3.84869651-14.55811435 2.51001989-26.6062096 0.33466915-40.6623206 2.84468904a172.35469202 172.35469202 0 0 1-28.11222201 3.84869731 2.99529052 2.99529052 0 0 0 0.83667328 1.17134245c3.68136234 16.06412676 30.12023777 31.79358355 41.66632889 42.67033635zM765.91329359 293.4906071a27.99508753 27.99508753 0 0 0-15.06011929-11.04408698 10.04007951 10.04007951 0 0 0-3.17935819 0c-13.3867719-4.01603148-29.28356447 8.70140209-17.06813422 18.57414583a138.75389391 138.75389391 0 0 1 19.24348495 45.68236037 35.03987653 35.03987653 0 0 0 16.06412675-53.21241922z m-109.43686325-88.6873659z m112.44888647 13.05210274l-7.02805551-2.67735405-31.4589144-5.52204389c-1.33867743-1.33867743-3.01202402-3.34669317-4.18336644-4.6853706a108.76752414 108.76752414 0 0 0-9.5380746-9.87274376 172.6224272 172.6224272 0 0 0-79.14929051-40.99698977 54.56783013 54.56783013 0 0 0-57.73045565 30.62224111c-17.40280417 34.30360343 4.01603148 69.44388096 15.56212264 88.52003093 1.84068157 3.01202402 3.51402737 5.68937807 4.68537059 8.03206296l4.35070064 7.86472879a147.25449404 147.25449404 0 0 1 12.55009941 26.10420628 58.56712813 58.56712813 0 0 1 2.00801574 10.54208285 94.57754515 94.57754515 0 0 0 2.17535073 13.21943772l4.0160315 18.07214169a372.6040698 372.6040698 0 0 0 12.88476774 49.19638773 244.82732969 244.82732969 0 0 0 14.056111 32.79759182 893.43317489 893.43317489 0 0 1-145.41381246 11.7134261C313.77506283 450.78517985 157.31716339 393.38939417 157.31716339 322.6068366V220.19802885C157.31716339 149.41547129 313.77506283 92.01968559 506.71191723 92.01968559s349.22741888 57.39578568 349.22741888 128.17834326v52.37574672c-11.37875614-10.2074137-23.25951644-20.08015825-35.3076117-29.61823362a178.22813777 178.22813777 0 0 0-51.70640761-25.10019801zM506.71191723 527.59178547a896.07706196 896.07706196 0 0 0 127.17433579-8.86873708 221.01560862 221.01560862 0 0 0 10.2074137 128.01100909 118.17173154 118.17173154 0 0 0 12.71743358 22.08817398 887.91113099 887.91113099 0 0 1-150.09918307 12.5500986C313.77506283 681.37233006 157.31716339 623.97654438 157.31716339 553.19398681v-153.7805454c0 70.78255757 156.45789945 128.17834325 349.39475384 128.17834406z m0 230.5871502c107.09417754 0 202.97693313-17.73747334 267.06610435-45.68235958 4.01603148 4.51803563 8.19939796 9.03607126 12.55009941 13.21943691 3.17935819 3.34669317 6.19138221 7.0280555 9.3707404 10.70941785a160.44046475 160.44046475 0 0 0 21.2515007 21.9208398 70.93315905 70.93315905 0 0 1 8.03206297 7.19538968 165.20950204 165.20950204 0 0 0 30.28757273 23.42685142C847.90727314 857.24104943 694.79606606 911.95948107 506.71191723 911.95948107 313.77506283 911.95948107 157.31716339 854.56369537 157.31716339 783.7811378v-153.61321121c0 70.61522341 156.45789945 128.01100908 349.39475384 128.01100908z" p-id="32210"></path></svg>
      );
    case 'mongoCollectionTarget':  
      return (
        <svg t="1774407109675" className="icon" viewBox="0 0 1080 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26830" width="14" height="14"><path fill="white" d="M1077.806898 479.344674a581.652175 581.652175 0 0 0-140.027375-315.734804A307.656301 307.656301 0 0 1 875.844338 70.707092c0-4.039251 0-7.405294-6.058877-10.771336a77.418982 77.418982 0 0 1-37.699678 54.529891 175.707428 175.707428 0 0 0-30.967593 28.274759 488.076188 488.076188 0 0 0-107.040157 151.47192 594.443137 594.443137 0 0 0-52.510266 172.341385 457.781804 457.781804 0 0 0 42.412138 280.054751 476.631643 476.631643 0 0 0 116.465077 154.164755 892.00131 892.00131 0 0 1-5.385669 115.791868l90.209944 7.405294a816.601954 816.601954 0 0 1 10.771337-122.523954A392.480576 392.480576 0 0 0 1056.264225 673.228732a436.91234 436.91234 0 0 0 17.503422-92.22957A325.159723 325.159723 0 0 0 1077.806898 479.344674zM453.742586 377.690185c37.026469 0 72.706522 0 107.040157-5.385669A683.306664 683.306664 0 0 1 606.560923 253.819814a605.887682 605.887682 0 0 1 125.216788-176.380636 216.773148 216.773148 0 0 1 28.274758-26.928342L741.20263 43.778751c-19.523048-6.732085-40.392512-12.790962-61.935185-18.17663A964.707831 964.707831 0 0 0 455.089003 0.020196a996.348633 996.348633 0 0 0-224.851651 24.235508q-33.660427 8.078502-62.608394 18.17663a526.449075 526.449075 0 0 0-61.261977 24.908716 306.983092 306.983092 0 0 0-49.144223 30.294384A232.930153 232.930153 0 0 0 22.889123 134.661903a128.58283 128.58283 0 0 0-10.771337 18.176631 84.151067 84.151067 0 0 0-11.444545 34.333635C0.673241 291.519492 202.635802 377.016976 453.742586 377.690185zM585.691459 768.824344a1205.716487 1205.716487 0 0 1-134.641707 7.405294c-197.250101 0-359.493358-46.451389-451.049719-119.157911v176.380636c0 104.347323 201.962561 189.171598 451.049719 190.518016a960.66858 960.66858 0 0 0 244.374698-29.621176c0-12.117754 0-30.294384 3.366043-52.510266a581.652175 581.652175 0 0 1-105.69374-152.145129c-2.692834-6.732085-4.71246-14.137379-7.405294-20.869464zM452.396169 700.830282a1056.937401 1056.937401 0 0 0 105.69374-5.385669 557.416667 557.416667 0 0 1-14.13738-243.701489c-28.947967 0-59.242351 3.366043-90.209943 3.366042a933.740239 933.740239 0 0 1-350.068439-61.935185 426.141003 426.141003 0 0 1-80.111816-44.431763A243.70149 243.70149 0 0 1 0.673241 336.624464v173.687802c0 104.347323 201.962561 189.844807 451.722928 190.518016z" p-id="26831"></path></svg>
        // <svg t="1774404609850" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13260" width="14" height="14"><path fill="white" d="M416 620.8c85.333333 0 164.266667-8.533333 228.266667-23.466667 17.066667-66.133333 57.6-132.266667 91.733333-185.6 8.533333-12.8 14.933333-23.466667 21.333333-36.266666-57.6 38.4-189.866667 64-343.466666 64-164.266667 0-302.933333-29.866667-354.133334-72.533334-4.266667-6.4-17.066667-2.133333-17.066666 8.533334V512c0 59.733333 166.4 108.8 373.333333 108.8z" p-id="13261" ></path><path fill="white" d="M42.666667 279.466667a373.333333 108.8 0 1 0 746.666666 0 373.333333 108.8 0 1 0-746.666666 0Z" p-id="13262"></path><path fill="white" d="M635.733333 652.8c-61.866667 12.8-138.666667 21.333333-219.733333 21.333333-164.266667 0-302.933333-29.866667-354.133333-72.533333-6.4-6.4-19.2-2.133333-19.2 6.4v136.533333C42.666667 804.266667 209.066667 853.333333 416 853.333333c115.2 0 219.733333-14.933333 288-38.4-38.4-36.266667-68.266667-89.6-68.266667-162.133333zM861.866667 396.8c-8.533333-14.933333-32-14.933333-40.533334 0-38.4 68.266667-121.6 174.933333-121.6 258.133333 0 87.466667 57.6 130.133333 104.533334 145.066667v17.066667c0 19.2 14.933333 34.133333 34.133333 34.133333s34.133333-14.933333 34.133333-34.133333v-17.066667c46.933333-14.933333 104.533333-59.733333 104.533334-145.066667 6.4-83.2-76.8-189.866667-115.2-258.133333z" p-id="13263"></path></svg>
      );
    case 'fileTarget':  
      return (
        <svg t="1774404676062" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14329" width="14" height="14"><path fill="white" d="M586.64 926.76H205.36c-13.24 0-24-10.76-24-24V114c0-13.24 10.76-24 24-24h399.36c13.24 0 24 10.76 24 24s-10.76 24-24 24H229.36v740.8h357.28c13.24 0 24 10.76 24 24s-10.72 23.96-24 23.96zM804.68 582.64c-13.24 0-24-10.76-24-24V322.28c0-13.24 10.76-24 24-24s24 10.76 24 24v236.32a24 24 0 0 1-24 24.04z"  p-id="14330"></path><path fill="white" d="M605.2 114.64v204.12h196.12z"  p-id="14331"></path><path  fill="white" d="M801.32 342.76H605.2c-13.24 0-24-10.76-24-24V114.64c0-9.8 5.96-18.6 15.04-22.28 9.08-3.64 19.48-1.44 26.28 5.64l196.12 204.12a23.92 23.92 0 0 1 4.76 26.04 23.988 23.988 0 0 1-22.08 14.6z m-172.12-48h115.76L629.2 174.24v120.52zM470.08 341.24H362.32c-13.24 0-24-10.76-24-24s10.76-24 24-24h107.76c13.24 0 24 10.76 24 24s-10.76 24-24 24zM647.72 637.84H362.32c-13.24 0-24-10.76-24-24s10.76-24 24-24h285.4c13.24 0 24 10.76 24 24s-10.72 24-24 24zM647.72 489.52H362.32c-13.24 0-24-10.76-24-24s10.76-24 24-24h285.4c13.24 0 24 10.76 24 24s-10.72 24-24 24z" p-id="14332"></path><path  fill="white" d="M824.52 798.8h-296.84c-13.24 0-24-10.76-24-24s10.76-24 24-24h296.84c13.24 0 24 10.76 24 24s-10.72 24-24 24z" p-id="14333"></path><path  fill="white" d="M732.32 921.16a24 24 0 0 1-16.96-40.96l106.16-106.16-101-101a24 24 0 0 1 0-33.92 24 24 0 0 1 33.92 0l117.96 117.96a24 24 0 0 1 0 33.92l-123.12 123.12a23.732 23.732 0 0 1-16.96 7.04z" p-id="14334"></path></svg>
      );
    case 'validateProcess': 
      return (
        <svg t="1774405383203" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="17360" width="14" height="14"><path fill="white" d="M482.33728 401.57696a172.398933 172.398933 0 0 0-84.10368 87.176533c-4.780373 11.060053 0.339627 23.963307 11.39968 28.74368 2.799787 1.227093 5.733547 1.772373 8.669867 1.772374 8.46336 0 16.520533-4.916907 20.0704-13.174614 12.356267-28.604587 34.68032-51.677867 62.80704-65.127253 10.920107-5.18656 15.497387-18.225493 10.307413-29.079893-5.187413-10.8544-18.2272-15.496533-29.15072-10.310827zM706.52416 535.17824c-12.079787 0-21.843627 9.75872-21.843627 21.84192 0 70.793387-57.61792 128.4096-128.4096 128.4096-12.0832 0-21.84704 9.762133-21.84704 21.84704s9.762133 21.847893 21.84704 21.847893c45.943467 0 89.156267-17.88672 121.6512-50.38336 32.49664-32.493227 50.38336-75.707733 50.38336-121.6512a21.737813 21.737813 0 0 0-21.781333-21.911893z" p-id="17361"></path><path fill="white" d="M854.665387 823.66976L755.539627 724.548267c17.00096-20.138667 30.789973-42.53184 41.096533-66.834774 13.653333-32.290133 20.616533-66.62656 20.616533-101.9904 0-35.360427-6.9632-69.700267-20.616533-101.9904-13.175467-31.19616-32.08704-59.252907-56.183467-83.282773-24.029867-24.03072-52.086613-42.940587-83.28704-56.183467-32.290133-13.653333-66.62656-20.616533-101.991253-20.616533-35.360427 0-69.700267 6.9632-101.9904 20.616533-31.197013 13.172907-59.25376 32.082773-83.282773 56.183467-24.03072 24.029867-42.940587 52.086613-56.18432 83.282773-13.653333 32.290133-20.61568 66.629973-20.61568 101.9904 0 35.362133 6.962347 69.700267 20.61568 101.9904 13.17376 31.200427 32.083627 59.258027 56.18432 83.287894 24.029013 24.029013 52.08576 42.93888 83.282773 56.185173 32.290133 13.653333 66.629973 20.614827 101.9904 20.614827 35.362987 0 69.70112-6.961493 101.991253-20.614827 24.646827-10.4448 47.243093-24.372907 67.516587-41.645227l99.1232 99.122347a21.824 21.824 0 0 0 15.429973 6.41792c5.597013 0 11.193173-2.117973 15.42656-6.41792 8.536747-8.6016 8.536747-22.460587 0.003414-30.99392zM555.177813 774.0416c-120.418987 0-218.38336-97.960107-218.38336-218.38336 0-120.424107 97.964373-218.387627 218.38336-218.387627 120.423253 0 218.387627 97.96352 218.387627 218.387627-0.000853 120.423253-98.03008 218.38336-218.387627 218.38336z" p-id="17362"></path><path fill="white" d="M379.800747 817.93792H257.604267c-28.603733 0-51.88352-23.279787-51.88352-51.884373V258.1504c0-28.603733 23.279787-51.88352 51.88352-51.88352h464.213333c28.604587 0 51.88352 23.279787 51.88352 51.88352v63.2832c0 12.0832 9.760427 21.84704 21.84448 21.84704s21.84704-9.76384 21.84704-21.84704v-63.2832c0-52.703573-42.86976-95.573333-95.573333-95.573333h-464.213334c-52.703573 0-95.573333 42.86976-95.573333 95.573333v507.903147c0 52.704427 42.86976 95.573333 95.573333 95.573333H379.8016c12.0832 0 21.84704-9.75872 21.84704-21.84192-0.000853-12.084907-9.764693-21.84704-21.847893-21.84704z" p-id="17363"></path></svg>
      );
    case 'end':
      return (
       <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify iconify--ic"><path fill="currentColor" d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2"></path></svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      );
  }
};


const CustomNodeDefault = React.memo((props) => {
  const { data, isConnectable, onCopyNode, onDeleteNode, type, onAddNode, onRunNode, onOpenLogModal } = props;
  const { id } = props;
  const updateNodeInternals = useUpdateNodeInternals();
  const [isRunning, setIsRunning] = useState(false);
  const [executionStatus, setExecutionStatus] = useState(''); // '' | 'running' | 'success' | 'error'

  useEffect(() => {
    if (typeof updateNodeInternals === 'function' && id) {
      updateNodeInternals(id);
    }
  }, [id, data?.config?.branches]);

  const handleRunNode = useCallback(async (e) => {
    // 阻止事件冒泡，避免触发节点选择
    e.stopPropagation();
    
    if (typeof onRunNode === 'function') {
      setIsRunning(true);
      setExecutionStatus('running');
      try {
        await onRunNode(id, data, type);
        setExecutionStatus('success');
        // 3秒后清除成功状态
        setTimeout(() => setExecutionStatus(''), 3000);
      } catch (error) {
        setExecutionStatus('error');
        // 3秒后清除错误状态
        setTimeout(() => setExecutionStatus(''), 3000);
      } finally {
        setIsRunning(false);
      }
    }
  }, [id, data, type, onRunNode]);

  const getStatusIcon = () => {
    switch (executionStatus) {
      case 'running':
        return <LoadingOutlined style={{ color: 'rgb(74, 168, 255)', fontSize: 14 }} />;
      case 'success':
        return <CheckCircleOutlined style={{ color: 'rgb(82, 196, 26)', fontSize: 14 }} />;
      case 'error':
        return <CloseCircleOutlined style={{ color: 'rgb(245, 34, 45)', fontSize: 14 }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{ padding: 5, minWidth: 150, position: 'relative' }} className='box' >
        <div className='flow-label' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="app-iconify anticon" style={{ height: 18, fontSize: 16, padding: '1px 2px', borderRadius: 4, background: defaultColors[type] || 'rgb(74, 168, 255)', color: 'white', display: 'inline-flex' }}>
              { getNodeIcon(type) }
            </span>
            <div>{data.label || data.nodeName}</div>
            {getStatusIcon()}
          </div>
        </div>
        <div className="node-operate" onClick={(e) => e.stopPropagation()}>
          {isRunning ? (
            <LoadingOutlined
              style={{ fontSize: 16, cursor: 'pointer', color: 'rgb(74, 168, 255)', marginRight: 8 }}
            />
          ) : (
            <PlayCircleOutlined 
              style={{ fontSize: 16, cursor: 'pointer', color: 'rgb(74, 168, 255)', marginRight: 8 }}
              onClick={handleRunNode}
            />
          )}
          <Operate onCopyNode={onCopyNode} onDeleteNode={onDeleteNode} onOpenLogModal={onOpenLogModal} />
        </div>

        <HandleStart {...props} />
        <HandleEnd {...props} />
       
      </div>
    </>
  );
});






const CustomNodeStart = memo((props, ) => {
  const { data, isConnectable, onCopyNode, onDeleteNode, onAddNode } = props;
  

  return (
    <>
      <div style={{ padding: 5, minWidth: 150 }} className='box' >
        <div className='flow-label' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="app-iconify anticon" style={{ height: 18, fontSize: 16, padding: '1px 2px', borderRadius: 4, background: 'rgb(74, 168, 255)', color: 'white', display: 'inline-flex' }}>
              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24" className="iconify iconify--tabler">
                <g fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2">
                  <path d="M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"></path><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"></path>
                </g>
              </svg>
            </span>
            <div>{data.label}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
          </div>
        </div>

        <HandleStart {...props}/>


        {/* <Handle
          type="target"
          id="a"
          data={{ portType: "text", group: "llm", }}
          position={Position.Right}
          style={{ ...DEFAULT_HANDLE_STYLE, left: '-18px',  top: '50%' }}
          onConnect={(params) => console.log('handle onConnect', params)}
          isConnectable={isConnectable}
        >
        </Handle> */}

      </div>
    </>
  );
});

const CustomNodeEnd = memo((props) => {
  const { data, isConnectable, onCopyNode, onDeleteNode } = props;
  return (
    <>
      <div style={{ padding: 5, minWidth: 150 }} >
        <div className='flow-label' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="app-iconify anticon" style={{ height: 18, fontSize: 16, padding: '1px 2px', borderRadius: 4, background: '#EE4A4A', color: 'white', display: 'inline-flex' }}>
              { getNodeIcon('end') }
            </span>
            <div>{data.label}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Operate del onCopyNode={onCopyNode} onDeleteNode={onDeleteNode} />
          </div>
        </div>
        <HandleEnd {...props} />
      </div>
    </>
  );
});




export default {
  CustomNodeDefault: CustomNodeDefault,
  CustomNodeStart: CustomNodeStart,
  CustomNodeEnd: CustomNodeEnd,
  // CustomNodeLLM: CustomNodeLLM,
}
