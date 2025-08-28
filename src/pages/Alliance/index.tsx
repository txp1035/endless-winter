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
  const 排名总分 = data.联盟积分.reduce((pre, cur) => {
    return {
      分数: pre.分数 + cur.分数,
    };
  }).分数;
  const newData = data.联盟积分
    .map((item) => {
      const 占比 = ((item.分数 / 排名总分) * 100).toFixed(2);
      console.log(排名总分);
      const obj = { ...item, 占比: (Number(占比) / 100) * 8 * 15 };
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
      title: '占比',
      dataIndex: '占比',
      valueType: 'text',
    },
  ];
  return (
    <PageContainer
      header={{
        title: '联盟排名',
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
