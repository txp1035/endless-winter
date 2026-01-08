import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import data from './data.json';

const newData = Object.entries(data)
  .filter(([key, _]) => {
    if (key.includes('国战') || key.includes('大作战')) {
      return false;
    }
    return true;
  })
  .map(([key, value]) => {
    const obj = { 小榜名字: key };
    value.forEach(({ 排名, ...rest }) => {
      obj[排名] = rest;
    });
    return obj;
  });
console.log(newData);

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

function getName(dom) {
  return (
    <div>
      <Tooltip
        title={
          <div>
            {Object.entries(dom).map(([key, value]) => {
              return (
                <div>
                  {key}：{value}
                </div>
              );
            })}
          </div>
        }
      >
        <a>{dom.名字}</a>
      </Tooltip>
    </div>
  );
}

const TableList: React.FC<unknown> = () => {
  const [dataSource, setDataSource] = useState(newData);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '小榜名字',
      dataIndex: '小榜名字',
      width: 200,
    },
    {
      title: '第一名',
      dataIndex: '1',
      width: 150,
      render: getName,
    },
    {
      title: '第二名',
      dataIndex: '2',
      width: 150,
      render: getName,
    },
    {
      title: '第三名',
      dataIndex: '3',
      width: 150,
      render: getName,
    },
    {
      title: '第四名',
      dataIndex: '4',
      width: 150,
      render: getName,
    },
    {
      title: '第五名',
      dataIndex: '5',
      width: 150,
      render: getName,
    },
    {
      title: '第六名',
      dataIndex: '6',
      width: 150,
      render: getName,
    },
    {
      title: '第七名',
      dataIndex: '7',
      width: 150,
      render: getName,
    },
    {
      title: '第八名',
      dataIndex: '8',
      width: 150,
      render: getName,
    },
    {
      title: '第九名',
      dataIndex: '9',
      width: 150,
      render: getName,
    },
    {
      title: '第十名',
      dataIndex: '10',
      width: 150,
      render: getName,
    },
  ];

  return (
    <PageContainer
      header={{
        title: '小榜排名',
      }}
    >
      <ProTable<API.UserInfo>
        pagination={false}
        search={false}
        dataSource={dataSource}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
