import React, { Component } from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { db } from "../../firebase";
import { dataAdd } from "../../redux/chat/action";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
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
class ChatPasien extends Component {
  constructor(props) {
    super(props);
    this.collection = db.collection("jadwal");
    this.collectionUser = db.collection("user");
    this.idpasien = this.props.match.params.id;
    this.state = {
      message: { open: false, msg: "" }
    };
  }
  componentDidMount() {
    this.collection
      .where("pasien", "==", db.doc(`user/${this.idpasien}`))
      .get()
      .then(snap =>
        snap.docs.map(it => ({
          id: it.id,
          pasien: it.get("pasien").id,
          dokter: it.get("dokter").id
        }))
      )
      .then(listRoom => {
        listRoom.forEach(room => {
          this.collectionUser
            .doc(room.dokter)
            .get()
            .then(dokter => {
              const data = {
                id: room.id,
                namadokter: dokter.get("nama")
              };
              this.props.dataAdd(room.id, data);
            });
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <MaterialTable
          columns={[
            { title: "Dokter", field: "namadokter" },
            {
              render: rowData => {
                const linkChatPasien = `/chatcontent/${rowData.id}`;
                return (
                  <div>
                    <Link to={linkChatPasien}>
                      <IconButton className={classes.button} aria-label="Chat">
                        <InfoIcon />
                      </IconButton>
                    </Link>
                  </div>
                );
              }
            }
          ]}
          data={Object.keys(this.props.chat.data).map(key => ({
            id: key,
            ...this.props.chat.data[key]
          }))}
          options={{
            columnsButton: true,
            exportButton: true
          }}
          title="Data Chat"
        />
      </div>
    );
  }
}
const mapStateToProp = state => {
  return {
    chat: state.chat
  };
};
const mapDispatchToProps = dispatch => {
  return {
    dataAdd: (id, doc) => {
      dispatch(dataAdd(id, doc));
    }
  };
};
const DataComponent = connect(
  mapStateToProp,
  mapDispatchToProps
)(ChatPasien);
ChatPasien.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(DataComponent);
