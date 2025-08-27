import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useState } from 'react';
import data from '../../utils/data.json';

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
  const 排名总分 = data.个人积分.reduce((pre, cur) => {
    return {
      分数: pre.分数 + cur.分数,
    };
  }).分数;
  const newData = data.个人积分
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
        title: '个人排名',
      }}
    >
      <ProTable<API.UserInfo>
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
    </PageContainer>
  );
};

export default TableList;
