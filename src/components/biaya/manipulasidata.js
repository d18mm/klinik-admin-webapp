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
import { isEmpty, isNumeric } from "validator";
import InputAdornment from "@material-ui/core/InputAdornment";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
export default class Manipulasi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "",
      id: "",
      konsultasi: "",
      biaya: "",
      keterangan: ""
    };
  }
  updateFiled = (field, value) => this.setState({ [field]: value });
  buttonClick = () => {
    const { type, id } = this.state;
    const { konsultasi, biaya, keterangan } = this.state;
    this.setState({
      type: "",
      id: "",
      konsultasi: "",
      biaya: "",
      keterangan: ""
    });
    return this.props.event(type, id, {
      konsultasi,
      biaya: `${biaya}.000`,
      keterangan
    });
  };
  updateEvent = rowData => {
    this.setState({
      type: "Update",
      id: rowData.id,
      konsultasi: rowData.konsultasi,
      biaya: rowData.biaya.slice(0, -4) || "",
      keterangan: rowData.keterangan
    });
  };
  deleteEvent = rowData => {
    this.setState({
      type: "Delete",
      id: rowData.id,
      konsultasi: rowData.konsultasi,
      biaya: rowData.biaya.slice(0, -4) || "",
      keterangan: rowData.keterangan
    });
  };
  addEvent = id => {
    this.setState({
      type: "Add",
      id: id,
      konsultasi: "",
      biaya: "",
      keterangan: ""
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
                  konsultasi: "",
                  biaya: "",
                  keterangan: ""
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} Biaya
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !isNumeric(this.state.biaya) ||
                isEmpty(this.state.keterangan) ||
                isEmpty(this.state.konsultasi) ||
                isEmpty(this.state.id)
              }
            >
              {this.state.type}
            </Button>
          </Toolbar>
        </AppBar>
        <form className={classes.containers} noValidate autoComplete="off">
          <TextField
            label="Konsultasi"
            fullWidth
            value={this.state.konsultasi}
            onChange={e => this.updateFiled("konsultasi", e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Biaya"
            value={this.state.biaya}
            type="number"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Rp.</InputAdornment>
              ),
              endAdornment: <InputAdornment position="end">.000</InputAdornment>
            }}
            onChange={e => this.updateFiled("biaya", e.target.value)}
            margin="normal"
            variant="outlined"
          />
          <TextField
            label="Keterangan"
            fullWidth
            multiline
            value={this.state.keterangan}
            onChange={e => this.updateFiled("keterangan", e.target.value)}
            margin="normal"
            variant="outlined"
          />
        </form>
      </Dialog>
    );
  }
}
