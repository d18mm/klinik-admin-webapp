import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import { dataAdd, dataDelete, dataUpdate } from "../../redux/pasien/action";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatIcon from "@material-ui/icons/Chat";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Manipulasi from "./manipulasidata";
import Notif from "../view/notif";
import { Link } from "react-router-dom";
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
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    fontSize: 18
  },
  expandHeading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  }
});
class Data extends Component {
  constructor(props) {
    super(props);
    this.collection = db.collection("user");
    this.manipulasiData = React.createRef();
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  componentDidMount() {
    this.unregisterPasienDB = this.collection
      .where("level", "==", "PASIEN")
      .onSnapshot(snap => {
        snap.docChanges().forEach(change => {
          if (change.type === "added") {
            this.props.dataAdd(change.doc.id, change.doc.data());
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
    this.unregisterPasienDB();
  }
  manipulasiEvent = async (type, id, data) => {
    try {
      if (type === "Add") {
        const checkUser = await this.collection
          .where("email", "==", data.email)
          .limit(1)
          .get();
        if (!checkUser.empty) throw new Error("email sudah terdaftar");
        return this.collection.add(data);
      } else if (type === "Update") {
        const checkUser = await this.collection
          .where("email", "==", data.email)
          .limit(2)
          .get();
        checkUser.forEach(snap => {
          if (snap.id !== id && snap.get("email") === data.email)
            throw new Error("email sudah terdaftar");
        });
        return this.collection.doc(id).update(data);
      } else if (type === "Delete") {
        return this.collection.doc(id).delete();
      }
      throw new Error("event tidak dikenal");
    } catch (error) {
      this.setState({ message: { open: true, msg: error.message || error } });
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Manipulasi
          ref={this.manipulasiData}
          {...this.props}
          event={this.manipulasiEvent}
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
                  onClick={() =>
                    this.manipulasiData.current.addEvent(
                      this.collection.doc().id
                    )
                  }
                >
                  <AddIcon />
                </IconButton>
              </div>
            )
          }}
          columns={[
            { title: "Email", field: "email" },
            { title: "Nama", field: "nama" },
            { title: "Umur", field: "umur" },
            { title: "Alamat", field: "alamat" },
            { title: "Telepon", field: "telepon" },
            {
              render: rowData => {
                const jadwalLink = `jadwalpasien/${rowData.id}`;
                const chatLink = `chatpasien/${rowData.id}`;
                return (
                  <div>
                    <IconButton
                      className={classes.button}
                      aria-label="Update"
                      onClick={() =>
                        this.manipulasiData.current.updateEvent(rowData)
                      }
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      className={classes.button}
                      onClick={() =>
                        this.manipulasiData.current.deleteEvent(rowData)
                      }
                      aria-label="Delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                    <Link to={jadwalLink} target="_blank">
                      <IconButton
                        className={classes.button}
                        aria-label="History"
                      >
                        <DateRangeIcon />
                      </IconButton>
                    </Link>
                    <Link to={chatLink} target="_blank">
                      <IconButton
                        className={classes.button}
                        aria-label="History"
                      >
                        <ChatIcon />
                      </IconButton>
                    </Link>
                  </div>
                );
              }
            }
          ]}
          data={Object.keys(this.props.pasien.data).map(key => ({
            id: key,
            ...this.props.pasien.data[key]
          }))}
          options={{
            columnsButton: true,
            exportButton: true
          }}
          title="Data Pasien"
        />
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    pasien: state.pasien
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dataAdd: (id, doc) => {
      dispatch(dataAdd(id, doc));
    },
    dataUpdate: (id, doc) => {
      dispatch(dataUpdate(id, doc));
    },
    dataDelete: (id, doc) => {
      dispatch(dataDelete(id, doc));
    }
  };
};
const DataComponent = connect(
  mapStateToProp,
  mapDispatchToProps
)(Data);
Data.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DataComponent);
