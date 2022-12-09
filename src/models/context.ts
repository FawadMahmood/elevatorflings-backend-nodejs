import Queue from 'bull';
import { UserType } from '../utils/types';


export interface Context {
  isUserLogged?: boolean;
  email?: string;
  _id?: string;
  queue: {
    add: (props: { _id: string, new: boolean }) => void;
  };
  update: {
    add: (props: { _id: string, key: string, value: any }) => void;
  };
  userInfo?:UserType
}
