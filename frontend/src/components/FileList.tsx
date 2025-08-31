import { MoreVert } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FC, MouseEvent, useEffect, useState } from "react";
import { FilesService } from "../services/files.service";
import { FileItem } from "../types/files";
import { formatDate, formatFileSize } from "../utils/files";

type Props = {
  onError: (error: string) => void;
  reloadKey: number;
  onDelete: (key: string) => void;
};

const FileList: FC<Props> = ({ onError, reloadKey, onDelete }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const filesService = new FilesService();

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const fileList = await filesService.listFiles();
      setFiles(fileList);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load files";
      onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, fileKey: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(fileKey);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = async (key: string) => {
    try {
      const url = await filesService.getDownloadUrl(key);
      const link = document.createElement("a");
      link.href = url;
      link.download = key.split("/").pop() || key;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      handleMenuClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Download failed");
    }
  };

  useEffect(() => {
    loadFiles();
  }, [reloadKey]);

  if (isLoading) {
    return (
      <Card>
        <CardContent sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading files...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Uploaded Files
        </Typography>

        {files.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              No files uploaded yet
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Upload Date</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TableRow key={file.key}>
                    <TableCell>
                      <Typography variant="body2">
                        {file.key.split("/").pop() || file.key}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {file.size ? formatFileSize(file.size) : "Unknown"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(file.lastModified)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, file.key)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem onClick={() => handleDownload(selectedFile ?? "")}>
            <ListItemText primary="Download" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              onDelete(selectedFile ?? "");
              handleMenuClose();
            }}
          >
            <ListItemText primary="Delete" sx={{ color: "red" }} />
          </MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default FileList;
