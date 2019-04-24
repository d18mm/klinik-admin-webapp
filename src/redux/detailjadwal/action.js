import moment from "moment";
import "moment/locale/id";
export function dataAdd(id, doc) {
  const mDate = moment(doc.waktu.toDate())
    .locale("id")
    .format("D MMMM YYYY HH:mm");
  doc.waktu = mDate;
  return {
    type: "DETAIL_JADWAL_DATA_ADD",
    payload: { id, doc }
  };
}
export function dataUpdate(id, doc) {
  const mDate = moment(doc.waktu.toDate())
    .locale("id")
    .format("D MMMM YYYY HH:mm");
  doc.waktu = mDate;
  return {
    type: "DETAIL_JADWAL_DATA_UPDATE",
    payload: { id, doc }
  };
}
export function dataDelete(id, doc) {
  return {
    type: "DETAIL_JADWAL_DATA_DELETE",
    payload: { id, doc }
  };
}
