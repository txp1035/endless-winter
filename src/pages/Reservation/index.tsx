import { deleteInfo, getInfo } from '@/utils/leancloud';
import type { ActionType } from '@ant-design/pro-components';
import {
  PageContainer,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useRef } from 'react';
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

const TableList: React.FC<unknown> = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.UserInfo>[] = [
    {
      title: '数量',
      valueType: 'index',
    },
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
  ];

  return (
    <PageContainer
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
                console.log(res);
                const data = res.sort((a, b) => b.number - a.number);
                const newData = calculateTime(
                  data.filter((item) => item.type === 1),
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
              生成建筑预约时间
            </Button>
          ),
        ]}
        request={async (params, sort, filter) => {
          const res = await getInfo();
          console.log(res);
          const data = res.sort((a, b) => b.number - a.number);
          const newData = calculateTime(
            data.filter((item) => item.type === 1),
          ).sort((a, b) => b.actualTime - a.actualTime);
          return { data: data };
        }}
        columns={columns}
        {...common(columns)}
      />
    </PageContainer>
  );
};

export default TableList;
