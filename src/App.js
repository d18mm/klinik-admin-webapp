import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Switch } from "react-router-dom";
import { AuthRoute, UnauthRoute } from "react-router-auth";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import PropTypes from "prop-types";
import { auth } from "./firebase";
import { setCurrentUser } from "./redux/auth/action";
import Login from "./components/login/login";
import DataAdmin from "./components/admin/data";
import DataDokter from "./components/dokter/data";
import DataPasien from "./components/pasien/data";
import JadwalPasien from "./components/pasien/roomjadwalpasien";
import JadwalDokter from "./components/dokter/roomjadwaldokter";
import DataKonsulDokter from "./components/dokter/datadetailjadwal";
import DataKonsulPasien from "./components/pasien/datadetailjadwal";
import Dashboard from "./components/dashboard/dashboard";
import RoomCahtPasien from "./components/pasien/roomchatpasien";
import RoomCahtDokter from "./components/dokter/roomchatdokter";
import ContentChat from "./components/view/datadetailchat";
import DataBiaya from "./components/biaya/data";
import AppBars from "./components/view/appBar";
import Logout from "./components/view/logout";
import LinearProgress from "@material-ui/core/LinearProgress";
const drawerWidth = 240;
const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  },
  chartContainer: {
    marginLeft: -22
  },
  tableContainer: {
    height: 320
  },
  h5: {
    marginBottom: theme.spacing.unit * 2
  }
});
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }
  componentDidMount() {
    this.unregisterAuthObserver = auth.onAuthStateChanged(user => {
      if (user !== null) {
        // this.props.setCurrentUser(user);
        // this.setState({ isLoading: false });
        if (localStorage.getItem("level") === "ADMIN") {
          this.props.setCurrentUser(user);
          this.setState({ isLoading: false });
        } else {
          user
            .getIdTokenResult(true)
            .then(authResult => authResult.claims["level"] === "ADMIN")
            .then(isAdmin => {
              if (isAdmin) {
                localStorage.setItem("level", "ADMIN");
                this.props.setCurrentUser(user);
                this.setState({ isLoading: false });
              } else auth.signOut();
            })
            .catch(error => {
              console.log(error);
              auth.signOut();
            });
        }
      } else {
        localStorage.removeItem("level");
        this.props.setCurrentUser(null);
        this.setState({ isLoading: false });
      }
    });
  }
  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <CssBaseline />
        {this.state.isLoading === true ? (
          <LinearProgress />
        ) : (
          <div className={classes.root}>
            {this.props.auth.user !== null ? <AppBars {...this.props} /> : ""}
            <main className={classes.content}>
              <div className={classes.appBarSpacer} />

              <div className={classes.tableContainer}>
                <Switch>
                  <AuthRoute
                    exact
                    path="/"
                    authenticated={this.props.auth.user !== null}
                    component={Dashboard}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/admin"
                    authenticated={this.props.auth.user !== null}
                    component={DataAdmin}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/dokter"
                    authenticated={this.props.auth.user !== null}
                    component={DataDokter}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/jadwaldokter/:id"
                    authenticated={this.props.auth.user !== null}
                    component={JadwalDokter}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/konsuldokter/:id"
                    authenticated={this.props.auth.user !== null}
                    component={DataKonsulDokter}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/chatdokter/:id"
                    authenticated={this.props.auth.user !== null}
                    component={RoomCahtDokter}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/pasien"
                    authenticated={this.props.auth.user !== null}
                    component={DataPasien}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/jadwalpasien/:id"
                    authenticated={this.props.auth.user !== null}
                    component={JadwalPasien}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/konsulpasien/:id"
                    authenticated={this.props.auth.user !== null}
                    component={DataKonsulPasien}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/chatpasien/:id"
                    authenticated={this.props.auth.user !== null}
                    component={RoomCahtPasien}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/chatcontent/:id"
                    authenticated={this.props.auth.user !== null}
                    component={ContentChat}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/biaya"
                    authenticated={this.props.auth.user !== null}
                    component={DataBiaya}
                    redirectTo="/login"
                  />
                  <AuthRoute
                    exact
                    path="/logout"
                    authenticated={this.props.auth.user !== null}
                    component={Logout}
                    redirectTo="/login"
                  />
                  <UnauthRoute
                    path="/login"
                    component={Login}
                    authenticated={this.props.auth.user !== null}
                    redirectTo="/"
                  />
                </Switch>
              </div>
            </main>
          </div>
        )}
      </BrowserRouter>
    );
  }
}
App.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProp = state => {
  return {
    auth: state.auth
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setCurrentUser: user => {
      dispatch(setCurrentUser(user));
    }
  };
};
const AppComponent = connect(
  mapStateToProp,
  mapDispatchToProps
)(App);
export default withStyles(styles)(AppComponent);
