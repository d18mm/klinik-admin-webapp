import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import { dataAdd, dataDelete, dataUpdate } from "../../redux/biaya/action";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import CreateIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Manipulasi from "./manipulasidata";
import Notif from "../view/notif";
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
    this.manipulasiData = React.createRef();
    this.collection = db.collection("biaya");
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  componentDidMount() {
    this.unregisterAdminDbListener = this.collection.onSnapshot(snap => {
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
    this.unregisterAdminDbListener();
  }
  manipulasiEvent = async (type, id, data) => {
    try {
      if (type === "Add") {
        return this.collection.doc(id).set(data);
      } else if (type === "Update") {
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
            { title: "Konsultasi", field: "konsultasi" },
            { title: "Biaya (Rp)", field: "biaya" },
            { title: "Keterangan", field: "keterangan" },
            {
              render: rowData => {
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
                  </div>
                );
              }
            }
          ]}
          data={Object.keys(this.props.biaya.data).map(key => ({
            id: key,
            ...this.props.biaya.data[key]
          }))}
          options={{
            columnsButton: true,
            exportButton: true
          }}
          title="Data Biaya"
        />
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    biaya: state.biaya
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
