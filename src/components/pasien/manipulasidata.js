import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import { isEmail, isEmpty, isNumeric } from "validator";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
export default class Manipulasi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      id: "",
      level: "",
      email: "",
      nama: "",
      alamat: "",
      umur: "",
      telepon: ""
    };
  }
  updateFiled = (field, value) => this.setState({ [field]: value });
  buttonClick = () => {
    const { type, id } = this.state;
    const { level, email, nama, alamat, umur, telepon } = this.state;
    this.setState({
      type: "",
      id: "",
      level: "",
      email: "",
      nama: "",
      alamat: "",
      umur: "",
      telepon: ""
    });
    return this.props.event(type, id, {
      level,
      email,
      nama,
      alamat,
      umur,
      telepon
    });
  };
  updateEvent = rowData => {
    this.setState({
      type: "Update",
      id: rowData.id,
      level: rowData.level,
      email: rowData.email,
      nama: rowData.nama,
      alamat: rowData.alamat,
      umur: rowData.umur.toString(),
      telepon: rowData.telepon
    });
  };
  deleteEvent = rowData => {
    this.setState({
      type: "Delete",
      id: rowData.id,
      level: rowData.level,
      email: rowData.email,
      nama: rowData.nama,
      alamat: rowData.alamat,
      umur: rowData.umur.toString(),
      telepon: rowData.telepon
    });
  };
  addEvent = id => {
    this.setState({
      type: "Add",
      id: id,
      level: "PASIEN",
      email: "",
      nama: "",
      alamat: "",
      umur: "",
      telepon: ""
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <Dialog
        fullScreen
        open={
          this.state.type === "Add" ||
          this.state.type === "Update" ||
          this.state.type === "Delete"
        }
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() =>
                this.setState({
                  type: "",
                  id: "",
                  level: "PASIEN",
                  email: "",
                  nama: "",
                  alamat: "",
                  umur: "",
                  telepon: ""
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} Pasien
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !isEmail(this.state.email) ||
                isEmpty(this.state.nama) ||
                !isNumeric(this.state.umur) ||
                isEmpty(this.state.alamat) ||
                isEmpty(this.state.telepon) ||
                isEmpty(this.state.id)
              }
            >
              {this.state.type}
            </Button>
          </Toolbar>
        </AppBar>
        <form className={classes.containers} noValidate autoComplete="off">
          <TextField
            label="Email"
            className={classes.textField}
            value={this.state.email}
            onChange={e => this.updateFiled("email", e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Nama"
            fullWidth
            value={this.state.nama}
            onChange={e =>
              this.updateFiled("nama", e.target.value.toUpperCase())
            }
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Umur"
            fullWidth
            value={this.state.umur}
            onChange={e => this.updateFiled("umur", e.target.value)}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Alamat"
            fullWidth
            value={this.state.alamat}
            onChange={e =>
              this.updateFiled("alamat", e.target.value.toUpperCase())
            }
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Telepon"
            fullWidth
            value={this.state.telepon}
            onChange={e => this.updateFiled("telepon", e.target.value)}
            className={classes.textField}
            margin="normal"
            variant="outlined"
          />
        </form>
      </Dialog>
    );
  }
}
