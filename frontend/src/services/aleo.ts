import { PROGRAM_ID } from '../utils/constants';
import { generateSalt, getSplitIdFromMapping, pollTransaction } from '../utils/aleo-utils';

export { generateSalt, getSplitIdFromMapping, pollTransaction };

export const TRANSITIONS = {
  CREATE_SPLIT: 'create_split',
  ISSUE_DEBT: 'issue_debt',
  PAY_DEBT: 'pay_debt',
  SETTLE_SPLIT: 'settle_split',
  VERIFY_SPLIT: 'verify_split',
} as const;

export { PROGRAM_ID };
