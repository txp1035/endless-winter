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

export default () => {
  const [form] = Form.useForm<{ name: string; company: string }>();

  return (
    <DrawerForm<{
      name: string;
      company: string;
    }>
      title="新建表单"
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
        await waitTime(2000);
        console.log(values.name);
        message.success('提交成功');
        // 不返回不会关闭弹框
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          name="name"
          width={220}
          label="游戏名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
        />
        <ProFormSelect
          options={[
            {
              value: '1',
              label: '副执政（火晶）',
            },
            {
              value: '2',
              label: '副执政（研究加速）',
            },
            {
              value: '3',
              label: '教育部长（练兵加速）',
            },
          ]}
          width={220}
          name="useMode"
          label="预约类型"
        />
        <ProFormDigit
          label="材料数量（分钟/个）"
          name="input-number"
          min={1}
          fieldProps={{ precision: 0 }}
        />
        <ProFormSelect
          options={Array.from({ length: 24 }, (_, index) => ({
            value: index + 1,
            label: `${index + 1}点`,
          }))}
          mode="multiple"
          width={220}
          name="useMode"
          label="预约时间"
        />
      </ProForm.Group>
    </DrawerForm>
  );
};
