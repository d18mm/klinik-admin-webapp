import React, { Component } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import {
  dataAdd,
  dataDelete,
  dataUpdate
} from "../../redux/detailjadwal/action";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { CreateNewKonsul } from "./manipulasijadwal";
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
    this.collection = db.collection(
      `jadwal/${this.props.match.params.id}/konsul`
    );
    this.manipulasiData = React.createRef();
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  componentDidMount() {
    this.unregisterAdminDbListener = this.collection
      .orderBy("waktu", "desc")
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
  createNewKonsul = (type, subid, data) => {
    if (type === "Add") return this.collection.doc(subid).set(data);
    else if (type === "Delete") return this.collection.doc(subid).delete();
  };
  componentWillUnmount() {
    this.unregisterAdminDbListener();
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <CreateNewKonsul
          ref={this.manipulasiData}
          event={this.createNewKonsul}
          {...this.props}
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
                    this.manipulasiData.current.createNewKonsulDate(
                      this.props.match.params.id,
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
            { title: "Tanggal", field: "tanggal" },
            { title: "Jam", field: "jam" },
            { title: "Status", field: "status" },
            { title: "Keterangan", field: "keterangan" },
            {
              render: rowData => {
                return (
                  <div>
                    <IconButton
                      className={classes.button}
                      aria-label="Delete"
                      onClick={() =>
                        this.manipulasiData.current.deleteEvent(rowData)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                );
              }
            }
          ]}
          data={Object.keys(this.props.detailjadwal.data).map(key => ({
            id: key,
            ...this.props.detailjadwal.data[key]
          }))}
          options={{
            columnsButton: true,
            exportButton: true
          }}
          title="Data Konsul"
        />
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    detailjadwal: state.detailjadwal
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
