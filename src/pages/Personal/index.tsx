import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useState } from 'react';
import data from '../../utils/data1.json';

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

const 堡垒数据 = {
  堡垒加速: {
    上限: 10,
    总数: 400,
  },
  堡垒大药: {
    上限: 2,
    总数: 60,
  },
  堡垒茉莉: {
    上限: 10,
    总数: 200,
  },
  堡垒高迁: {
    上限: 4,
    总数: 90,
  },
  堡垒螺丝: {
    上限: 0,
    总数: 500,
  },
  堡垒洗练石: {
    上限: 0,
    总数: 600,
  },
  要塞火晶: {
    上限: 20,
    总数: 600,
  },
  要塞宠物: {
    上限: 3,
    总数: 100,
  },
  要塞老头: {
    上限: 15,
    总数: 420,
  },
  要塞装备: {
    上限: 5,
    总数: 150,
  },
};

const obj = Object.keys(堡垒数据).map((item) => {
  const obj = {
    title: item,
    dataIndex: item,
    valueType: 'text',
    render: (_, item1) => {
      if (item1.奖励档位) {
        const 分配数量 = Math.floor(
          堡垒数据[item].上限 / 2 ** (item1.奖励档位 - 1),
        );
        return 分配数量;
      }
    },
  };
  return obj;
});
console.log(obj);

const TableList: React.FC<unknown> = () => {
  const newData = data.个人积分
    .map((item, index, arr) => {
      const obj = { ...item, 原始分数: item.分数 };
      arr.forEach((item1) => {
        if (item1.分数转移 === obj.名字) {
          obj.分数 = obj.分数 + item1.分数;
        }
      });
      if (item.分数转移) {
        obj.分数 = 0;
      }
      obj.国战总分占比 = ((obj.分数 / data.国战总分) * 100).toFixed(2);
      obj.胜利总分占比 = ((obj.分数 / data.国战胜利方总分) * 100).toFixed(2);

      return obj;
    })

    .sort((a, b) => b.分数 - a.分数)
    .map((item, index, arr) => {
      const obj = { ...item };
      const 第一名分数占比 = (
        (arr[0].分数 / data.国战胜利方总分) *
        100
      ).toFixed(2);
      const 最后一名分数占比 = (
        (arr[99].分数 / data.国战胜利方总分) *
        100
      ).toFixed(2);
      console.log(arr[99]);
      const 档位阶段 = (第一名分数占比 - 最后一名分数占比) / 3;
      const 一档 = 第一名分数占比 - 档位阶段;
      const 二档 = 第一名分数占比 - 2 * 档位阶段;
      const 三档 = 第一名分数占比 - 3 * 档位阶段;
      if (obj.胜利总分占比 >= 一档) {
        obj.奖励档位 = 1;
      } else if (obj.胜利总分占比 >= 二档 && obj.胜利总分占比 < 一档) {
        obj.奖励档位 = 2;
      } else if (obj.胜利总分占比 >= 三档) {
        obj.奖励档位 = 3;
      }
      return obj;
    });
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
        avn: { text: 'avn' },
        kkk: { text: 'kkk' },
        no2: { text: '996' },
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
      title: '国战总分占比',
      dataIndex: '国战总分占比',
      valueType: 'text',
    },
    {
      title: '胜利总分占比',
      dataIndex: '胜利总分占比',
      valueType: 'text',
    },
    {
      title: '奖励档位',
      dataIndex: '奖励档位',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        1: { text: '1' },
        2: { text: '2' },
        3: { text: '3' },
      },
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
