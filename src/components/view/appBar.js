import React, { Fragment, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import ExitToApp from "@material-ui/icons/ExitToApp";
import ListSubheader from "@material-ui/core/ListSubheader";
import PeopleIcon from "@material-ui/icons/People";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Dashboard from "@material-ui/icons/Dashboard";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import classNames from "classnames";
import MenuItem from "./menuItem";
export default function AppBars(props) {
  const [open, setOpen] = useState(false);
  const { classes } = props;
  return (
    <Fragment>
      <AppBar
        position="absolute"
        className={classNames(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar disableGutters={!open} className={classes.toolbar}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={() => setOpen(true)}
            className={classNames(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            KLINIK GOA RIA
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !open && classes.drawerPaperClose
          )
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MenuItem icon={<Dashboard />} text="Dashbard" path="/" />
          <MenuItem icon={<PeopleIcon />} text="Admin" path="/admin" />
          <MenuItem icon={<PeopleIcon />} text="Dokter" path="/dokter" />
          <MenuItem icon={<PeopleIcon />} text="Pasien" path="/pasien" />
          <MenuItem icon={<AttachMoney />} text="Biaya" path="/biaya" />
        </List>
        <Divider />
        <List>
          <ListSubheader inset>Akun</ListSubheader>
          <MenuItem icon={<ExitToApp />} text="Logout" path="/logout" />
        </List>
      </Drawer>
    </Fragment>
  );
}
