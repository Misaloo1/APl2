import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" },
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          My Dashboard
        </Typography>
        <List>
          {["Home", "Reports", "Settings"].map((text) => (
            <ListItem button key={text}>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Dashboard
            </Typography>
            <TextField
              size="small"
              placeholder="Search..."
              variant="outlined"
              sx={{
                backgroundColor: "white",
                borderRadius: 1,
                mr: 2,
                width: 200,
              }}
            />
            <Button color="inherit" onClick={() => setDialogOpen(true)}>
              New Report
            </Button>
          </Toolbar>
        </AppBar>

        {/* Grid Layout */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Card {item}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Some quick example data inside a card.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => setSnackbarOpen(true)}
                    >
                      Action
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Create New Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Report Name"
            variant="outlined"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setDialogOpen(false);
              setSnackbarOpen(true);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Action successful!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
