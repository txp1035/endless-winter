import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import data from './data.json';
import data1 from './基础数据.json';
const a = Object.entries(data1).map(([key, value]) => {
  const values = Object.entries(value).map(([key1, value1], index, arr) => {
    return key1 + '-' + (value1 / arr[0][1]).toFixed(3);
  });
  return values + '     ' + key;
});
console.log(a, 333);

// 动态列，名字，积分排名

const dynamicColumns = Object.keys(data).map((item) => {
  return {
    title: item + '积分',
    dataIndex: item,
    valueType: 'text',
    width: 150,
    render(dom) {
      return (
        <div>
          <Tooltip
            title={
              <div>
                {Object.entries(dom).map(([key, value]) => {
                  return (
                    <div>
                      {key}-{value}
                    </div>
                  );
                })}
              </div>
            }
          >
            <a>详情</a>
          </Tooltip>
          <span style={{ marginLeft: 10 }}>{dom.积分}</span>
        </div>
      );
    },
  };
});

function processFractionData(data, baseNumber) {
  return data
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
      return obj;
    })
    .sort((a, b) => b.分数 - a.分数)
    .map((item, index, arr) => {
      const obj = { ...item };
      const 第一名分数 = arr[0].分数;
      console.log(obj, 2223);
      obj.积分 = Number((obj.分数 / baseNumber).toFixed(2));
      return obj;
    });
}
const objData = {};

Object.entries(data).forEach(([key, value]) => {
  let 基数 = 1;
  if (key.includes('国战')) {
    基数 = 2000 * 3000;
  } else if (key.includes('大作战')) {
    基数 = 1250 * 3000;
  }

  processFractionData(value, 基数).forEach(({ 名字, ...element }) => {
    if (objData[名字]) {
      objData[名字][key] = element;
    } else {
      objData[名字] = {};
      // objData[名字][key] = JSON.stringify(element);
      objData[名字][key] = element;
    }
  });
});
const newData = Object.entries(objData)
  .map(([key, value]) => {
    const 总积分 = Object.values(value).reduce((pre, cur) => {
      return pre + cur.积分;
    }, 0);
    return { 名字: key, ...value, 总积分 };
  })
  .sort((a, b) => b.总积分 - a.总积分);

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
    上限: 15,
    总数: 500,
  },
  堡垒洗练石: {
    上限: 20,
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
  const [dataSource, setDataSource] = useState(newData);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '排名',
      valueType: 'index',
      width: 100,
    },
    {
      title: '名字',
      dataIndex: '名字',
      valueType: 'text',
      width: 100,
    },
    ...dynamicColumns,
    {
      title: '其他积分',
      dataIndex: '其他积分',
      valueType: 'text',
      width: 100,
    },
    {
      title: '总积分',
      dataIndex: '总积分',
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
        dataSource={dataSource}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
