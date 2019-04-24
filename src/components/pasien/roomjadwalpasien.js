import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import { dataAdd, dataDelete, dataUpdate } from "../../redux/jadwal/action";
import { dataAdd as dokterAdd } from "../../redux/dokter/action";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import InfoIcon from "@material-ui/icons/Info";
import { CreateNewRoom, DeleteRoom } from "./manipulasijadwal";
import { Link } from "react-router-dom";
import Notif from "../view/notif";

import "react-datepicker/dist/react-datepicker.css";

const styles = theme => ({
  containers: {
    display: "flex",
    flexWrap: "wrap"
  },
  appBar: {
    position: "relative"
  },
  flex: {
    flex: 1
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  },
  button: {
    margin: theme.spacing.unit
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2
  },
  textDate: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
  },
  formControl: {
    margin: theme.spacing.unit * 2,
    display: "flex"
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});
class JadwalPasien extends Component {
  constructor(props) {
    super(props);
    this.collectionFCM = db.collection("fcm");
    this.collection = db.collection("jadwal");
    this.collectionUser = db.collection("user");
    this.manipulasiJadwal = React.createRef();
    this.refdeleteRoom = React.createRef();
    this.idpasien = this.props.match.params.id;
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  // async componentWillMount() {
  //   const mdokter = await this.collectionUser
  //     .where("level", "==", "DOKTER")
  //     .get();
  //   mdokter.docs.forEach(it => this.props.dokterAdd(it.id, it.data()));
  // }
  componentDidMount() {
    this.collectionUser
      .where("level", "==", "DOKTER")
      .get()
      .then(snap => snap.docs.map(it => ({ id: it.id, data: it.data() })))
      .then(listDokter => {
        listDokter.forEach(dokter => {
          console.log(dokter);
          this.props.dokterAdd(dokter.id, dokter.data);
        });
      });
    this.collection
      .where("pasien", "==", this.collectionUser.doc(this.idpasien))
      .get()
      .then(snap => snap.docs.map(it => ({ id: it.id, data: it.data() })))
      .then(listJadwal => {
        listJadwal.forEach(jadwal => {
          const dokter = this.props.dokter.data[jadwal.data.dokter.id];
          console.log(dokter);
          this.props.dataAdd(
            jadwal.id,
            jadwal.data,
            jadwal.data.dokter.id,
            dokter
          );
        });
      });
    // this.unregisjadwalDB = this.collection
    //   .where("pasien", "==", this.collectionUser.doc(this.idpasien))
    //   .onSnapshot(snap => {
    //     snap.docChanges().forEach(change => {
    //       if (change.type === "added") {
    //         change.doc
    //           .get("dokter")
    //           .get()
    //           .then(dokterData => {
    //             this.props.dataAdd(
    //               change.doc.id,
    //               change.doc.data(),
    //               dokterData.id,
    //               dokterData.data()
    //             );
    //           });
    //       }
    //       if (change.type === "modified") {
    //         this.props.dataUpdate(change.doc.id, change.doc.data());
    //       }
    //       if (change.type === "removed") {
    //         this.props.dataDelete(change.doc.id, change.doc.data());
    //       }
    //     });
    //   });
  }
  manipulasiEvent = async (
    { type, roomid, subid },
    postRoomJadwal,
    postJadwalInRoom
  ) => {
    try {
      if (type === "Create") {
        const check = await Promise.all([
          postRoomJadwal.pasien.get(),
          postRoomJadwal.dokter.get()
        ]);
        if (check[0].exists || check[1].exists) {
          return Promise.all([
            this.collection.doc(roomid).set(postRoomJadwal),
            this.collection
              .doc(roomid)
              .collection("konsul")
              .doc(subid)
              .set(postJadwalInRoom)
          ]);
        }
        throw new Error("Pasien Or Dokter Not Exists");
      }
    } catch (error) {
      this.setState({ message: { open: true, msg: error.message || error } });
    }
  };
  deleteRoom = async (roomid, dokter) => {
    try {
      return this.collection.doc(roomid).delete();
    } catch (error) {
      this.setState({ message: { open: true, msg: error.message || error } });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <CreateNewRoom
          ref={this.manipulasiJadwal}
          {...this.props}
          event={this.manipulasiEvent}
          datadokter={Object.keys(this.props.dokter.data).map(it => ({
            id: it,
            ...this.props.dokter.data[it]
          }))}
        />
        <DeleteRoom
          ref={this.refdeleteRoom}
          event={this.deleteRoom}
          {...this.props}
        />
        <Notif
          message={this.state.message}
          okclick={() => this.setState({ message: { open: false, msg: "" } })}
        />
        <MaterialTable
          components={{
            Toolbar: props => (
              <div>
                <MTableToolbar {...props} />
                <IconButton
                  className={classes.button}
                  aria-label="Tambah"
                  onClick={() => {
                    const roomid = this.collection.doc().id;
                    const subid = this.collection
                      .doc(roomid)
                      .collection("konsul")
                      .doc().id;
                    this.manipulasiJadwal.current.createNewJadwal(
                      roomid,
                      subid
                    );
                  }}
                >
                  <AddIcon />
                </IconButton>
              </div>
            )
          }}
          columns={[
            { title: "Room", field: "roomid" },
            { title: "Dokter", field: "namadokter" },
            {
              render: rowData => {
                const linkkonsul = `/konsulpasien/${rowData.roomid}`;
                return (
                  <div>
                    <Link to={linkkonsul}>
                      <IconButton
                        className={classes.button}
                        aria-label="Info Jadwal"
                      >
                        <InfoIcon />
                      </IconButton>
                    </Link>
                    <IconButton
                      className={classes.button}
                      aria-label="Delete Jadwal"
                      onClick={() =>
                        this.refdeleteRoom.current.openDialogDelete(
                          rowData.roomid,
                          rowData.namadokter,
                          rowData.iddokter
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              }
            }
          ]}
          data={Object.keys(this.props.jadwal.data).map(key => ({
            id: key,
            ...this.props.jadwal.data[key]
          }))}
          options={{
            columnsButton: true,
            exportButton: true
          }}
          title="Data Jadwal"
        />
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    jadwal: state.jadwal,
    dokter: state.dokter
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dataAdd: (id, doc, iddokter, dokterdoc) => {
      dispatch(dataAdd(id, doc, iddokter, dokterdoc));
    },
    dataUpdate: (id, doc) => {
      dispatch(dataUpdate(id, doc));
    },
    dataDelete: (id, doc) => {
      dispatch(dataDelete(id, doc));
    },
    dokterAdd: (id, doc) => {
      dispatch(dokterAdd(id, doc));
    }
  };
};
const DataComponent = connect(
  mapStateToProp,
  mapDispatchToProps
)(JadwalPasien);
JadwalPasien.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(DataComponent);
