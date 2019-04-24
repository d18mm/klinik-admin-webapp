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
      email: "",
      nama: "",
      asisten: "",
      alamat: "",
      telepon: "",
      waktupraktek: "",
      level: "DOKTER"
    };
  }
  updateFiled = (field, value) => this.setState({ [field]: value });
  buttonClick = () => {
    const { type, id } = this.state;
    const {
      email,
      nama,
      asisten,
      alamat,
      telepon,
      waktupraktek,
      level
    } = this.state;
    this.setState({
      type: "",
      id: "",
      email: "",
      nama: "",
      asisten: "",
      alamat: "",
      telepon: "",
      waktupraktek: "",
      level: "DOKTER"
    });
    return this.props.event(type, id, {
      email,
      nama,
      asisten,
      alamat,
      telepon,
      waktupraktek,
      level
    });
  };
  updateEvent = rowData => {
    this.setState({
      type: "Update",
      id: rowData.id,
      email: rowData.email,
      nama: rowData.nama,
      asisten: rowData.asisten,
      alamat: rowData.alamat,
      telepon: rowData.telepon,
      waktupraktek: rowData.waktupraktek,
      level: rowData.level
    });
  };
  deleteEvent = rowData => {
    this.setState({
      type: "Delete",
      id: rowData.id,
      email: rowData.email,
      nama: rowData.nama,
      asisten: rowData.asisten,
      alamat: rowData.alamat,
      telepon: rowData.telepon,
      waktupraktek: rowData.waktupraktek,
      level: rowData.level
    });
  };
  addEvent = id => {
    this.setState({
      type: "Add",
      id: id,
      email: "",
      nama: "",
      asisten: "",
      alamat: "",
      telepon: "",
      waktupraktek: "",
      level: "DOKTER"
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
                  email: "",
                  nama: "",
                  asisten: "",
                  alamat: "",
                  telepon: "",
                  waktupraktek: "",
                  level: "DOKTER"
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} Dokter
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !isEmail(this.state.email) ||
                this.state.level !== "DOKTER" ||
                !isNumeric(this.state.telepon) ||
                isEmpty(this.state.nama) ||
                isEmpty(this.state.asisten) ||
                isEmpty(this.state.alamat) ||
                isEmpty(this.state.waktupraktek) ||
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
            fullWidth
            value={this.state.email}
            className={classes.textField}
            onChange={e => this.updateFiled("email", e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Nama"
            fullWidth
            value={this.state.nama}
            className={classes.textField}
            onChange={e =>
              this.updateFiled("nama", e.target.value.toUpperCase())
            }
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Asisten"
            className={classes.textField}
            fullWidth
            value={this.state.asisten}
            onChange={e =>
              this.updateFiled("asisten", e.target.value.toUpperCase())
            }
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Alamat"
            fullWidth
            className={classes.textField}
            value={this.state.alamat}
            onChange={e =>
              this.updateFiled("alamat", e.target.value.toUpperCase())
            }
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Telepon"
            fullWidth
            className={classes.textField}
            value={this.state.telepon}
            onChange={e => this.updateFiled("telepon", e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Waktu Praktek"
            fullWidth
            className={classes.textField}
            value={this.state.waktupraktek}
            onChange={e =>
              this.updateFiled("waktupraktek", e.target.value.toLowerCase())
            }
            margin="normal"
            variant="outlined"
          />
        </form>
      </Dialog>
    );
  }
}
