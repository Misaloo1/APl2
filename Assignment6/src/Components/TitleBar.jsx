import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";

const TitleBar = () => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <MenuIcon style={{ Margin: "10px" }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default TitleBar;
