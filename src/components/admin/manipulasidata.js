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
import { isEmail, isEmpty } from "validator";
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
      level: "ADMIN"
    };
  }
  updateFiled = (field, value) => this.setState({ [field]: value });
  buttonClick = () => {
    const { type, id } = this.state;
    const { email, nama, level } = this.state;
    this.setState({
      type: "",
      id: "",
      email: "",
      nama: "",
      level: "ADMIN"
    });
    return this.props.event(type, id, { email, nama, level });
  };
  updateEvent = rowData => {
    this.setState({
      type: "Update",
      id: rowData.id,
      email: rowData.email,
      nama: rowData.nama,
      level: rowData.level
    });
  };
  deleteEvent = rowData => {
    this.setState({
      type: "Delete",
      id: rowData.id,
      email: rowData.email,
      nama: rowData.nama,
      level: rowData.level
    });
  };
  addEvent = id => {
    this.setState({
      type: "Add",
      id: id,
      email: "",
      nama: "",
      level: "ADMIN"
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
                  level: "ADMIN"
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} ADMIN
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !isEmail(this.state.email) ||
                this.state.level !== "ADMIN" ||
                isEmpty(this.state.id) ||
                isEmpty(this.state.nama)
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
        </form>
      </Dialog>
    );
  }
}
