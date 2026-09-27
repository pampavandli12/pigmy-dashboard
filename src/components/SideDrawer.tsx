import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import CollectionsIcon from "@mui/icons-material/Collections";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { NavLink } from "react-router-dom";
import type { Theme } from "@mui/material/styles";

const DRAWER_WIDTH = 250;
const DRAWER_COLLAPSED_WIDTH = 70;

// Static navigation config — hoisted so it is not re-allocated on every render.
const MENU_ITEMS = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { label: "Agents", icon: <PersonIcon />, path: "agents" },
  { label: "Accounts", icon: <CollectionsIcon />, path: "accounts" },
  { label: "Reports", icon: <AssessmentIcon />, path: "reports" },
];

type Props = {
  drawerExpanded: boolean;
};

export default function SideDrawer({ drawerExpanded }: Props) {
  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <List sx={{ flex: 1 }}>
        {MENU_ITEMS.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === "/"}
              sx={(theme: Theme) => ({
                justifyContent: drawerExpanded ? "flex-start" : "center",
                px: 2,
                py: 1.5,
                textDecoration: "none",
                color: theme.palette.text.primary,
                "&.active": {
                  backgroundColor: theme.palette.action.selected,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
              })}
              title={drawerExpanded ? "" : item.label}
            >
              <ListItemIcon
                sx={{
                  minWidth: drawerExpanded ? 40 : 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {drawerExpanded && <ListItemText primary={item.label} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerExpanded ? DRAWER_WIDTH : DRAWER_COLLAPSED_WIDTH,
          boxSizing: "border-box",
          marginTop: "64px",
          height: "calc(100% - 64px)",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          borderRight: (theme) => `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
