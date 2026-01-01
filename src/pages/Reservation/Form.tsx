import { editInfo, saveInfo } from '@/utils/leancloud';
import {
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Drawer, Form, Modal, message } from 'antd';
import { useState } from 'react';

export default ({ actionRef, type, info }) => {
  const [open, setOpen] = useState(false);
  const [infos, setInfos] = useState('无');
  const [labels, setLabels] = useState('材料数量');
  const text = { edit: '编辑', add: '新建预约' };
  const btnType = { edit: 'link', add: 'primary' };
  const initialValues = {
    edit: info,
    add: {
      time: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ],
    },
  };

  const [form] = Form.useForm<{
    name: string;
    number: number;
    time: number[];
    type: number;
  }>();

  return (
    <>
      <Button onClick={() => setOpen(true)} type={btnType[type]}>
        {text[type]}
      </Button>
      {open && (
        <Drawer width={350} open={open} onClose={() => setOpen(false)}>
          <ProForm<{
            name: string;
            number: number;
            time: number[];
            type: number;
          }>
            title={text[type]}
            initialValues={initialValues[type]}
            form={form}
            autoFocusFirstInput
            onFinish={async (values) => {
              async function submit() {
                try {
                  if (type === 'add') {
                    await saveInfo(values);
                    message.success('提交成功');
                  }
                  if (type === 'edit') {
                    await editInfo({ ...values, id: info.id });
                    message.success('提交成功');
                  }
                  // 不返回不会关闭弹框
                  actionRef?.current?.reload();
                  setOpen(false);
                  return true;
                } catch (error) {
                  console.log(error, 123);
                  Modal.info({
                    title: '提交出错，请重新提交或者截图联系管理员',
                    content: (
                      <div>
                        <div>错误信息：</div>
                        <div>{String(error)}</div>
                      </div>
                    ),
                  });
                  return false;
                }
              }
              if (values.time.length === 24) {
                Modal.confirm({
                  title: '你选择了全天有时间，可能会排到凌晨，是否确认预约？',
                  onOk: () => {
                    submit();
                  },
                  onCancel: () => {},
                });
              } else {
                submit();
              }
            }}
          >
            <ProForm.Group>
              <ProFormText
                name="name"
                width={220}
                label="你的游戏呢称"
                placeholder="请输入名称"
                rules={[{ required: true, message: '这是必填项' }]}
              />
              <ProFormSelect
                options={[
                  {
                    value: 1,
                    label: '副执政（火晶）',
                  },
                  {
                    value: 2,
                    label: '副执政（研究加速）',
                  },
                  {
                    value: 3,
                    label: '教育部长（练兵加速）',
                  },
                ]}
                width={220}
                name="type"
                label="预约类型"
                onChange={(key) => {
                  const s = '材料数量请填写';
                  switch (key) {
                    case 1:
                      setInfos(s + '打算使用的火晶数量');
                      setLabels('材料数量（单位-个）');
                      break;
                    case 2:
                      setInfos(s + '打算研究的天数（包含通用）');
                      setLabels('材料数量（单位-天）');
                      break;
                    case 3:
                      setInfos(s + '打算练兵的天数（包含通用）');
                      setLabels('材料数量（单位-天）');
                      break;
                    default:
                      break;
                  }
                }}
                rules={[{ required: true, message: '这是必填项' }]}
              />
            </ProForm.Group>
            {infos}
            <ProForm.Group>
              <ProFormDigit
                label={labels}
                name="number"
                min={1}
                fieldProps={{ precision: 0 }}
                rules={[{ required: true, message: '这是必填项' }]}
              />
              <ProFormSelect
                options={Array.from({ length: 24 }, (_, index) => ({
                  value: index,
                  label: `${index}点`,
                }))}
                mode="multiple"
                width={220}
                name="time"
                label={
                  <div>
                    <div>预约时间</div>
                    <div style={{ color: 'gray' }}>
                      默认全天时间段，没空的时间点可以点×取消掉
                    </div>
                  </div>
                }
                rules={[{ required: true, message: '这是必填项' }]}
              />
            </ProForm.Group>
          </ProForm>
        </Drawer>
      )}
    </>
  );
};
