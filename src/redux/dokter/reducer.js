const dokterreducer = (
  state = {
    data: {}
  },
  action
) => {
  switch (action.type) {
    case "DOKTER_DATA_ADD":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "DOKTER_DATA_UPDATE":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "DOKTER_DATA_DELETE":
      delete state.data[action.payload.id];
      return { ...state };
    default:
      return state;
  }
};

export default dokterreducer;
