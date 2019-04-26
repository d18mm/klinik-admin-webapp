export function dataAdd(id, doc) {
  // doc.waktu = moment.unix(doc.waktu).format("D MMMM YYYY HH:mm");
  // const mDate = moment(doc.waktu.toDate())
  //   .locale("id")
  //   .format("D MMMM YYYY HH:mm");
  // doc.waktu = mDate;
  return {
    type: "DETAIL_JADWAL_DATA_ADD",
    payload: { id, doc }
  };
}
export function dataUpdate(id, doc) {
  // doc.waktu = moment.unix(doc.waktu).format("D MMMM YYYY HH:mm");
  // const mDate = moment(doc.waktu.toDate())
  //   .locale("id")
  //   .format("D MMMM YYYY HH:mm");
  //doc.waktu = mDate;
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
