import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import FileList from "./FileList";
import authService from "../services/auth.service";
import { FilesService } from "../services/files.service";

const Dashboard: FC = () => {
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    setUploadMessage("File uploaded successfully!");
    setUploadError(null);
    setReloadKey((prev) => prev + 1);
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    setUploadMessage(null);
  };

  const handleFileListError = (error: string) => {
    setUploadError(error);
    setUploadMessage(null);
  };

  const handleDelete = async (key: string) => {
    try {
      const filesService = new FilesService();
      await filesService.deleteFile(key);
      setReloadKey((prev) => prev + 1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BonusX Interview Challenge
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                File Upload Application
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload and manage your files with our secure S3 storage system.
              </Typography>
            </Paper>
          </Grid>

          {uploadMessage && (
            <Grid size={12}>
              <Alert severity="success" onClose={() => setUploadMessage(null)}>
                {uploadMessage}
              </Alert>
            </Grid>
          )}

          {uploadError && (
            <Grid size={12}>
              <Alert severity="error" onClose={() => setUploadError(null)}>
                {uploadError}
              </Alert>
            </Grid>
          )}

          <Grid size={12}>
            <FileUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
          </Grid>

          <Grid size={12}>
            <FileList
              onError={handleFileListError}
              reloadKey={reloadKey}
              onDelete={handleDelete}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
