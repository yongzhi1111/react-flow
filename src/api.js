// API 配置文件
const API_BASE_URL = '/api'; // 使用代理路径

// 通用请求函数
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const userToken = sessionStorage.getItem('token') || {}; // 从会话存储获取 token

  const VITE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhc3NvSWQiOjQsImV4cCI6MTc5MTcxNTQ2NCwicHJpbmNpcGFsIjoiMTUwMTAxMSIsInNpZCI6ImFjZmI5OTU3MTZlOTQxYTVhOTRkMDZhN2FjNzM0NDk1In0.L6TRPBPbhjxWVk-Gd0u_3syxDT6PxUzGODL5J9naDlQ'
  const VITE_REF_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhc3NvSWQiOjQsImV4cCI6MTgyNzcxNTQ2NCwicHJpbmNpcGFsIjoiMTUwMTAxMSIsInNpZCI6ImFjZmI5OTU3MTZlOTQxYTVhOTRkMDZhN2FjNzM0NDk1In0.xADgCvvDJZDnfhM_XbQHU9BZhlZxJVg-mF18n09BY4M"

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      authorization: userToken.token || VITE_TOKEN, // 使用环境变量中的 TOKEN 作为默认值
      refreshtoken: userToken.refreshToken || VITE_REF_TOKEN, // 使用环境变量中的 REF_TOKEN 作为默认值
    },
    ...options,
  };


  // console.log(import.meta.env, 'import.meta.env'); // 输出环境变量对象，检查是否正确加载了环境变量
  

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API 方法
export const api = {
  // 获取 todos
  getTodos: (id) => request(`/todos/${id}`),

  // 获取所有 todos
  getAllTodos: () => request('/todos'),

  // 创建 todo
  createTodo: (data) => request('/todos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 更新 todo
  updateTodo: (id, data) => request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // 删除 todo
  deleteTodo: (id) => request(`/todos/${id}`, {
    method: 'DELETE',
  }),

  // 示例：获取用户信息
  getUser: (id) => request(`/users/${id}`),

  // 示例：保存流程数据
  saveWorkflow: (data) => request('/workflows', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 示例：加载流程数据
  loadWorkflow: (id) => request(`/workflows/${id}`),

  // 获取数据集树形结构 // api/data-set-origin/org-source/tree?projId=1
  getDataSetTree: (projId) => request(`/data-set-origin/org-source/tree?projId=${projId}`),
  // getDataSetTree: (projId) => request(`/data-set-origin/org-source-data-prop/tree?projId=${projId}`),

  // 创建流程
  createFlow: (data) => request('/etl/flow/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),


  getFlowDetail: (data) => request('/etl/flow/detail', {
    method: 'POST',
    body: JSON.stringify(data),
  }),


  

  // 获取数据集字段
  getComputedStyle: (mdmDataSetId) => request(`/etl/dataset/fields?mdmDataSetId=${mdmDataSetId}`),


  // NPL列表
  getNplList: (data) => request(`/ai-conf/all/list`,{
    method: 'POST',
    body: JSON.stringify(data),
  }),


  // NPL表格输出字段表格
  getNplTableList: (data) => request(`/etl/node/precedingFields`,{
    method: 'POST',
    body: JSON.stringify(data),
  }),


  // 获取数据属性分页列表
  getDataProperties: (params) => request('/data-property/page', {
    method: 'POST',
    body: JSON.stringify(params),
  }),


  // 获取节点详情
  getNodeDetail: (params) => request(`/etl/node/detail`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),

   // 节点更新
  updateNode: (params) => request(`/etl/node/update`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),

   // 节点创建
  createNode: (params) => request(`/etl/node/create`, {
    method: 'POST',
    body: JSON.stringify(params),
  }),

  // NPL查询详情
  getNplInfo: (confId) => request(`/ai-conf/get?confId=`+ confId, {
    method: 'POST',
    body: JSON.stringify({confId}),
  }),

  // 获取字典
  getDict: (data) => request(`/dict/item/list`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // 删除节点
  deleteNode: (data) => request(`/etl/node/delete`, {
    method: 'post',
    body: JSON.stringify(data),
  }),

  // 获取节点详情
  getNodeDetail: (id) => request(`/etl/node/detail/${id}`),


  // 流程更新
  flowUpdate: (data) => request(`/etl/flow/update`, {
    method: 'post',
    body: JSON.stringify(data),
  }),

  // 运行节点
  runNode: (data) => request(`/etl/node/run?nodeId=${data.nodeId}`),

  // 获取流程日志
  getFlowLog: (data) => request(`/etl/exec/log`, {
    method: 'post',
    body: JSON.stringify(data),
  }),

  // 获取节点执行日志详情
  getNodeExecLogDetail: (data) => request(`/etl/nodeExecLog/detail`, {
    method: 'post',
    body: JSON.stringify(data),
  }),


  // 获取数据源表列表
  getDataSourceTables: async (data) => {
    const response = await request(`/etl/datasource/mysql/tables?dexSourceId=${data.dexSourceId}`);
    // 转换返回参数为 label、comment、value、name 格式
    if (response && response.data) {
      response.data = response.data.map(item => ({
        ...item,
        label: item.tableName || item.name,
        comment: item.comment || '',
        value: item.tableName || item.name,
        name: item.tableName || item.name
      }));
    }
    return response;
  },

  // 鑾峰彇鏁版嵁婧愯〃瀛楁
  getDataSourceTableFields: async (data) => {
    const response = await request(`/etl/datasource/mysql/tables?dexSourceId=${data.dexSourceId}`);
    // 转换返回参数为 label、comment、value、name 格式
    if (response && response.data) {
      response.data = response.data.map(item => ({
        ...item,
        label: item.tableName || item.name,
        comment: item.comment || '',
        value: item.tableName || item.name,
        name: item.tableName || item.name
      }));
    }
    return response;
  },
  
  // 鑾峰彇鏁版嵁婧愬垎椤垫暟瀛楃椤垫暟
  getDataSourcePage: (data) => request(`/dex-data-source/page`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  // 鑾峰彇MongoDB集合鍒楄〃
  getMongoCollections: async (dexSourceId) => {
    const response = await request(`/etl/datasource/mongo/collections?dexSourceId=${dexSourceId}`);
    // 转换返回参数为 label、comment、value、name 格式
    if (response && response.data) {
      response.data = response.data.map(item => ({
        ...item,
        label: item.collectionName || item.name,
        comment: item.comment || '',
        value: item.collectionName || item.name,
        name: item.collectionName || item.name
      }));
    }
    return response;
  },
  
  // 获取MySQL表字段
  getMySQLTableFields: async (dexSourceId, tableName) => {
    const response = await request(`/etl/datasource/mysql/fields?dexSourceId=${dexSourceId}&tableName=${tableName}`);
    // 转换返回参数为 label、comment、value、name 格式
    if (response && response.data) {
      response.data = response.data.map(item => ({
        ...item,
        label: item.fieldName || item.name,
        comment: item.comment || '',
        value: item.fieldName || item.name,
        name: item.fieldName || item.name,
        dataType: item.dataType || item.type
      }));
     
    }
    return response;
  },
  
  // 获取MongoDB集合字段
  getMongoCollectionFields: async (dexSourceId, collectionName) => {
    const response = await request(`/etl/datasource/mongo/fields?dexSourceId=${dexSourceId}`);
    // 转换返回参数为 label、comment、value、name 格式
    if (response && response.data) {
      response.data = response.data.map(item => ({
        ...item,
        label: item.fieldName || item.name,
        comment: item.comment || '',
        value: item.fieldName || item.name,
        name: item.fieldName || item.name
      }));
      
    }
    return response;
  },

  // 异步执行流程
  executeAsync: (flowId) => request(`/etl/flow/executeAsync/${flowId}`, {
    method: 'POST',
    // body: JSON.stringify({ flowId })
  }),

};

