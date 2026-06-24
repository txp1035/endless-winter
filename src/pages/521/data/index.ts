import { IS_DEV } from '@/constants';
import 国战20260201 from './20260201国战.json';
import 国战20260301 from './20260301国战.json';
import 国战20260329 from './20260329国战.json';
import 国战20260425 from './20260425国战.json';
import data from './data.json';
import 国战20260524 from './国战20260524.json';
import 国战20260621 from './国战20260621.json';

const obj = IS_DEV
  ? {
      ...data,
      '2026-02-01国战': 国战20260201,
      '2026-03-01国战': 国战20260301,
      '2026-03-29国战': 国战20260329,
      '2026-04-25国战': 国战20260425,
    }
  : {};
console.log(obj);
export default {
  // ...obj,
  '2026-05-24国战': 国战20260524,
  '2026-06-21国战': 国战20260621,
};
