import { saveInfo } from '@/utils/leancloud';
import { PlusOutlined } from '@ant-design/icons';
import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Form, message } from 'antd';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default ({ actionRef }) => {
  const [form] = Form.useForm<{
    name: string;
    number: number;
    time: number[];
    type: number;
  }>();

  return (
    <DrawerForm<{
      name: string;
      number: number;
      time: number[];
      type: number;
    }>
      title="新建预约"
      initialValues={{
        time: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24,
        ],
      }}
      resize={{
        onResize() {
          console.log('resize!');
        },
        maxWidth: window.innerWidth * 0.8,
        minWidth: 300,
      }}
      form={form}
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建预约
        </Button>
      }
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      submitTimeout={2000}
      onFinish={async (values) => {
        await saveInfo(values);
        message.success('提交成功');
        // 不返回不会关闭弹框
        actionRef?.current?.reload();
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width={220}
          label="游戏名称"
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
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormDigit
          label="材料数量（分钟/个）"
          name="number"
          min={1}
          fieldProps={{ precision: 0 }}
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormSelect
          options={Array.from({ length: 24 }, (_, index) => ({
            value: index + 1,
            label: `${index + 1}点`,
          }))}
          mode="multiple"
          width={220}
          name="time"
          label="预约时间（不方便的时间取消掉）"
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
