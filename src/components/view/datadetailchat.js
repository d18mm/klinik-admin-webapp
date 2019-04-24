import React, { Component } from "react";
import PropTypes from "prop-types";
import { db } from "../../firebase";

import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Data extends Component {
  constructor(props) {
    super(props);
    this.roomid = this.props.match.params.id;
    this.collection = db
      .collection(`jadwal/${this.roomid}/chat`)
      .orderBy("time", "desc");
    this.state = {
      listData: []
    };
  }
  componentDidMount() {
    this.collection.get().then(snap => {
      const listData = snap.docs.map(it => ({ id: it.id, ...it.data() }));

      this.setState({ listData });
    });
  }
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <List component="data">
            {this.state.listData.map(value => {
              const secondary = `Pengirim ${
                value.send
              } - waktu ${value.time.toDate() || "unknown time"}`;
              return (
                <ListItem key={value.id}>
                  <ListItemText primary={value.body} secondary={secondary} />
                  <Divider />
                </ListItem>
              );
            })}
          </List>
        </Paper>
      </div>
    );
  }
}

Data.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Data);
