import { useCallback } from "react";
import { UPLOAD_DOC_TYPES } from "../types";
import { Upload, X, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

const StepUpload = ({ files, onFilesChange }: Props) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      onFilesChange([...files, ...Array.from(e.dataTransfer.files)]);
    },
    [files, onFilesChange]
  );

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFilesChange([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (idx: number) => onFilesChange(files.filter((_, i) => i !== idx));

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Upload className="mx-auto h-10 w-10 text-primary mb-3" />
        <h2 className="text-2xl font-serif font-bold text-foreground">File Uploads</h2>
        <p className="text-muted-foreground mt-1">Upload any documents that help us understand your project.</p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-sm text-foreground mb-1">Helpful documents include:</p>
          {UPLOAD_DOC_TYPES.map((doc) => (
            <p key={doc.id}>• {doc.label}</p>
          ))}
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Upload className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag & drop files here or <span className="text-primary font-medium">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DWG — Max 20MB per file</p>
          <input id="file-input" type="file" multiple className="hidden" onChange={handleSelect} accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf,.svg" />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(0)} KB)</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => removeFile(idx)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">Uploading documents significantly improves estimate accuracy.</p>
      </div>
    </div>
  );
};

export default StepUpload;
