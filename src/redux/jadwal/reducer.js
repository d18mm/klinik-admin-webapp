const adminreducer = (
  state = {
    data: {}
  },
  action
) => {
  switch (action.type) {
    case "JADWAL_DATA_ADD":
      return (state = {
        data: { ...state.data, [action.payload.roomid]: action.payload }
      });

    case "JADWAL_DATA_UPDATE":
      state.data[action.payload.id] = { ...action.payload.doc };
      return { ...state };
    case "JADWAL_DATA_DELETE":
      delete state.data[action.payload.id];
      return { ...state };
    default:
      return state;
  }
};

export default adminreducer;
