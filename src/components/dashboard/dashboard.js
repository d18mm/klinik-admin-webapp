import React, { Component } from "react";
import { db, functions } from "../../firebase";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import NotificationIcon from "@material-ui/icons/NotificationsActive";
import { withStyles } from "@material-ui/core/styles";
import { Chart } from "react-google-charts";
import timezone from "moment-timezone";
const waktuMakassar = timezone().tz("Asia/Makassar");

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.collection = db.collection("countuser");
    this.state = {
      ADMIN: 0,
      DOKTER: 0,
      PASIEN: 0
    };
  }
  componentDidMount() {
    this.registerCount = this.collection.onSnapshot(snap => {
      snap.docChanges().forEach(change => {
        if (change.type === "added") {
          this.setState({ [change.doc.id]: change.doc.get("value") });
        }
        if (change.type === "modified") {
          this.setState({ [change.doc.id]: change.doc.get("value") });
        }
        if (change.type === "removed") {
          this.setState({ [change.doc.id]: 0 });
        }
      });
    });
  }
  componentWillUnmount() {
    this.registerCount();
  }

  sendNotif = async () => {
    try {
      const waktu = waktuMakassar;
      const tanggal = `${waktu.date()}-${waktu.month()}-${waktu.year()}`;
      const funcMessage = functions.httpsCallable("OnHttpCallSendMessage");
      const messaging = await funcMessage(tanggal);
      console.log(messaging.data);
    } catch (error) {
      console.log(error.message || error);
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Chart
                width={"500px"}
                height={"300px"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ["Task", "User Count"],
                  ["Admin", this.state.ADMIN],
                  ["Dokter", this.state.DOKTER],
                  ["Pasien", this.state.PASIEN]
                ]}
                options={{
                  title: "Jumlah Pengguna",
                  // Just add this option
                  is3D: true
                }}
              />
              <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                onClick={this.sendNotif}
              >
                <NotificationIcon className={classes.leftIcon} />
                Kirim Notifikasi
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Dashboard);
