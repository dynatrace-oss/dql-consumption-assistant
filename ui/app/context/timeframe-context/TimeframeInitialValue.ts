import { type QueryTimeFrameType } from '../../interfaces/Interfaces';
import { getTime24HoursAgo } from '../../utils/helpers';

const TF_FROM = 'now()-24h';
const TF_NOW = 'now()';

// setting initial date as 1day
export const initialTimeframeValue: QueryTimeFrameType = {
  from: {
    absoluteDate: getTime24HoursAgo(), // like now()-24h
    type: 'expression',
    value: TF_FROM,
  },
  to: { absoluteDate: new Date().toISOString(), type: 'expression', value: TF_NOW },
};
