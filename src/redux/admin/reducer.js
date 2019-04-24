const adminreducer = (
  state = {
    data: {}
  },
  action
) => {
  switch (action.type) {
    case "ADMIN_DATA_ADD":
      return (state = {
        data: { ...state.data, [action.payload.id]: action.payload.doc }
      });

    case "ADMIN_DATA_UPDATE":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "ADMIN_DATA_DELETE":
      delete state.data[action.payload.id];
      return { ...state };
    default:
      return state;
  }
};

export default adminreducer;
