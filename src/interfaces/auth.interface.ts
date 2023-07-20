interface ILogin {
  accessToken: string;
}
interface IRegister {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  created: number;
  updated: number;
}

export { ILogin, IRegister };
