export function dataAdd(id, doc, iddokter, dokterdoc) {
  const jadwal = {
    roomid: id,
    ...doc,
    iddokter,
    namadokter: dokterdoc.nama
  };
  return {
    type: "JADWAL_DATA_ADD",
    payload: jadwal
  };
}
export function dataUpdate(id, doc) {
  return {
    type: "JADWAL_DATA_UPDATE",
    payload: { id, doc }
  };
}
export function dataDelete(id, doc) {
  return {
    type: "JADWAL_DATA_DELETE",
    payload: { id, doc }
  };
}
