import Queue from 'bull';


export interface Context {
  isUserLogged?: boolean;
  email?: string;
  _id?: string;
  queue: typeof Queue;
}
