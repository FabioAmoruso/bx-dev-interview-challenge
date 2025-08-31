import {
  Alert,
  Button,
  Card,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import { ChangeEvent, DragEvent, FC, useCallback, useState } from "react";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "../constants/files";
import { FilesService } from "../services/files.service";
import { formatFileSize } from "../utils/files";

type Props = {
  onUploadSuccess: () => void;
  onUploadError: (error: string) => void;
};

export const FileUpload: FC<Props> = ({ onUploadSuccess, onUploadError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const filesService = new FilesService();

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File size must be less than 10MB`;
    }

    const isValidType = ALLOWED_MIME_TYPES.some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type not allowed. Allowed types: ${ALLOWED_MIME_TYPES.join(
        ", "
      )}`;
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);

    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }, []);

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);

      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await filesService.uploadFile(selectedFile);

      onUploadSuccess();
      setSelectedFile(null);
      setIsUploading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
      onUploadError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload File
        </Typography>

        <Paper
          sx={{
            p: 3,
            border: "2px dashed",
            borderColor: isDragOver ? "primary.main" : "grey.300",
            backgroundColor: isDragOver ? "action.hover" : "background.paper",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            mb: 2,
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Typography variant="body1" color="text.secondary">
            {selectedFile
              ? `${selectedFile.name} (${formatFileSize(selectedFile.size)})`
              : "Drag and drop a file here, or click to select"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Allowed types: Images, PDF • Max size: 10MB
          </Typography>
        </Paper>

        <input
          id="file-input"
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          fullWidth
        >
          {isUploading ? "Uploading..." : "Upload File"}
        </Button>
      </CardContent>
    </Card>
  );
};
