export function dataAdd(id, doc) {
  return {
    type: "DOKTER_DATA_ADD",
    payload: { id, doc }
  };
}
export function dataUpdate(id, doc) {
  return {
    type: "DOKTER_DATA_UPDATE",
    payload: { id, doc }
  };
}
export function dataDelete(id, doc) {
  return {
    type: "DOKTER_DATA_DELETE",
    payload: { id, doc }
  };
}
