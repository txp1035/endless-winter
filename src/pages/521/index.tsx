import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Tooltip } from 'antd';
import React, { useState } from 'react';
import data from './data.json';
import ListDetails from './榜单积分详情.json';

const 国战榜单积分详情 = ListDetails[0].最强王国;
const 各榜单转换比例 = Object.fromEntries(
  Object.entries(ListDetails[1]).map(([key, value]) => {
    let 总比例分 = 0;
    const newValue = Object.entries(value)
      .filter(([key1, _]) => {
        if (key1 in 国战榜单积分详情) {
          return true;
        }
        return false;
      })
      .map(([key1, value1]) => {
        // 返回的比例是国战比其他，要转换比例就是其他乘以这个转换比例
        const 比例分 = Number((国战榜单积分详情[key1] / value1).toFixed(2));
        总比例分 = 总比例分 + 比例分;
        return [key1, 比例分];
      });
    const 平均比例分 = Number((总比例分 / newValue.length).toFixed(2));
    return [key, { 详情: newValue, 平均比例分 }];
  }),
);

// 动态列，名字，积分排名

const dynamicColumns = Object.keys(data)
  .filter((item) => {
    if (item.includes('国战') || item.includes('大作战')) {
      return true;
    }
    return false;
  })
  .map((item) => {
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
            <span style={{ marginLeft: 10 }}>
              {/* {dom.组织 ? dom.组织 + ' ' : ''} */}
              {dom.积分 || ''}
            </span>
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
          obj.分数来自 =
            (obj.分数来自 || '') + ' ' + item1.名字 + '-' + item1.分数;
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
      obj.分数 = obj.分数 || 0;
      obj.转换分数 = 0;
      if (key.includes('国战')) {
        obj.转换分数 = obj.分数;
      }
      const list = Object.keys(ListDetails[1]);
      for (let index = 0; index < list.length; index++) {
        const element = list[index];

        if (key.includes(element)) {
          obj.转换分数 = Number(
            (obj.分数 * 各榜单转换比例[element].平均比例分).toFixed(2),
          );
          break;
        }
      }
      obj.积分 = Number((obj.转换分数 / 基数).toFixed(2));
      return obj;
    });
}
const objData = {};
Object.entries(data).forEach(([key, value]) => {
  const newData = processFractionData(value, key);
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
    const 总积分 = Object.entries(value)
      .filter((item) => {
        if (item[0].includes('国战') || item[0].includes('大作战')) {
          return true;
        }
        return false;
      })
      .reduce((pre, cur) => {
        return Number((pre + cur[1].积分).toFixed(2));
      }, 0);
    const 小榜积分 = Object.entries(value)
      .filter((item) => {
        if (item[0].includes('国战') || item[0].includes('大作战')) {
          return false;
        }
        return true;
      })
      .reduce((pre, cur) => {
        return Number((pre + cur[1].积分).toFixed(2));
      }, 0);
    const 综合积分 = Number((总积分 - 小榜积分).toFixed(2));
    const item = { 名字: key, ...value, 总积分, 小榜积分, 综合积分 };
    const obj = { ...item };
    return obj;
  })
  .sort((a, b) => b.总积分 - a.总积分)
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

const TableList: React.FC<unknown> = () => {
  const [dataSource, setDataSource] = useState(newData);
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '排名',
      valueType: 'index',
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
      width: 50,
    },
    {
      title: '小榜积分',
      dataIndex: '小榜积分',
      valueType: 'text',
      width: 100,
      render(dom, entity) {
        const list = Object.entries(entity).filter(([key, _]) => {
          if (
            ['名字', '小榜积分', '总积分', '综合积分', '档位'].includes(key)
          ) {
            return false;
          }
          if (key.includes('国战') || key.includes('大作战')) {
            return false;
          }
          return true;
        });
        return (
          <div>
            <Tooltip
              title={
                <div>
                  {list.map(([key, value]) => {
                    return (
                      <div>
                        <Tooltip
                          title={
                            <div>
                              {Object.entries(value).map(([key, value]) => {
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
                        <span style={{ marginLeft: 10 }}>{key}</span>
                      </div>
                    );
                  })}
                </div>
              }
            >
              <a>详情</a>
            </Tooltip>
            <span style={{ marginLeft: 10 }}>{dom}</span>
          </div>
        );
      },
    },
    {
      title: '综合积分',
      dataIndex: '综合积分',
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
            {(() => {
              const 小榜 = [];
              for (let index = 1; index < dataSource.length; index++) {
                if (index > 40) {
                  break;
                }
                const element = dataSource[index];
              }

              return <div>123</div>;
            })()}
          </>
        )}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              const obj = {};
              console.log(newData);
              // newData.forEach((element) => {
              //   const 最新的关键字 = '12月08日国战';
              //   element[最新的关键字];
              //   console.log(element);
              // });
            }}
          >
            按组织查看
          </Button>,
        ]}
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
