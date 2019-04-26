import React, { useState } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Notif from "../view/notif";
import { auth } from "../../firebase";
import { isEmail, isEmpty } from "validator";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});
function Login(props) {
  const [message, setMessage] = useState({ open: false, msg: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { classes } = props;
  const loginClick = () => {
    if (isEmail(email) && !isEmpty(password))
      return auth.signInWithEmailAndPassword(email, password).catch(e => {
        setMessage({ open: true, msg: e.message || e });
      });
  };
  const lupaPassword = () => {
    if (isEmail(email))
      return auth
        .sendPasswordResetEmail(email)
        .then(() =>
          setMessage({
            open: true,
            msg: "Cek inbox di email untuk reset password"
          })
        )
        .catch(e => {
          setMessage({ open: true, msg: e.message || e });
        });
  };
  return (
    <main className={classes.main}>
      <CssBaseline />
      <Notif
        message={message}
        okclick={() => setMessage({ open: false, msg: "" })}
      />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              id="email"
              name="email"
              autoComplete="email"
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input
              name="password"
              type="password"
              id="password"
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FormControl>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="primary"
            onClick={loginClick}
            className={classes.submit}
          >
            Login
          </Button>
          <Button
            type="button"
            fullWidth
            variant="text"
            color="primary"
            onClick={lupaPassword}
            className={classes.submit}
          >
            Lupa Password ?
          </Button>
        </form>
      </Paper>
    </main>
  );
}
Login.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Login);
