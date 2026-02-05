import { IS_DEV } from '@/constants';
import 国战20260201 from './20260201国战.json';
import data from './data.json';

const obj = IS_DEV ? { ...data } : {};
export default {
  ...obj,
  '2026-02-01国战': 国战20260201,
};
