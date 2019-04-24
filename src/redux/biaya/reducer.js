const biayareducer = (
  state = {
    data: {}
  },
  action
) => {
  switch (action.type) {
    case "BIAYA_DATA_ADD":
      return (state = {
        data: { ...state.data, [action.payload.id]: action.payload.doc }
      });

    case "BIAYA_DATA_UPDATE":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "BIAYA_DATA_DELETE":
      delete state.data[action.payload.id];
      return { ...state };
    default:
      return state;
  }
};

export default biayareducer;
