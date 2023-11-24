import React from "react";
import {
  Toolbar,
  Avatar,
  Menu,
  Box,
  IconButton,
  Tooltip,
  MenuItem,
  Typography,
} from "@mui/material";

function Navbar() {
  const settings = [
    "Dashboard",
    "Account Setting",
    "Help and Support",
    "logout",
  ];

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <div className="navbar">
      <h1 style={{ color: "#585858 " }}>
        <img className="img" src="/doodle-favicon.svg" alt="imag" />
        Doodle
      </h1>
      <div className="profile">
        <Toolbar>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
              {/* <Link to="/login">
                <Button>Login</Button>
              </Link> */}
            </Menu>
          </Box>
        </Toolbar>
      </div>
    </div>
  );
}

export default Navbar;
