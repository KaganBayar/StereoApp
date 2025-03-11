export type initialStateType = {
  user: {
    photo: string;
    name: string;
    email: string;
  };
};

const initialState: initialStateType = {
  user: {
    photo: "",
    name: "",
    email: "",
  },
};
export default initialState;
