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
  const list = await query.descending('createdAt').limit(1000).find();
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
  return 0;
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
    console.log('上传失败,重新上传中');
    throw new Error(error);
  }
};
export const editInfo = async (obj: { id: string }) => {
  return 0;
  const { id, ...rest } = obj;
  const todo = AV.Object.createWithoutData('wjdr', id);
  Object.entries(rest).forEach(([key, value]) => {
    todo.set(key, value);
  });
  await todo.save();
};
