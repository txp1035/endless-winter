import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import data from './data.json';
const { addUser, deleteUser, modifyUser } = services.UserController;

function common(columns) {
  const width = columns
    .map((item) => item.width || 100)
    .reduce((pre, next) => pre + next);
  return {
    scroll: {
      x: width,
    },
    bordered: true,
    rowKey: (record: any, index: any) => {
      const obj = {
        index, // 防止后端返回一样的数据
        ...record,
      };
      const { id } = record;
      if (id) {
        return id;
      }
      return JSON.stringify(obj);
    },
  };
}

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await deleteUser({
      userId: selectedRows.find((row) => row.id)?.id || '',
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const 排名总分 = data.reduce((pre, cur) => {
    return {
      分数: pre.分数 + cur.分数,
    };
  }).分数;
  const newData = data
    .map((item, index, arr) => {
      const obj = { ...item, 原始分数: item.分数 };
      arr.forEach((item1) => {
        if (item1.分数转移 === obj.名字) {
          obj.分数 = obj.分数 + item1.分数;
        }
      });
      obj.分数国战占比 = ((obj.分数 / 2187660487) * 100).toFixed(2);
      obj.分数排名占比 = ((obj.分数 / 排名总分) * 100).toFixed(2);
      if (item.分数转移) {
        obj.分数 = 0;
      }
      return obj;
    })
    .sort((a, b) => b.分数 - a.分数);
  const [dataSource, setDataSource] = useState(newData);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '区排名',
      valueType: 'index',
    },
    {
      title: '国排名',
      dataIndex: '国战排名',
    },
    {
      title: '组织',
      dataIndex: '组织',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        520: { text: '520' },
        qqq: { text: 'qqq' },
        one: { text: 'one' },
        no2: { text: 'no2' },
        avn: { text: 'avn' },
        kkk: { text: 'kkk' },
      },
    },
    {
      title: '名字',
      dataIndex: '名字',
      valueType: 'text',
    },
    {
      title: '分数',
      dataIndex: '分数',
      valueType: 'text',
    },
    {
      title: '分数转移',
      dataIndex: '分数转移',
      valueType: 'text',
    },

    {
      title: '原始分数',
      dataIndex: '原始分数',
      valueType: 'text',
    },
    {
      title: '分数国战占比',
      dataIndex: '分数国战占比',
      valueType: 'text',
    },
    {
      title: '分数排名占比',
      dataIndex: '分数排名占比',
      valueType: 'text',
    },
  ];

  return (
    <PageContainer
      header={{
        title: '2808国战备战排名',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="查询表格"
        actionRef={actionRef}
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              const data = JSON.parse(JSON.stringify(dataSource));
              data.sort((a, b) => b.原始分数 - a.原始分数);
              setDataSource(data);
            }}
          >
            原始分数排序
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={() => {
              const data = JSON.parse(JSON.stringify(dataSource));
              data.sort((a, b) => b.分数 - a.分数);
              setDataSource(data);
            }}
          >
            分数排序
          </Button>,
        ]}
        dataSource={dataSource}
        columns={columns}
        {...common(columns)}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
