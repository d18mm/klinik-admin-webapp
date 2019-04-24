import React, { Component } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import { dataAdd, dataDelete, dataUpdate } from "../../redux/jadwal/action";
import { dataAdd as pasienAdd } from "../../redux/pasien/action";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
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
    this.iddokter = this.props.match.params.id;
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  async componentWillMount() {
    const mpasien = await this.collectionUser
      .where("level", "==", "PASIEN")
      .get();
    mpasien.docs.forEach(it => this.props.pasienAdd(it.id, it.data()));
  }
  componentDidMount() {
    this.unregisjadwalDB = this.collection
      .where("dokter", "==", this.collectionUser.doc(this.iddokter))
      .onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added") {
            change.doc
              .get("pasien")
              .get()
              .then(dokterData => {
                this.props.dataAdd(
                  change.doc.id,
                  change.doc.data(),
                  dokterData.id,
                  dokterData.data()
                );
              });
          }
          if (change.type === "modified") {
            this.props.dataUpdate(change.doc.id, change.doc.data());
          }
          if (change.type === "removed") {
            this.props.dataDelete(change.doc.id, change.doc.data());
          }
        });
      });
  }
  componentWillUnmount() {
    this.unregisjadwalDB();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Notif
          message={this.state.message}
          okclick={() => this.setState({ message: { open: false, msg: "" } })}
        />
        <MaterialTable
          columns={[
            { title: "Room", field: "roomid" },
            { title: "Pasien", field: "namauser" },
            {
              render: rowData => {
                const linkkonsul = `/konsuldokter/${rowData.roomid}`;
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
    pasienAdd: (id, doc) => {
      dispatch(pasienAdd(id, doc));
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
