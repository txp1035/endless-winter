import { deleteInfo, getInfo } from '@/utils/leancloud';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import Form from './Form';

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

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '数量',
      valueType: 'index',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <Form type="edit" actionRef={actionRef} info={record} />,
        <a
          key="view"
          onClick={() => {
            Modal.confirm({
              title: '是否删除',
              content: `${record.name}的预约`,
              onOk: async () => {
                await deleteInfo(record.id);
                actionRef.current?.reload();
              },
            });
          }}
        >
          删除
        </a>,
      ],
    },
    {
      title: '游戏名',
      dataIndex: 'name',
      width: 200,
    },
    {
      title: '预约类型',
      dataIndex: 'type',
      width: 300,
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '副执政-火晶' },
        2: { text: '副执政-研究加速' },
        3: { text: '教育部长-练兵加速' },
      },
    },
    {
      title: '材料数量',
      width: 200,
      dataIndex: 'number',
    },
    {
      title: '预约时间',
      dataIndex: 'time',
      render: (_, record) => {
        return String(record.time);
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '官职预约',
      }}
    >
      <ProTable<API.UserInfo>
        actionRef={actionRef}
        pagination={false}
        search={false}
        toolBarRender={() => [<Form type="add" actionRef={actionRef} />]}
        request={async (params, sort, filter) => {
          const res = await getInfo();
          return { data: res };
        }}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
