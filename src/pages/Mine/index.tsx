import { editSetting, getSetting } from '@/utils/getData';
import { useRequest } from '@umijs/max';
import { Switch } from 'antd';
import { Link } from 'umi';
import data from './data 乔伊数据.json';

export default function index() {
  const {
    data: 控制预约,
    error,
    loading,
  } = useRequest(async () => {
    const 控制预约 = await getSetting();
    return { data: 控制预约[0].value };
  });
  console.log(data);
  let 离线 = 0;
  let 在线 = 0;
  Object.entries(data['1级']).map(([key, value]) => {
    if (!['20', '17', '14', '10', '7', '升级'].includes(key)) {
      离线 = 离线 + value;
    }
    if (!['20', '10', '升级'].includes(key)) {
      在线 = 在线 + value;
    }
  });
  const 总分 =
    6 * 在线 * 1.5 +
    10 * 离线 * 1.5 +
    (data['1级'][20] + data['1级'][10]) * 1.5;
  return (
    <div>
      <Switch
        value={控制预约}
        onChange={(value) => {
          editSetting({ id: 'd2d61b02fa', value: value, memo: '控制预约' });
        }}
      />
      <Link to="/list">小榜排名</Link>
      <div>离线：{离线}</div>
      <div>在线：{在线}</div>
      <div>总分：{总分}</div>
    </div>
  );
}
