import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
export default function Notif(props) {
  const { message, okclick } = props;
  return (
    <Fragment>
      <Dialog
        open={message.open}
        aria-labelledby="alert-dialog-notif"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={okclick} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
