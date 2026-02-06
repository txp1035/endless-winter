import { IS_DEV } from '@/constants';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Tooltip } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import data from './data';
import ListDetails from './榜单积分详情.json';
import nameList from './游戏名数据.json';

const 小榜名次对应的奖励 = {
  小榜: {
    1: 50000,
    2: 30000,
    3: 18000,
    4: 10000,
    5: 10000,
    6: 6500,
    7: 6500,
    8: 6500,
    9: 6500,
    10: 6500,
  },
  冻土和野兽: {
    1: 20000,
    2: 12000,
    3: 7500,
    4: 4500,
    5: 4500,
    6: 2500,
    7: 2500,
    8: 2500,
    9: 2500,
    10: 2500,
  },
  领主总: {
    1: 40000,
    2: 24000,
    3: 14000,
    4: 14000,
    5: 9000,
    6: 9000,
    7: 9000,
    8: 9000,
    9: 9000,
    10: 9000,
  },
  领主阶段: {
    1: 14000,
    2: 8500,
    3: 5000,
    4: 2500,
    5: 2500,
    6: 2500,
    7: 2500,
    8: 2500,
    9: 2500,
    10: 2500,
  },
};
const 名字映射 = {};
const 名字id映射 = {};
nameList.forEach((element) => {
  名字id映射[element.名字[0]] = element.id;
  element.名字.forEach((item) => {
    名字映射[item] = element.名字[0];
  });
});

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
  const 分数转移数据 = [];
  const 持有分数数据 = [];
  JSON.parse(JSON.stringify(data)).forEach((element) => {
    const obj = {
      ...element,
      原始分数: element.分数,
      名字: 名字映射[element.名字] || element.名字,
    };

    if (obj.分数转移 === obj.名字) {
      console.log('错误', obj);
    }
    if (obj.分数转移) {
      obj.分数转移 = 名字映射[element.分数转移] || obj.分数转移;
      分数转移数据.push(obj);
    } else {
      持有分数数据.push(obj);
    }
  });
  分数转移数据.forEach((element) => {
    const 持有分数人 = 持有分数数据.find(
      (item) => item.名字 === element.分数转移,
    );
    if (持有分数人) {
      持有分数人.分数 = 持有分数人.分数 + element.分数;
      持有分数人.分数来自 =
        (持有分数人.分数来自 || '') + ' ' + element.名字 + '-' + element.分数;
      element.分数 = 0;
    } else {
      持有分数数据.push({
        名字: element.分数转移,
        分数: element.分数,
        分数来自: element.名字 + '-' + element.分数,
        原始分数: 0,
        总排名: '无',
      });
      element.分数 = 0;
    }
  });
  return [...分数转移数据, ...持有分数数据]
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
          if (key.includes('领主总')) {
            obj.名次分数 =
              (obj.转换分数 * 小榜名次对应的奖励.领主总[Number(obj.排名)]) /
              小榜名次对应的奖励.领主总[1];
          } else if (key.includes('领主')) {
            obj.名次分数 =
              (obj.转换分数 * 小榜名次对应的奖励.领主阶段[Number(obj.排名)]) /
              小榜名次对应的奖励.领主阶段[1];
          } else if (['野兽', '冻土'].includes(element)) {
            obj.名次分数 =
              (obj.转换分数 * 小榜名次对应的奖励.冻土和野兽[Number(obj.排名)]) /
              小榜名次对应的奖励.冻土和野兽[1];
          } else if (key.includes('军备') || key.includes('士官')) {
            obj.名次分数 =
              (obj.转换分数 * 小榜名次对应的奖励.小榜[Number(obj.排名)]) /
              小榜名次对应的奖励.小榜[1];
          }
          break;
        }
      }
      if (obj.名次分数) {
        obj.积分 = Number((obj.名次分数 / 基数).toFixed(2));
      } else {
        obj.积分 = Number((obj.转换分数 / 基数).toFixed(2));
      }

      return obj;
    });
}
/**
 * 源数据处理，一个数据为一列数据
 * 以名字分类每个榜单对应数据对应到名字里
 * 分数处理：各榜单分数转换计算，分数转移计算
 */
const objData = {};
Object.entries(data).forEach(([key, value]) => {
  const newData = processFractionData(value, key);
  newData.forEach(({ 名字, ...element }) => {
    const 新名字 = 名字映射[名字] || 名字;
    if (objData[新名字]) {
      objData[新名字][key] = element;
    } else {
      objData[新名字] = {};
      objData[新名字][key] = element;
    }
  });
});
const number = { 一档: 0, 二档: 0, 三档: 0, 四档: 0 };

const newData = Object.entries(objData)
  .map(([key, value]) => {
    const 总积分 = Object.entries(value)
      .filter((item) => {
        if (item[0].includes('国战') || item[0].includes('大作战')) {
          const newStr = item[0].replace('国战', '').replace('大作战', '');

          if (+dayjs(newStr) >= +dayjs('20260201')) {
            return true;
          }
          return false;
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
      render(dom, entity) {
        if (名字id映射[dom]) {
          return <u>{dom}</u>;
        }
        return <div style={{ color: 'red' }}>{dom}</div>;
      },
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
      title: '小榜积分',
      hideInTable: !IS_DEV,
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
      hideInTable: !IS_DEV,
      dataIndex: '综合积分',
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
            {(() => {
              const 小榜 = [];
              for (let index = 1; index < dataSource.length; index++) {
                if (index > 40) {
                  break;
                }
                const element = dataSource[index];
              }
              return <div></div>;
            })()}
          </>
        )}
        toolBarRender={() => {
          return [
            IS_DEV && (
              <Button
                type="primary"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(dataSource)).sort(
                    (a, b) => b.总积分 - a.总积分,
                  );
                  setDataSource(data);
                }}
              >
                按总积分排序
              </Button>
            ),
            IS_DEV && (
              <Button
                type="primary"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(dataSource)).sort(
                    (a, b) => b.小榜积分 - a.小榜积分,
                  );
                  setDataSource(data);
                }}
              >
                按小榜积分排序
              </Button>
            ),
            IS_DEV && (
              <Button
                type="primary"
                onClick={() => {
                  const data = JSON.parse(JSON.stringify(dataSource)).sort(
                    (a, b) => b.综合积分 - a.综合积分,
                  );
                  setDataSource(data);
                }}
              >
                按综合积分排序
              </Button>
            ),
          ];
        }}
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
