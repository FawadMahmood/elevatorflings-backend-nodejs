import Queue from 'bull';


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
}
