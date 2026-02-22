// 打开 main.js
import Bmob from 'hydrogen-js-sdk';
//初始化
Bmob.initialize('f603562d333eb7e1', '1234567891234567');

export const deleteInfo = async (id) => {
  const todo = AV.Object.createWithoutData('wjdr', id);
  await todo.destroy();
};
export const getInfo = async () => {
  const query = Bmob.Query('wjdr');
  const list = await query.find();
  return [...list];
};
export const saveInfo = async (obj: {
  name: string;
  number: number;
  time: number[];
  type: number;
}) => {
  const { name, number, time, type } = obj;
  const query = Bmob.Query('wjdr');
  query.set('name', name);
  query.set('number', number);
  query.set('time', time);
  query.set('type', type);
  try {
    await query.save();
    console.log('上传成功');
  } catch (error) {
    console.log('上传失败,重新上传中');
    throw new Error(error);
  }
};
export const editInfo = async (obj: { id: string }) => {
  const { id, ...rest } = obj;
  const todo = AV.Object.createWithoutData('wjdr', id);
  Object.entries(rest).forEach(([key, value]) => {
    todo.set(key, value);
  });
  await todo.save();
};
