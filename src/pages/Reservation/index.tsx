import { editInfo, getInfo } from '@/utils/leancloud';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import Form from './Form';

const isDev = false;

function calculateTime(list) {
  const timeList = [];
  const newList = list.map((item) => {
    const obj = { ...item, actualTime: -1 };
    for (let index = 0; index < item.time.length; index++) {
      const element = item.time[index];
      const newList = timeList.filter((item) => item === element);
      if (newList.length < 2) {
        timeList.push(element);
        obj.actualTime = element;
        break;
      }
    }

    return obj;
  });
  return newList;
}

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

function getIsEdit(tabList) {
  const 备战时间 = '20251006';
  const 当前时间 = +new Date();
  let isEdit = false;
  switch (tabList) {
    case '1':
      const 研究加速填写截止时间 =
        dayjs(备战时间).subtract(1, 'day').format('YYYYMMDD') + '20';
      if (+dayjs(研究加速填写截止时间) > 当前时间) {
        isEdit = true;
      }
      break;
    case '2':
      const 建筑加速填写截止时间 =
        dayjs(备战时间).add(3, 'day').format('YYYYMMDD') + '20';
      if (+dayjs(建筑加速填写截止时间) > 当前时间) {
        isEdit = true;
      }
      break;
    case '3':
      const 练兵加速填写截止时间 =
        dayjs(备战时间).add(2, 'day').format('YYYYMMDD') + '20';
      if (+dayjs(练兵加速填写截止时间) > 当前时间) {
        isEdit = true;
      }
      break;
    default:
      break;
  }
  return isEdit;
}

const TableList: React.FC<unknown> = () => {
  const [tabList, setTabList] = useState('1');
  const isEdit = getIsEdit(tabList);
  const actionRef = useRef<ActionType>();
  const option = isEdit
    ? [
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
      ]
    : [];
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '顺序',
      valueType: 'index',
      width: 60,
    },
    ...option,
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
        1: { text: '副执政-火晶（周一）' },
        2: { text: '副执政-研究加速（周五）' },
        3: { text: '教育部长-练兵加速（周四）' },
      },
    },
    {
      title: '材料数量',
      width: 200,
      dataIndex: 'number',
    },
    {
      title: '实际时间',
      width: 100,
      dataIndex: 'actualTime',
      render: (_, record) => {
        return record.actualTime === -1 ? '没有匹配' : record.actualTime;
      },
    },
    {
      title: '预约时间',
      dataIndex: 'time',
      render: (_, record) => {
        return String(record.time);
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 120,
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      width: 120,
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer
      tabList={[
        { tab: '建筑加速（周一）', key: '1' },
        { tab: '练兵加速（周四）', key: '3' },
        { tab: '研究加速（周五）', key: '2' },
      ]}
      tabActiveKey={tabList}
      tabProps={{
        onChange: (value) => {
          setTabList(value);
          actionRef.current?.reload();
        },
      }}
      header={{
        title: '官职预约',
      }}
    >
      <ProTable<API.UserInfo>
        actionRef={actionRef}
        pagination={false}
        search={false}
        toolBarRender={() => [
          <Form type="add" actionRef={actionRef} />,
          isDev && (
            <Button
              type="primary"
              onClick={async () => {
                const res = await getInfo();
                const data = res.sort((a, b) => b.number - a.number);
                const newData = calculateTime(
                  data.filter((item) => item.type === Number(tabList)),
                );
                for (let index = 0; index < newData.length; index++) {
                  const element = newData[index];
                  await editInfo({
                    id: element.id,
                    actualTime: element.actualTime,
                  });
                }
                Modal.info({ title: '更新成功' });
              }}
            >
              生成预约时间
            </Button>
          ),
        ]}
        request={async (params, sort, filter) => {
          const res = await getInfo();
          const data = res.sort((a, b) => b.number - a.number);
          const newData = calculateTime(
            data.filter((item) => item.type === Number(tabList)),
          ).sort((a, b) => a.actualTime - b.actualTime);
          return { data: newData };
        }}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
