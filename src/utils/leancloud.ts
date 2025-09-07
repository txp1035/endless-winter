import AV from 'leancloud-storage';

AV.init({
  appId: 'Rugr0gIaGJ8MD5rYFb50ldxV-gzGzoHsz',
  appKey: 'd8mo4kKbUipfXgSMNE0c6VBf',
  serverURL: 'https://rugr0gia.lc-cn-n1-shared.com',
});
export const getInfo = async () => {
  const query = new AV.Query('wjdr');
  const list = await query.descending('createdAt').find();
  return list.map((item) => item._serverData);
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
