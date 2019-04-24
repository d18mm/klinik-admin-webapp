const pasienreducer = (
  state = {
    data: {}
  },
  action
) => {
  switch (action.type) {
    case "PASIEN_DATA_ADD":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "PASIEN_DATA_UPDATE":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "PASIEN_DATA_DELETE":
      delete state.data[action.payload.id];
      return { ...state };
    default:
      return state;
  }
};

export default pasienreducer;
