import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SideDrawer from "../components/SideDrawer";
import Container from "@mui/material/Container";
// Drawer icons moved into SideDrawer component
import { Outlet } from "react-router";

const DRAWER_WIDTH = 250;
const DRAWER_COLLAPSED_WIDTH = 70;

function Main() {
  const [drawerExpanded, setDrawerExpanded] = useState(true);

  const toggleDrawer = () => {
    setDrawerExpanded(!drawerExpanded);
  };

  // drawer content moved to SideDrawer component

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: `calc(100% - ${
            drawerExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH
          }px)`,
          marginLeft: drawerExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            {drawerExpanded ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bank Admin Portal
          </Typography>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <SideDrawer drawerExpanded={drawerExpanded} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 8,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          marginLeft: 0,
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            width: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            px: 0,
          }}
        >
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}

export default Main;
