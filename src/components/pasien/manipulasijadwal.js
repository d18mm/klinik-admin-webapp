import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import DatePicker from "react-datepicker";
import { isEmpty } from "validator";
import { db } from "../../firebase";
import FormLabel from "@material-ui/core/FormLabel";
import { SingleSelect } from "react-select-material-ui";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import "moment/locale/id";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}
export class CreateNewRoom extends React.Component {
  constructor(props) {
    super(props);
    this.pasien = this.props.match.params.id;
    this.state = {
      type: "",
      roomid: "",
      subid: "",
      dokter: "",
      waktu: new Date()
    };
  }

  buttonClick = () => {
    const { type, roomid, subid, dokter, waktu } = this.state;
    console.log(this.pasien);
    this.setState({
      type: "",
      roomid: "",
      subid: "",
      dokter: "",
      waktu: new Date()
    });

    const tanggal = moment(waktu).format("DD/MM/YYYY");
    const jam = moment(waktu).format("HH:mm");
    const postRoomJadwal = {
      dokter: db.doc(`user/${dokter}`),
      pasien: db.doc(`user/${this.pasien}`)
    };

    const postJadwalInRoom = {
      waktu,
      tanggal,
      jam
    };
    return this.props.event(
      { type, roomid, subid },
      postRoomJadwal,
      postJadwalInRoom
    );
  };
  createNewJadwal = (roomid, subid) => {
    this.setState({
      type: "Create",
      roomid,
      subid,
      dokter: "",
      waktu: new Date()
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        fullScreen
        open={this.state.type === "Create"}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() =>
                this.setState({
                  type: "",
                  roomid: "",
                  subid: "",
                  dokter: "",
                  waktu: new Date()
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} Jadwal
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !moment(this.state.waktu).isValid() ||
                isEmpty(this.state.roomid) ||
                isEmpty(this.state.subid) ||
                isEmpty(this.state.dokter)
              }
            >
              {this.state.type}
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={24} style={{ padding: 20 }}>
          <Grid item xs={6}>
            <SingleSelect
              value={this.state.dokter}
              disabled={this.state.type !== "Create"}
              placeholder="Nama Dokter..."
              options={this.props.datadokter.map(it => ({
                label: it.nama,
                value: it.id
              }))}
              onChange={v => this.setState({ dokter: v })}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              popperPlacement="top-end"
              selected={this.state.waktu}
              className={classes.textDate}
              onChange={waktu =>
                this.setState({
                  waktu
                })
              }
              showTimeSelect
              timeFormat="HH:mm"
              dateFormat="dd/MM/yyyy HH:mm"
              timeCaption="time"
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
}
export class DeleteRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roomid: "",
      namadokter: null,
      iddokter: ""
    };
  }
  openDialogDelete = (roomid, namadokter, iddokter) => {
    this.setState({ roomid, namadokter, iddokter });
  };
  closeDialog = () => {
    this.setState({
      roomid: "",
      namadokter: "",
      iddokter: ""
    });
  };
  buttonOkClick = () => {
    const { roomid, iddokter } = this.state;
    console.log(iddokter);

    this.closeDialog();
    return this.props.event(roomid, iddokter);
  };

  render() {
    return (
      <Dialog
        open={this.state.roomid !== ""}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Hapus Semua Data Jadwal
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            hapus semua jadwal antara {this.props.match.params.id}(Pasien)
            dengan {this.state.namadokter || ""}(Dokter)
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.closeDialog} color="primary">
            Tidak
          </Button>
          <Button
            disabled={this.state.dokter === null || isEmpty(this.state.roomid)}
            onClick={this.buttonOkClick}
            color="primary"
            autoFocus
          >
            Ya
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
export class CreateNewKonsul extends React.Component {
  constructor(props) {
    super(props);
    this.pasien = this.props.match.params.id;
    this.state = {
      type: "",
      subid: "",
      waktu: new Date()
    };
  }
  createNewKonsulDate = (roomid, subid) => {
    this.setState({
      type: "Add",
      subid,
      waktu: new Date()
    });
  };
  deleteEvent = rowData => {
    this.setState({
      type: "Delete",
      subid: rowData.id,
      waktu: rowData.waktu.toDate()
    });
  };
  buttonClick = () => {
    const { type, waktu, subid } = this.state;
    const tanggal = moment(waktu).format("DD/MM/YYYY");
    const jam = moment(waktu).format("HH:mm");
    console.log(tanggal);
    this.setState({
      type: "",
      subid: "",
      waktu: new Date()
    });

    return this.props.event(type, subid, { waktu, tanggal, jam });
  };

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        fullScreen
        open={this.state.type === "Add" || this.state.type === "Delete"}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={() =>
                this.setState({
                  type: "",
                  subid: "",
                  waktu: new Date()
                })
              }
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.flex}>
              {this.state.type} Jadwal
            </Typography>
            <Button
              color="inherit"
              onClick={this.buttonClick}
              disabled={
                !moment(this.state.waktu).isValid() || isEmpty(this.state.subid)
              }
            >
              {this.state.type}
            </Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={24} style={{ padding: 20 }}>
          <FormLabel component="legend" className={classes.textDate}>
            Waktu Konsul
          </FormLabel>
          <DatePicker
            popperPlacement="top"
            selected={this.state.waktu}
            className={classes.textDate}
            onChange={waktu =>
              this.setState({
                waktu
              })
            }
            showTimeSelect
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            timeCaption="time"
          />
        </Grid>
      </Dialog>
    );
  }
}
