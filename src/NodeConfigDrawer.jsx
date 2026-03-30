import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import {
  Drawer,
  Form,
  Input,
  Button,
  Select,
  Card,
  Table,
  Tag,
  Modal,
  Empty,
  Cascader,
  Upload,
  message,
} from 'antd';
import TextArea from 'antd/es/input/TextArea.js';
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const editorStyle = {
  fontFamily: '"Fira code", "Fira Mono", monospace',
  fontSize: 12,
  border: '1px solid #ccc',
  minHeight: 200,
  margin: '8px 15px',
  width: 'calc(100% - 48px)',
  borderRadius: '8px',
};

const NodeConfigDrawer = ({
  selectedNode,
  drawerOpen,
  form,
  forms,
  formLoading,
  onClose,
  onFinish,
  onValuesChange,
  preview,
  setPreview,
  dataSetOptions,
  setSelectedDataSetId,
  fetchTableData,
  tableData,
  tableLoading,
  apiNpl,
  api,
  setTableData,
  tableTag,
  setTableTag,
  onTableMappingChange,
  isModalOpen,
  setIsModalOpen,
  handleOk,
  handleCancel,
  handleAddField,
  dict,
  conversionList,
  selectedConversionId,
  setSelectedConversionId,
  conversionRules,
  setConversionRules,
  ruleType,
  code,
  setCode,
  editingLogicId,
  setEditingLogicId,
  editingLogicName,
  setEditingLogicName,
  tableSelect,
  setConversionList,
  dataSourceTables,
  setDataSourceTables,
  dataSourceTableFields,
  setDataSourceTableFields,
  dataSourceList,
}) => {
  // 使用useState管理checkbox的选中状态
  const [selectedFields, setSelectedFields] = useState([]);
  // 使用useState管理存储类型，用于触发重新渲染
  const [storageType, setStorageType] = useState('1');

  const selectedConversionKey = selectedConversionId?.id || selectedConversionId;
  const fieldModalId = forms.getFieldValue('id');

  // 当抽屉打开且选中节点变化时，重置表单并回显默认值
  React.useEffect(() => {
    if (!selectedNode) return;
    if (drawerOpen && selectedNode) {
      // 构建表单数据
      const formData = {
        ...selectedNode.data,
        apiName: selectedNode.data?.apiName || '',
        custom: selectedNode.data.custom || selectedNode.data.mdmDataSetId,
      };
      
      // 对于源节点和目标表，添加dexSourceId和tableName
      if (selectedNode.type === 'mysqlTableSource' || selectedNode.type === 'mongoCollectionSource' || selectedNode.type === 'mysqlTableTarget' || selectedNode.type === 'mongoCollectionTarget') {
        formData.dexSourceId = selectedNode.data.config?.dexSourceId;
        formData.tableName = selectedNode.data.config?.tableName;
      }
      
      // 对于fileTarget，添加fileType
      if (selectedNode.type === 'fileTarget' && selectedNode.data.config?.fileType) {
        formData.fileType = selectedNode.data.config.fileType;
      }
      
      // 对于fileSource，添加storageType并更新本地状态
      if (selectedNode.type === 'fileSource') {
        const storedStorageType = selectedNode.data.config?.storageType || '1';
        formData.storageType = storedStorageType;
        // 更新本地状态以保持同步
        setStorageType(storedStorageType);
        
        // 添加其他字段
        formData.filePath = selectedNode.data.config?.filePath || '';
        formData.headerRow = selectedNode.data.config?.headerRow || '';
        formData.dataStartRow = selectedNode.data.config?.dataStartRow || '2';
        formData.sheetName = selectedNode.data.config?.sheetName || '';
      }
      
      // 对于mongoCollectionTarget，添加fields
      let fields = [];
      if (selectedNode.type === 'mongoCollectionTarget') {
        // 从fieldMapping中提取sourceField，转换为fields数组
        fields = selectedNode.data.config?.fieldMapping?.map(item => item.sourceField) || [];
        formData.fields = fields;
      }
      
      // 对于validateProcess，添加validateRules
      if (selectedNode.type === 'validateProcess') {
        if (selectedNode.data.config?.validateRules && selectedNode.data.config.validateRules.length > 0) {
          formData.validateRules = selectedNode.data.config.validateRules;
          // 同步到conversionList
          const rulesList = selectedNode.data.config.validateRules.map((rule, index) => ({
            id: index.toString(),
            fieldName: rule.fieldName,
            ruleExpression: rule.ruleExpression,
            failReason: rule.failReason
          }));
          setConversionList(rulesList);
          // 自动选中第一条规则
          setSelectedConversionId(rulesList[0].id);
        } else {
          // 如果没有校验规则，默认添加一条
          formData.validateRules = [{ fieldName: '', ruleExpression: '', failReason: '' }];
          // 同步到conversionList
          const defaultRule = [{ id: '0', fieldName: '', ruleExpression: '', failReason: '' }];
          setConversionList(defaultRule);
          // 选中默认规则
          setSelectedConversionId('0');
        }
      }
      
      // 重置表单并设置默认值
      form.resetFields();
      form.setFieldsValue(formData);
      
      // 同步fields值到selectedFields状态
      if (selectedNode.type === 'mongoCollectionTarget') {
        setSelectedFields(fields);
      }
      
      // 对于源节点，加载相应的数据
      if (selectedNode.type === 'mysqlTableSource' && selectedNode.data.config?.dexSourceId) {
        api.getDataSourceTableFields({ dexSourceId: selectedNode.data.config.dexSourceId }).then((response) => {
          setTableData(response?.data || []);
        });
      }
      
      if (selectedNode.type === 'mongoCollectionSource' && selectedNode.data.config?.dexSourceId) {
        api.getMongoCollections(selectedNode.data.config.dexSourceId).then((response) => {
          setTableData(response?.data || []);
        });
      }
    }
  }, [drawerOpen, selectedNode, form, api, setTableData]);
  
  // 当dataSourceTableFields变化时，更新表单中的字段映射
  React.useEffect(() => {
    if (selectedNode && (selectedNode.type === 'mysqlTableTarget' || selectedNode.type === 'fileTarget')) {
      // 构建字段映射
      const fieldMapping = dataSourceTableFields.map((item) => ({
        sourceField: item.sourceField,
        targetField: item.targetField || item.code || item.name,
      }));
      
      // 更新表单中的字段映射
      form.setFieldsValue({
        fieldMapping: fieldMapping,
      });
    }
  }, [dataSourceTableFields, selectedNode, form]);
  
  // 当conversionList变化时，更新表单中的validateRules
  React.useEffect(() => {
    if (selectedNode && selectedNode.type === 'validateProcess') {
      // 构建validateRules
      const validateRules = conversionList.map((item) => ({
        fieldName: item.fieldName,
        ruleExpression: item.ruleExpression,
        failReason: item.failReason
      }));
      
      // 更新表单中的validateRules
      form.setFieldsValue({
        validateRules: validateRules,
      });
    }
  }, [conversionList, selectedNode, form]);

  if (!selectedNode) {
    return null;
  }

  const renderMappingSelect = (record, index) => (
    <Select
      showSearch={{ optionFilterProp: 'label' }}
      value={record.sourceField}
      placeholder="请选择数据集"
      style={{ width: 150 }}
      allowClear
      onClear={()=> {
        onTableMappingChange('', record, index) 
      }}
      options={dataSourceTableFields.filter((item) => {
        // console.log('item', item, 'record', record);
        return item.dataType && record.dataType ? item.dataType == record.dataType : true;
      })
      .map(item => ({
        ...item,
        value: item.code || item.name,
        label: item.label || item.name
      }))}
      onChange={(value) => {
        console.log('_---------------', index, value); 
        
        onTableMappingChange(value, record, index)
      }}
    />
  );

  const handleDatasetChange = (value) => {
    const dataSetId = value && value.length > 0 ? value[value.length - 1] : null;
    form.setFieldsValue({ custom: value });
    setSelectedDataSetId(dataSetId);
    if (dataSetId) {
      fetchTableData(dataSetId, 1, 9999999);
    }
  };

  return (
    <>
      <Drawer
        keyboard={false}
        mask={false}
        className="DrawerNode"
        title={` ${selectedNode.data.label}`}
        placement="right"
        size={780}
        getContainer={false}
        onClose={onClose}
        open={drawerOpen}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button style={{ marginRight: 8 }} onClick={onClose}>
              取消
            </Button>
            <Button type="primary" loading={formLoading} onClick={() => form.submit()}>
              保存
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish} onValuesChange={onValuesChange}>
          <Form.Item name="label" label="节点名称">
            <Input  />
          </Form.Item>

          {selectedNode.type === 'sourceDataset' && (
            <>
              <Form.Item name="custom" label="选择数据集">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Cascader
                    onClear={() => setTableData([])}
                    allowClear
                    defaultValue={selectedNode.custom || selectedNode.data?.custom || selectedNode.data?.mdmDataSetId}
                    showSearch={{ optionFilterProp: 'label' }}
                    placeholder="请选择数据集"
                    onChange={handleDatasetChange}
                    options={dataSetOptions}
                  />
                  {!preview ? (
                    <Button type="primary" variant="outlined" onClick={() => setPreview(true)}>
                      <EyeOutlined style={{ fontSize: 16 }} /> 预览
                    </Button>
                  ) : (
                    <Button type="primary" variant="outlined" onClick={() => setPreview(false)}>
                      <EyeInvisibleOutlined style={{ fontSize: 16 }} /> 收起
                    </Button>
                  )}
                </div>
              </Form.Item>
              <p style={{ padding: '0 15px' }}>
                包含糖尿病患者基本信息、主诉、诊断、处方等非结构化文本字段 · 12,450 行 · 10 字段
              </p>
              {preview ? (
                <Card title={`字段列表（${tableData.length}个）`} className="form-card-head" style={{ margin: 15 }}>
                  <Table
                    key={tableData.length}
                    columns={[
                      {
                        title: '字段名称',
                        dataIndex: 'columnName',
                        key: 'columnName',
                        render: (text) => <a>{text}</a>,
                      },
                      {
                        title: '数据项名称',
                        dataIndex: 'cnName',
                        key: 'cnName',
                      },
                      {
                        title: '数据类型',
                        dataIndex: 'dataTypeName',
                        key: 'dataTypeName',
                      },
                      {
                        title: '字段长度',
                        dataIndex: 'dataLen',
                        key: 'dataLen',
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: (_, record) => (
                          <Button 
                            type="text" 
                            danger 
                            onClick={() => {
                              setTableData(tableData.filter(item => item.key !== record.key && item.columnName !== record.columnName));
                            }}
                          >
                            删除
                          </Button>
                        ),
                      },
                    ]}
                    dataSource={tableData}
                    loading={tableLoading}
                  />
                </Card>
              ) : null}
            </>
          )}

          {selectedNode.type === 'nlpProcess' && (
            <>
              <Form.Item name="apiName" label="选择NLP模型">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Select
                    allowClear
                    onClear={()=> {
                      setTableData([]);
                      setTableTag([]);
                    }}
                    showSearch={{ optionFilterProp: 'label' }}
                    defaultValue={selectedNode?.apiName || selectedNode.data?.apiName || selectedNode.data?.config?.apiName}
                    placeholder="请选择数据集"
                    options={apiNpl}
                    onChange={(value, option) => {
                      form.setFieldsValue({ apiName: value });

                      api.getNplInfo(option.confId).then((response) => {
                        setTableData(response?.data?.vars?.map((item) => ({ ...item, key: item.name })) || []);
                        setTableTag(response?.data?.result || []);
                      });
                    }}
                  />
                </div>
              </Form.Item>

              <p style={{ padding: '0 15px' }}>适用输入：患者病历文本、诊断描述（text类型字段）</p>

              <Table
                style={{ padding: '0 15px' }}
                columns={[
                  {
                    title: '输入参数',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '数据类型',
                    dataIndex: 'sourceField',
                    key: 'sourceField',
                    render: (_, record, index) => renderMappingSelect(record,index),
                  },
                ]}
                dataSource={tableData}
              />
              {tableTag?.length ? (
                <>
                  <p style={{ padding: '0 15px' }}>
                    输出参数<span style={{ color: 'red' }}>*</span>
                  </p>
                  <p
                    style={{
                      display: 'flex',
                      gap: '15px',
                      padding: '0 15px',
                      flexWrap: 'wrap',
                      marginBottom: 0,
                    }}
                  >
                    {tableTag.map((item) => (
                      <Tag key={item} color="processing">
                        {item}
                      </Tag>
                    ))}
                  </p>
                </>
              ) : null}
            </>
          )}

          {selectedNode.type === 'fieldTransform' && (
            <Card
              className="form-card-head"
              style={{ margin: 0, borderWidth: 0, height: 'calc(100vh - 240px)', overflow: 'auto' }}
            >
              <div id="output-field" style={{ display: 'flex' }}>
                <div className="left">
                  <div className="title2">
                    <span className="title">输出目标字段</span>
                    <span style={{ color: '#1890FF', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}>
                      <PlusOutlined />新增字段
                    </span>
                  </div>
                  <p>点击字段查看详情，右侧配置字段映射规则</p>
                  <div className="list">
                    {conversionList?.length ? (
                      conversionList.map((item) => (
                        <div
                          className={['item', selectedConversionKey === item.id ? 'active' : '']
                            .filter(Boolean)
                            .join(' ')}
                          key={item.id}
                          onClick={() => {
                            setSelectedConversionId(item);
                            const currentRule = conversionRules[item.id] || {
                              ruleType: 'patient_id',
                              mapping: '',
                              rule: '111',
                            };
                            setTimeout(() => {
                              form.setFieldsValue({
                                ruleType: currentRule.ruleType || currentRule.targetField,
                                mapping: currentRule.mapping,
                                rule: currentRule.rule,
                              });
                            });
                          }}
                        >
                          <div className="left-item">
                            <div className="en-name">{item.enName}</div>
                            <div className="cn-name">{item.cnName}</div>
                          </div>
                          <div className="operate">
                            <span className="type">{item.dataTypeName || item.typeName || item.dataType}</span>
                            <span
                              onClick={() => {
                                forms.setFieldsValue({
                                  enName: item.enName,
                                  cnName: item.cnName,
                                  dataType: item.dataType,
                                  id: item.id,
                                });
                                setIsModalOpen(true);
                              }}
                              style={{ color: '#1890ff', cursor: 'pointer' }}
                            >
                              <EditOutlined />
                            </span>
                            <span
                              style={{ cursor: 'pointer' }}
                              onClick={(event) => {
                                event.stopPropagation();
                                setConversionList((previous) => {
                                  const nextList = previous.filter((current) => current.id !== item.id);
                                  if (selectedConversionId?.id === item.id && nextList.length) {
                                    const firstItem = nextList[0];
                                    setSelectedConversionId(firstItem);
                                    const firstRule = firstItem[item.id] || {
                                      ruleType: 'patient_id',
                                      mapping: '',
                                      rule: '111',
                                    };
                                    setTimeout(() => {
                                      form.setFieldsValue({
                                        ruleType: firstRule.ruleType || firstRule.targetField,
                                        mapping: firstRule.mapping,
                                        rule: firstRule.rule,
                                      });
                                    });
                                  }
                                  return nextList;
                                });
                              }}
                            >
                              <DeleteOutlined style={{ cursor: 'pointer' }} />
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <Empty style={{ margin: '40px 0' }} description={false} />
                        <p style={{ color: 'rgba(51, 51, 51, 0.4)', textAlign: 'center' }}>请添加目标字段</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="right">
                  <div className="title">规则配置</div>
                  <Form.Item name="ruleType" label="规则类型">
                    <Select
                      allowClear
                      onClear={()=>{
                        setConversionRules((previous) => ({
                          ...previous,
                          [selectedConversionId?.id]: {
                            ...(previous[selectedConversionId?.id] || {}),
                            ruleType: undefined,
                            mapping: undefined,
                            rule: undefined,
                          },
                        }));
                      }}
                      showSearch={{ optionFilterProp: 'label' }}
                      placeholder="请选择规则类型"
                      onChange={(value) => {
                        setConversionRules((previous) => ({
                          ...previous,
                          [selectedConversionId?.id]: {
                            ...(previous[selectedConversionId?.id] || {}),
                            ruleType: value,
                            mapping: undefined,
                            rule: undefined,
                          },
                        }));
                      }}
                      options={[
                        {
                          value: 'patient_id',
                          label: '直接映射',
                        },
                        {
                          value: 'rule',
                          label: '表达式',
                        },
                      ]}
                    />
                  </Form.Item>
                  {ruleType === 'rule' ? (
                    <Form.Item name="rule" label="表达式描述">
                      <TextArea
                        placeholder="请输入表达式描述"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                        value={conversionRules[selectedConversionId?.id]?.rule || ''}
                        onChange={(event) => {
                          setConversionRules((previous) => ({
                            ...previous,
                            [selectedConversionId?.id]: {
                              ...(previous[selectedConversionId?.id] || {}),
                              rule: event.target.value || '',
                            },
                          }));
                        }}
                      />
                      <p style={{ padding: 0, margin: '5px 0', color: '#333333' }}>
                        如：身份证号获取出生日期表达式：\d{6}(\d{4})(\d{2})(\d{2})\d{4}
                      </p>
                    </Form.Item>
                  ) : null}
                  <Form.Item name="mapping" label="选择映射字段" hidden={ruleType === 'rule'}>
                    <Select
                      allowClear
                      onClear={() => {
                        setConversionRules((previous) => ({
                          ...previous,
                          [selectedConversionId?.id]: {
                            ...(previous[selectedConversionId?.id] || {}),
                            mapping: undefined,
                          },
                        }));
                      }}
                      showSearch={{ optionFilterProp: 'label' }}
                      key={`${selectedConversionId?.length}-${selectedConversionId?.id}`}
                      placeholder="请选择选择映射字段"
                      options={tableSelect.filter(
                        (item) =>
                          item.dataType == selectedConversionId?.dataType ||
                          item.dataTypeName == selectedConversionId?.dataTypeName ||
                          item.dataType === selectedConversionId?.targetFieldType ||
                          item.dataTypeName == selectedConversionId?.dataType,
                      )}
                    />
                  </Form.Item>
                </div>
              </div>
            </Card>
          )}

          {selectedNode.type === 'targetDataset' && (
            <>
              <Form.Item name="custom" label="选择目标数据集">
                <Cascader
                  allowClear
                  onClear={() => setTableData([])}
                  defaultValue={selectedNode.custom || selectedNode.data?.custom || selectedNode.data?.mdmDataSetId}
                  showSearch={{ optionFilterProp: 'label' }}
                  placeholder="请选择数据集"
                  onChange={handleDatasetChange}
                  options={dataSetOptions}
                />
              </Form.Item>

              <Table
                style={{ padding: '0 15px' }}
                loading={tableLoading}
                columns={[
                  {
                    title: '字段名称（目标）',
                    dataIndex: 'cnName',
                    key: 'cnName',
                  },
                  {
                    title: '映射（前序节点所有输出参数）',
                    dataIndex: 'dataTypeName',
                    key: 'dataTypeName',
                    render: (_, record, index) => renderMappingSelect(record,index),
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_, record) => (
                      <Button 
                        type="text" 
                        danger 
                        onClick={() => {
                          setTableData(tableData.filter(item => item.key !== record.key && item.columnName !== record.columnName));
                        }}
                      >
                        删除
                      </Button>
                    ),
                  },
                ]}
                dataSource={tableData}
              />
            </>
          )}

          {selectedNode.type === 'scriptProcess' && (
            <div id="output-field" style={{ display: 'flex' }}>
              <div className="right" style={{ width: '100%' }}>
                <div className="title">脚本代码</div>
                <Editor
                  value={code}
                  className={!code && 'has-value'}
                  onValueChange={(newCode) => {
                    setCode(newCode);
                    if (selectedConversionId) {
                      setConversionList((previous) =>
                        previous.map((item) =>
                          item.id === (selectedConversionId?.id || selectedConversionId)
                            ? { ...item, code: newCode }
                            : item,
                        ),
                      );
                    }
                  }}
                  highlight={(value) => highlight(value, languages.js)}
                  padding={10}
                  style={editorStyle}
                />
              </div>
            </div>
          )}

          {selectedNode.type === 'ifElseProcess' && (
            <div id="output-field" style={{ display: 'flex' }}>
              <div className="left">
                <div className="title2">
                  <span className="title">逻辑列表</span>
                  <span
                    style={{ color: '#1890FF', cursor: 'pointer' }}
                    onClick={() => {
                      setConversionList((previous) => [
                        ...previous,
                        { id: Date.now(), code: '', name: previous.length ? 'ELSE IF' : 'ELSE' },
                      ]);
                    }}
                  >
                    <PlusOutlined /> ELSE
                  </span>
                </div>
                <p>点击逻辑名称查看详情，右侧配置逻辑规则</p>
                <div className="list">
                  {conversionList.map((item, index) => (
                    <div
                      className={['item', selectedConversionKey === item.id ? 'active' : '']
                        .filter(Boolean)
                        .join(' ')}
                      key={item.id}
                      onClick={() => setSelectedConversionId(item.id)}
                    >
                      <div className="left-item">
                        {editingLogicId === item.id ? (
                          <Input
                            
                            
                            value={editingLogicName}
                            onChange={(event) => setEditingLogicName(event.target.value)}
                            onBlur={() => {
                              setConversionList((previous) =>
                                previous.map((current) =>
                                  current.id === item.id ? { ...current, name: editingLogicName || current.name } : current,
                                ),
                              );
                              setEditingLogicId(null);
                            }}
                            onPressEnter={() => {
                              setConversionList((previous) =>
                                previous.map((current) =>
                                  current.id === item.id ? { ...current, name: editingLogicName || current.name } : current,
                                ),
                              );
                              setEditingLogicId(null);
                            }}
                            size="small"
                            style={{ width: 120 }}
                            autoFocus
                          />
                        ) : (
                          <div
                            className="en-name"
                            style={{ cursor: 'text', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                            onDoubleClick={(event) => {
                              event.stopPropagation();
                              setEditingLogicId(item.id);
                              setEditingLogicName(item.name || item.enName || (index ? 'ELSE IF' : 'IF'));
                            }}
                          >
                            {item.name || item.enName || (index ? 'ELSE IF' : 'IF')}
                          </div>
                        )}
                      </div>
                      <div className="operate">
                        {editingLogicId !== item.id || !editingLogicId ? (
                          <EditOutlined
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingLogicId(item.id);
                              setEditingLogicName(item.name || item.enName || (index ? 'ELSE IF' : 'IF'));
                            }}
                            style={{ fontSize: 12, color: '#1890ff' }}
                          />
                        ) : null}
                        {conversionList.length > 1 ? (
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setConversionList(conversionList.filter((current) => current.id !== item.id));
                            }}
                          >
                            <DeleteOutlined style={{ cursor: 'pointer' }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="right">
                <div className="title">逻辑规则</div>
                <Editor
                  value={code}
                  className={!code && 'has-value'}
                  onValueChange={(newCode) => {
                    setCode(newCode);
                    if (selectedConversionId) {
                      setConversionList((previous) =>
                        previous.map((item) =>
                          item.id === (selectedConversionId?.id || selectedConversionId)
                            ? { ...item, code: newCode }
                            : item,
                        ),
                      );
                    }
                  }}
                  highlight={(value) => highlight(value, languages.js)}
                  padding={10}
                  style={editorStyle}
                />
              </div>
            </div>
          )}

          {/* MySQL数据源配置 */}
          {selectedNode.type === 'mysqlTableSource' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="dexSourceId" label="数据源">
                <Select
                  showSearch
                  placeholder="请选择MySQL数据源"
                  onChange={(value) => {
                    if (value) {
                      // 加载表名列表
                      api.getDataSourceTables({ dexSourceId: value }).then((response) => {
                        setTableData(response?.data || []);
                      });
                    }
                  }}
                >
                  {dataSourceList.filter(item => item.dbType === 1).map((item) => (
                    <Select.Option key={item.dexSourceId} value={item.dexSourceId}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tableName" label="表名">
                <Select showSearch placeholder="请选择表名" onChange={(value) => {
                  const dexSourceId = form.getFieldValue('dexSourceId');
                  if (dexSourceId && value) {
                    // 加载字段列表
                    api.getMySQLTableFields(dexSourceId, value).then((response) => {
                      setDataSourceTableFields(response?.data || []);
                    });
                  }
                }}>
                  {tableData.map((item) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.comment}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          )}
          
          {/* MySQL目标表配置 */}
          {selectedNode.type === 'mysqlTableTarget' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="dexSourceId" label="数据源">
                <Select
                  showSearch
                  placeholder="请选择MySQL数据源"
                  onChange={(value) => {
                    if (value) {
                      // 加载表名列表
                      api.getDataSourceTables({ dexSourceId: value }).then((response) => {
                        setTableData(response?.data || []);
                      });
                    }
                  }}
                >
                  {dataSourceList.filter(item => item.dbType === 1).map((item) => (
                    <Select.Option key={item.dexSourceId} value={item.dexSourceId}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tableName" label="表名">
                <Select showSearch placeholder="请选择表名" onChange={(value) => {
                  const dexSourceId = form.getFieldValue('dexSourceId');
                  if (dexSourceId && value) {
                    // 加载字段列表
                    api.getMySQLTableFields(dexSourceId, value).then((response) => {
                      setDataSourceTableFields(response?.data || []);
                    });
                  }
                }}>
                  {tableData.map((item) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.comment}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          )}

          {/* MongoDB数据源配置 */}
          {selectedNode.type === 'mongoCollectionSource' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="dexSourceId" label="数据源">
                <Select
                  showSearch
                  placeholder="请选择MongoDB数据源"
                  onChange={(value) => {
                    if (value) {
                      // 加载集合列表
                      api.getMongoCollections(value).then((response) => {
                        setTableData(response?.data || []);
                      });
                    }
                  }}
                >
                  {dataSourceList.filter(item => item.dbType === 3).map((item) => (
                    <Select.Option key={item.dexSourceId} value={item.dexSourceId}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tableName" label="集合名">
                <Select showSearch placeholder="请选择集合名" onChange={(value) => {
                  const dexSourceId = form.getFieldValue('dexSourceId');
                  if (dexSourceId && value) {
                    // 加载字段列表
                    // api.getMongoCollectionFields(value).then((response) => {
                    //   setDataSourceTableFields(response?.data || []);
                    // });
                  }
                }}>
                  {tableData.map((item) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Card>
          )}
          
          {/* MongoDB目标集合配置 */}
          {selectedNode.type === 'mongoCollectionTarget' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="dexSourceId" label="数据源">
                <Select
                  showSearch
                  placeholder="请选择MongoDB数据源"
                  onChange={(value) => {
                    if (value) {
                      // 加载集合列表
                      api.getMongoCollections(value).then((response) => {
                        setTableData(response?.data || []);
                      });
                    }
                  }}
                >
                  {dataSourceList.filter(item => item.dbType === 3).map((item) => (
                    <Select.Option key={item.dexSourceId} value={item.dexSourceId}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="tableName" label="集合名">
                <Select showSearch placeholder="请选择集合名" onChange={(value) => {
                  const dexSourceId = form.getFieldValue('dexSourceId');
                  if (dexSourceId && value) {
                    // 加载字段列表
                    api.getMongoCollectionFields(dexSourceId, value).then((response) => {
                      setTableData(response?.data || []);
                    });
                  }
                }}>
                  {tableData.map((item) => (
                    <Select.Option key={item.name} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="fields" label="选择字段">
                <Table
                  dataSource={tableSelect ? tableSelect.map(item => ({ ...item, key: item.key || item.code || item.name || item.label })) : []}
                  rowKey="code"
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    columnWidth: 48,
                    selectedRowKeys: selectedFields,
                    onChange: (selectedRowKeys) => {
                      console.log('选择的字段:', selectedRowKeys);
                      setSelectedFields(selectedRowKeys);
                      // 同时更新form中的值
                      form.setFieldsValue({ fields: selectedRowKeys });
                    },
                    // 确保使用code作为选中的key
                    getCheckboxProps: (record) => ({
                      value: record.code,
                    }),
                  }}
                  columns={[
                    {
                      title: '字段名',
                      dataIndex: 'label',
                      key: 'label',
                    },
                  ]}
                />
              </Form.Item>
            </Card>
          )}



          {/* Excel文件数据源配置 */}
          {selectedNode.type === 'fileSource' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="storageType" label="存储类型">
                <Select showSearch placeholder="请选择存储类型" onChange={(value) => {
                  // 设置存储类型值
                  form.setFieldsValue({ storageType: value });
                  // 更新本地状态以触发重新渲染
                  setStorageType(value);
                }}>
                  <Select.Option value="1">远程</Select.Option>
                  <Select.Option value="2">本地上传</Select.Option>
                </Select>
              </Form.Item>
              
              <Form.Item 
                name="filePath" 
                label="文件路径" 
                hidden={storageType === '2'}
              >
                <Input placeholder="请输入文件路径" />
              </Form.Item>
              
              <Form.Item 
                name="uploadFile" 
                label="上传文件" 
                hidden={storageType !== '2'}
              >
                <Upload
                  action={() => {
                    const baseApi = process.env.VUE_APP_BASE_API === "/api" ? "/api" : location.origin + "/api";
                    return baseApi + "/fss/file/form";
                  }}
                  listType="file"
                  maxCount={1}
                  accept=".xlsx,.xls"
                  onChange={(info) => {
                    if (info.file.status === 'done') {
                      message.success(`${info.file.name} 文件上传成功`);
                      // 保存文件路径到表单
                      form.setFieldsValue({ filePath: info.file.response?.data?.filePath || '' });
                    } else if (info.file.status === 'error') {
                      message.error(`${info.file.name} 文件上传失败`);
                    }
                  }}
                >
                  <Button icon={<UploadOutlined />}>点击上传</Button>
                </Upload>
              </Form.Item>
              
              {/* <Form.Item name="sheetName" label="工作表名称">
                <Input placeholder="请输入工作表名称" />
              </Form.Item> */}
              <Form.Item name="headerRow" label="表头行">
                <Input type="number" placeholder="请输入表头行号" />
              </Form.Item>
              <Form.Item name="dataStartRow" label="数据行">
                <Input type="number" placeholder="请输入数据开始行号" />
              </Form.Item>
            </Card>
          )}

          {/* Excel文件导出配置 */}
          {selectedNode.type === 'fileTarget' && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <Form.Item name="storageType" label="存储类型" initialValue="1" hidden>
                <Input value="1" readOnly />
              </Form.Item>
              <Form.Item name="fileType" label="导出格式">
                <Select showSearch placeholder="请选择导出格式">
                  <Select.Option value="excel">Excel</Select.Option>
                  <Select.Option value="csv">CSV</Select.Option>
                </Select>
              </Form.Item>
            </Card>
          )}

          {/* 数据校验配置 */}
          {selectedNode.type === 'validateProcess' && (
            <div id="output-field" style={{ display: 'flex' }}>
              <div className="left">
                <div className="title2">
                  <span className="title">校验规则列表</span>
                  <span
                    style={{ color: '#1890FF', cursor: 'pointer' }}
                    onClick={() => {
                      const newRule = { id: Date.now().toString(), fieldName: '', ruleExpression: '', failReason: '' };
                      setConversionList((previous) => [...previous, newRule]);
                      setSelectedConversionId(newRule.id);
                    }}
                  >
                    <PlusOutlined /> 添加规则
                  </span>
                </div>
                <p>点击规则查看详情，右侧配置规则参数</p>
                <div className="list">
                  {conversionList.map((item, index) => (
                    <div
                      className={['item', selectedConversionKey === item.id ? 'active' : '']
                        .filter(Boolean)
                        .join(' ')}
                      key={item.id}
                      onClick={() => setSelectedConversionId(item.id)}
                    >
                      <div className="left-item">
                        <div className="en-name">
                          {item.fieldName || `规则 ${index + 1}`}
                        </div>
                      </div>
                      <div className="operate">
                        {conversionList.length > 1 ? (
                          <span
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentSelectedId = selectedConversionId?.id || selectedConversionId;
                              const newList = conversionList.filter((current) => current.id !== item.id);
                              setConversionList(newList);
                              console.log('currentSelectedId == item.id',currentSelectedId, item.id, currentSelectedId == item.id);
                              
                              if (currentSelectedId == item.id) {
                                  setSelectedConversionId(newList[0] && newList[0].id || '');
                              }
                            }}
                          >
                            <DeleteOutlined style={{ cursor: 'pointer' }} />
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="right">
                {JSON.stringify(conversionList)}---
                {JSON.stringify(selectedConversionId)}
                <div className="title">规则配置</div>
                {selectedConversionId && (
                  <Card style={{ margin: '0 15px' }}>
                    <Form.Item label="字段名">
                      <Select 
                        showSearch 
                        placeholder="请选择字段名"
                        value={conversionList.find(item => item.id === selectedConversionId)?.fieldName || undefined}
                        onChange={(value) => {
                          setConversionList((previous) => {
                            return previous.map((item) => {
                              if (item.id === selectedConversionId) {
                                return { ...item, fieldName: value };
                              }
                              return item;
                            });
                          });
                        }}
                      >
                        {tableSelect.map((item) => (
                          <Select.Option key={item.code} value={item.code}>
                            {item.label} ({item.code})
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="校验规则">
                      <Input 
                        placeholder="请输入校验规则"
                        value={conversionList.find(item => item.id === selectedConversionId)?.ruleExpression || ''}
                        onChange={(event) => {
                          setConversionList((previous) => {
                            return previous.map((item) => {
                              if (item.id === selectedConversionId) {
                                return { ...item, ruleExpression: event.target.value };
                              }
                              return item;
                            });
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item label="错误提示">
                      <Input 
                        placeholder="请输入错误提示信息"
                        value={conversionList.find(item => item.id === selectedConversionId)?.failReason || ''}
                        onChange={(event) => {
                          setConversionList((previous) => {
                            return previous.map((item) => {
                              if (item.id === selectedConversionId) {
                                return { ...item, failReason: event.target.value };
                              }
                              return item;
                            });
                          });
                        }}
                      />
                    </Form.Item>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* MySQL目标表字段映射 - 隐藏 */}
          {/* {(selectedNode.type === 'mysqlTableTarget' || selectedNode.type === 'fileTarget') && (
            <Card className="form-card-head" style={{ margin: 15 }}>
              <div className="title">字段映射</div>
              <Table
                style={{ padding: '0 15px' }}
                loading={tableLoading}
                columns={[
                  {
                    title: '目标字段',
                    dataIndex: 'label',
                    key: 'label',
                  },
                  {
                    title: '映射字段',
                    dataIndex: 'dataTypeName',
                    key: 'dataTypeName',
                    render: (_, record, index) => {
                      // console.log('record', record);
                      return renderMappingSelect(record,index)
                    },
                  },
                  {
                    title: '操作',
                    key: 'action',
                    render: (_, record) => (
                      <Button 
                        type="text" 
                        danger 
                        onClick={() => {
                          setTableSelect(tableSelect.filter(item => item.key !== record.key && item.name !== record.name));
                        }}
                      >
                        删除
                      </Button>
                    ),
                  },
                ]}
                dataSource={tableSelect}
              />
            </Card>
          )}

          {/* {
            selectedNode.type === 'mysqlTableTarget' && (
              <Card className="form-card-head" style={{ margin: 15 }}>
                <div className="title">数据源表字段</div>
                <Select showSearch placeholder="请选择数据源表字段" allowClear>
                  {tableData.map((item) => (
                    <Select.Option key={item.enName} value={item.enName}>
                      {item.cnName}
                    </Select.Option>
                  ))}
                </Select>
              </Card>
            )
          } */}



        </Form>
      </Drawer>

      <Modal
        title={fieldModalId ? '编辑字段' : '新建字段'}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        afterClose={handleCancel}
        okText="确定"
        cancelText="取消"
        getContainer={false}
      >
        <Form form={forms} layout="vertical" onFinish={handleAddField}>
          <Form.Item name="id" hidden />
          <Form.Item name="enName" label="字段英文名称" rules={[{ required: true, message: '请输入字段英文名称' }]}> 
            <Input allowClear placeholder="请输入字段英文名称" />
          </Form.Item>
          <Form.Item name="cnName" label="字段中文名称" rules={[{ required: true, message: '请输入字段中文名称' }]}> 
            <Input allowClear placeholder="请输入字段中文名称" />
          </Form.Item>
          <Form.Item name="dataType" label="数据类型" rules={[{ required: true, message: '请选择数据类型' }]}> 
            <Select showSearch placeholder="请选择数据类型" allowClear>
              {dict.map((item) => (
                <Select.Option key={item.itemCode} value={item.itemCode}>
                  {item.itemName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NodeConfigDrawer;
