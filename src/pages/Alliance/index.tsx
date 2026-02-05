import data from './data 乔伊数据.json';

export default function index() {
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
      <div>离线：{离线}</div>
      <div>在线：{在线}</div>
      <div>总分：{总分}</div>
    </div>
  );
}
