import AV from 'leancloud-storage';

AV.init({
  appId: 'Rugr0gIaGJ8MD5rYFb50ldxV-gzGzoHsz',
  appKey: 'd8mo4kKbUipfXgSMNE0c6VBf',
  serverURL: 'https://rugr0gia.lc-cn-n1-shared.com',
});
export const deleteInfo = async (id) => {
  const todo = AV.Object.createWithoutData('wjdr', id);
  await todo.destroy();
};
export const getInfo = async () => {
  const query = new AV.Query('wjdr');
  const list = await query.descending('createdAt').find();
  return list.map((item) => ({
    ...item._serverData,
    id: item.id,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }));
};
let reupload = 0;
export const saveInfo = async (obj: {
  name: string;
  number: number;
  time: number[];
  type: number;
}) => {
  console.log(222, obj);
  const { name, number, time, type } = obj;
  const Miru = AV.Object.extend('wjdr');
  const miru = new Miru();
  miru.set('name', name);
  miru.set('number', number);
  miru.set('time', time);
  miru.set('type', type);
  try {
    await miru.save();
    console.log('上传成功');
  } catch (error) {
    reupload = reupload + 1;
    console.log('上传失败,重新上传中');
    if (reupload < 30) {
      await saveInfo(obj);
    } else {
      throw new Error(error);
    }
  }
};
export const editInfo = async (obj: {
  id: string;
  name: string;
  number: number;
  time: number[];
  type: number;
}) => {
  console.log(123, obj);
  const { name, number, time, type, id } = obj;
  const todo = AV.Object.createWithoutData('wjdr', id);
  todo.set('name', name);
  todo.set('number', number);
  todo.set('time', time);
  todo.set('type', type);
  await todo.save();
};
