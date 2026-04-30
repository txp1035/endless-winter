import data from '@/pages/521/游戏名数据.json';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import React, { useRef } from 'react';

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
const obj = {};
const newData = data
  .map((item) => {
    const { id, ...rest } = item;
    obj[id] = rest;
    return {
      name1: item.id,
      小号: item.小号,
    };
  })
  .filter((item) => item.小号);
console.log(newData);
const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '大号',
      dataIndex: 'name1',
      width: 200,
      render: (dom, entity) => {
        return <Tooltip title={'id:' + dom}>{obj[dom].名字[0]}</Tooltip>;
      },
    },
    {
      title: '小号',
      dataIndex: 'name2',
      render: (dom, entity) => {
        // console.log(entity);
        return entity.小号.map((item) => (
          <Tooltip title={'id:' + item}>
            <a style={{ marginRight: 10 }}>{obj[item].名字[0]}</a>
          </Tooltip>
        ));
      },
    },
  ];

  return (
    <PageContainer
      header={{
        title: '账号关联',
      }}
    >
      <ProTable<API.UserInfo>
        actionRef={actionRef}
        pagination={false}
        search={false}
        dataSource={newData}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
