import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import React, { useState } from 'react';
import data from './data.json';
import baseData from './基础数据.json';
const 大作战与国战 = Object.entries(baseData)
  .filter((item) => item[1].大作战 !== 0)
  .reduce((pre, cur) => {
    const obj = {};
    Object.entries(pre[1]).forEach(([key, value]) => {
      obj[key] = value + cur[1][key];
    });
    return ['汇总', obj];
  })[1];
const 大作战与国战比例 = 大作战与国战.大作战 / 大作战与国战.国战;
const 总动员与国战 = Object.entries(baseData)
  .filter((item) => item[1].总动员 !== 0)
  .reduce((pre, cur) => {
    const obj = {};
    Object.entries(pre[1]).forEach(([key, value]) => {
      obj[key] = value + cur[1][key];
    });
    return ['汇总', obj];
  })[1];
const 总动员与国战比例 = 总动员与国战.总动员 / 总动员与国战.国战;

// (([key, value]) => {
//   const values = Object.entries(value).map(([key1, value1], index, arr) => {
//     return key1 + '-' + (value1 / arr[0][1]).toFixed(3);
//   });
//   return values + '     ' + key;
// });

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
                      {key}：{value}
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

function processFractionData(data, key) {
  return data
    .map((item, index, arr) => {
      const obj = { ...item, 原始分数: item.分数 };
      arr.forEach((item1) => {
        if (item1.分数转移 === obj.名字) {
          obj.分数 = obj.分数 + item1.分数;
          obj.分数来自 = (obj.分数来自 || '') + ' ' + item1.名字;
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
      let 基数 = 6000000;

      if (key.includes('国战')) {
        obj.转换分数 = Number((obj.分数 / 1).toFixed(2));
      } else if (key.includes('大作战')) {
        obj.转换分数 = Number((obj.分数 / 大作战与国战比例).toFixed(2));
      } else if (key.includes('总动员')) {
        obj.转换分数 = Number((obj.分数 / 总动员与国战比例).toFixed(2));
      }
      obj.积分 = Number((obj.转换分数 / 基数).toFixed(2));
      return obj;
    });
}
const objData = {};
console.log(objData, 222);
Object.entries(data).forEach(([key, value]) => {
  const newData = processFractionData(value, key);
  console.log(newData, 123, key);
  newData.forEach(({ 名字, ...element }) => {
    if (objData[名字]) {
      objData[名字][key] = element;
    } else {
      objData[名字] = {};
      objData[名字][key] = element;
    }
  });
});
const number = { 一档: 0, 二档: 0, 三档: 0, 四档: 0 };
const newData = Object.entries(objData)
  .map(([key, value]) => {
    const 总积分 = Object.values(value).reduce((pre, cur) => {
      return Number((pre + cur.积分).toFixed(2));
    }, 0);
    const item = { 名字: key, ...value, 总积分 };
    const obj = { ...item };
    if (item['11月10日国战']) {
      obj.状态 = item['11月10日国战'].联盟;
    }
    if (item['10月17日大作战']) {
      obj.状态 = '521';
    }
    const 小号组 = [
      '五大大',
      '尢北风',
      '猫鱼二号',
      '如影随形',
      '007',
      '冬天任务号',
      '锤锤的锤',
      '日落黄昏',
      '迪迪小号',
      '倒吊人',
      '太阳丶',
      '世界丶',
    ];
    const 二盟 = [
      '喵喵兔不乖',
      '六眼飞鱼',
      '荒天帝',
      '晓雪满空山',
      '情感释怀',
      'Rainy night',
      '多喝热水',
      '十号',
      '呜呼哀哉',
      'GG Bond',
      '请茶馆',
      '你泡泡姐',
      '八月老番薯',
      'yyl',
      '来根大青山',
      '小鱼小虾',
    ];
    if (二盟.includes(obj.名字)) {
      obj.状态 = 'KKK';
    }
    if (小号组.includes(obj.名字)) {
      obj.状态 = '小号';
    }
    const 退游组 = ['沈丿清风', '我的城堡', '毛毛有点胖'];
    if (退游组.includes(obj.名字)) {
      obj.状态 = '退游';
    }
    const 退盟组 = [
      '毛毛咬我了',
      '子不语',
      '呙哈哈',
      'études op10',
      'leonardo',
    ];
    if (退盟组.includes(obj.名字)) {
      obj.状态 = '退盟';
    }
    return obj;
  })
  .sort((a, b) => b.总积分 - a.总积分)
  .filter((item) => !['退游', '退盟', 'QQQ', 'AVN'].includes(item.状态))
  .map((item, index, arr) => {
    const obj = { ...item };
    const 第一名积分 = arr[0].总积分;
    // const 一档 = 第一名分数占比 - 2 * 档位阶段;
    // const 二档 = 第一名分数占比 - 4 * 档位阶段;
    // const 三档 = 最后一名分数占比;
    const 一档 = 第一名积分 / 2;
    const 二档 = 第一名积分 / 4;
    const 三档 = 第一名积分 / 8;
    const 四档 = 第一名积分 / 16;
    if (obj.总积分 >= 一档) {
      obj.档位 = 1;
      number.一档 = number.一档 + 1;
    } else if (obj.总积分 >= 二档 && obj.总积分 < 一档) {
      obj.档位 = 2;
      number.二档 = number.二档 + 1;
    } else if (obj.总积分 >= 三档 && obj.总积分 < 二档) {
      obj.档位 = 3;
      number.三档 = number.三档 + 1;
    } else if (obj.总积分 >= 四档 && obj.总积分 < 三档) {
      obj.档位 = 4;
      number.四档 = number.四档 + 1;
    }
    return obj;
  });

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
      width: 50,
    },
    {
      title: '状态',
      dataIndex: '状态',
      valueType: 'text',
      width: 50,
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
      width: 100,
    },
    {
      title: '档位',
      dataIndex: '档位',
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
        title={() => (
          <>
            <h3>详情名词解释</h3>
            <div>
              分数：活动中该账号的实际分数+活动中其他账号（小号或者朋友号）的的实际分数
            </div>
            <div>排名：活动中的实际排名</div>
            <div>原始分数：活动中该账号的实际分数</div>
            <div>
              转换分数：不同活动消耗材料得到的分数不同，这个分数保证每个活动消耗同样的材料得到一样的分数
            </div>
            <div>积分：转换分数/6000000，数字小方便看</div>
            <h3>档位数据</h3>
            <div>
              <span>一档: {number.一档} </span>
              <span>二档: {number.二档} </span>
              <span>三档: {number.三档} </span>
              <span>四档: {number.四档} </span>
              <span>
                总数: {number.一档 + number.二档 + number.三档 + number.四档}{' '}
              </span>
            </div>
          </>
        )}
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
