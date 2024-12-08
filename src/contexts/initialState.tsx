export type initialStateType = {
  user: {
    name: string;
    email: string;
  };
};

const initialState: initialStateType = {
  user: {
    name: "",
    email: "",
  },
};
export default initialState;
