const userreducer = (
  state = {
    user: null
  },
  action
) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return (state = {
        user: action.payload
      });
    default:
      return state;
  }
};

export default userreducer;
