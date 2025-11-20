# 📎 File Upload System

## Overview

This document describes the file upload system for the Employer Portal, including resume uploads, document attachments, image uploads, and file management.

## Supported File Types

### Resumes
- **PDF** (.pdf) - Preferred
- **Microsoft Word** (.doc, .docx)
- **Text** (.txt)
- **Max Size**: 10 MB

### Images
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **GIF** (.gif)
- **WebP** (.webp)
- **Max Size**: 5 MB per image
- **Max Dimensions**: 5000x5000px

### Documents
- **PDF** (.pdf)
- **Microsoft Word** (.doc, .docx)
- **Microsoft Excel** (.xls, .xlsx)
- **PowerPoint** (.ppt, .pptx)
- **Text** (.txt)
- **Max Size**: 25 MB

### Other Files
- **ZIP** (.zip) - For portfolios
- **Max Size**: 50 MB

## Upload Flow

### Standard Upload Flow
```
1. User selects file(s)
2. Frontend validates file
3. Show upload progress
4. Upload to temporary storage
5. Process file (scan, optimize)
6. Move to permanent storage
7. Generate file URL
8. Save file metadata to database
9. Return file ID/URL to frontend
10. Display uploaded file
```

### Resume Upload Flow
```
1. Candidate selects resume
2. Validate file type and size
3. Upload to S3/Cloudinary
4. Extract text from resume (OCR/parsing)
5. Extract skills and experience
6. Generate preview
7. Store file metadata
8. Link to application
9. Return file info
```

## Storage Architecture

### Storage Options

#### Option 1: AWS S3 (Recommended)
- **Bucket**: `evolvix-employer-uploads`
- **Region**: us-east-1 (or nearest)
- **Access**: Private with signed URLs
- **CDN**: CloudFront for public assets
- **Lifecycle**: Archive old files after 2 years

#### Option 2: Cloudinary
- **Service**: Cloudinary Media Library
- **Features**: Auto-optimization, transformations
- **Best for**: Images and media

#### Option 3: Azure Blob Storage
- **Container**: `employer-uploads`
- **Access**: Private with SAS tokens
- **CDN**: Azure CDN

### File Organization
```
employer-uploads/
├── resumes/
│   ├── {employerId}/
│   │   ├── {applicationId}/
│   │   │   └── resume-{timestamp}.pdf
├── documents/
│   ├── {employerId}/
│   │   ├── {jobId}/
│   │   │   └── document-{timestamp}.pdf
├── images/
│   ├── {employerId}/
│   │   ├── career-page/
│   │   │   └── image-{timestamp}.jpg
│   │   ├── company-logo/
│   │   │   └── logo.png
└── temp/
    └── {userId}/
        └── upload-{timestamp}.tmp
```

## Frontend Implementation

### File Input Component
```typescript
interface FileUploadProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: File[]) => Promise<void>;
  onProgress?: (progress: number) => void;
}

function FileUpload({ accept, maxSize, onUpload, onProgress }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validate files
    const validFiles = selectedFiles.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} exceeds size limit`);
        return false;
      }
      return true;
    });
    
    setFiles(validFiles);
    await uploadFiles(validFiles);
  };
  
  const uploadFiles = async (filesToUpload: File[]) => {
    setUploading(true);
    setProgress(0);
    
    try {
      await onUpload(filesToUpload);
      setProgress(100);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <div>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        disabled={uploading}
      />
      {uploading && <ProgressBar value={progress} />}
    </div>
  );
}
```

### Drag & Drop Upload
```typescript
function DragDropUpload({ onUpload }: { onUpload: (files: File[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={isDragging ? 'dragging' : ''}
    >
      Drop files here or click to browse
    </div>
  );
}
```

## Backend Implementation

### Upload Endpoint
```typescript
// POST /api/upload/resume
async function uploadResume(req: Request, res: Response) {
  try {
    const file = req.file; // From multer middleware
    const { applicationId } = req.body;
    
    // Validate file
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large' });
    }
    
    // Upload to S3
    const s3Key = `resumes/${req.user.employerId}/${applicationId}/${file.filename}`;
    const uploadResult = await s3.upload({
      Bucket: 'evolvix-employer-uploads',
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }).promise();
    
    // Process resume (extract text, skills)
    const resumeData = await processResume(file.buffer);
    
    // Save to database
    const fileRecord = await File.create({
      employerId: req.user.employerId,
      applicationId,
      fileName: file.originalname,
      fileUrl: uploadResult.Location,
      fileSize: file.size,
      fileType: file.mimetype,
      s3Key: s3Key,
      metadata: resumeData,
    });
    
    res.json({
      success: true,
      data: {
        fileId: fileRecord.id,
        fileUrl: fileRecord.fileUrl,
        fileName: fileRecord.fileName,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
}
```

### File Processing
```typescript
async function processResume(buffer: Buffer) {
  // Extract text using OCR or PDF parser
  const text = await extractText(buffer);
  
  // Extract skills
  const skills = extractSkills(text);
  
  // Extract experience
  const experience = extractExperience(text);
  
  // Extract education
  const education = extractEducation(text);
  
  return {
    text,
    skills,
    experience,
    education,
    wordCount: text.split(' ').length,
  };
}
```

## File Validation

### Frontend Validation
```typescript
function validateFile(file: File, options: ValidationOptions): ValidationResult {
  const errors: string[] = [];
  
  // Check file type
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not allowed`);
  }
  
  // Check file size
  if (options.maxSize && file.size > options.maxSize) {
    errors.push(`File size exceeds ${options.maxSize} bytes`);
  }
  
  // Check file name
  if (options.maxFileNameLength && file.name.length > options.maxFileNameLength) {
    errors.push('File name too long');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

### Backend Validation
```typescript
import fileType from 'file-type';

async function validateFileBuffer(buffer: Buffer, expectedType: string) {
  // Check actual file type (not just extension)
  const type = await fileType.fromBuffer(buffer);
  
  if (!type || !isAllowedMimeType(type.mime)) {
    throw new Error('Invalid file type');
  }
  
  // Virus scanning (if service available)
  const scanResult = await scanForVirus(buffer);
  if (!scanResult.clean) {
    throw new Error('File failed virus scan');
  }
  
  return true;
}
```

## File Security

### Access Control
- **Private Files**: Signed URLs with expiration
- **Public Files**: CDN with cache headers
- **Access Logging**: Track file access

### Signed URLs
```typescript
function generateSignedUrl(s3Key: string, expiresIn: number = 3600) {
  return s3.getSignedUrl('getObject', {
    Bucket: 'evolvix-employer-uploads',
    Key: s3Key,
    Expires: expiresIn, // 1 hour default
  });
}
```

### Virus Scanning
```typescript
async function scanForVirus(buffer: Buffer): Promise<ScanResult> {
  // Option 1: ClamAV (self-hosted)
  // Option 2: AWS GuardDuty
  // Option 3: Third-party service (VirusTotal API)
  
  // Example with ClamAV
  const result = await clamav.scanBuffer(buffer);
  return {
    clean: result.isInfected === false,
    threats: result.viruses || [],
  };
}
```

## File Preview

### Resume Preview
```typescript
function ResumePreview({ fileUrl, fileType }: ResumePreviewProps) {
  if (fileType === 'application/pdf') {
    return <PDFViewer url={fileUrl} />;
  }
  
  if (fileType.includes('word')) {
    return <WordViewer url={fileUrl} />;
  }
  
  return <TextPreview url={fileUrl} />;
}
```

### Image Preview
```typescript
function ImagePreview({ fileUrl, alt }: ImagePreviewProps) {
  return (
    <img
      src={fileUrl}
      alt={alt}
      loading="lazy"
      className="max-w-full h-auto"
    />
  );
}
```

## File Management

### File List
```typescript
// GET /api/files?type=resume&applicationId=xxx
async function getFiles(req: Request, res: Response) {
  const { type, applicationId, jobId } = req.query;
  
  const files = await File.find({
    employerId: req.user.employerId,
    ...(type && { fileType: type }),
    ...(applicationId && { applicationId }),
    ...(jobId && { jobId }),
  });
  
  res.json({ success: true, data: files });
}
```

### Delete File
```typescript
// DELETE /api/files/:fileId
async function deleteFile(req: Request, res: Response) {
  const { fileId } = req.params;
  
  const file = await File.findOne({
    id: fileId,
    employerId: req.user.employerId,
  });
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Delete from S3
  await s3.deleteObject({
    Bucket: 'evolvix-employer-uploads',
    Key: file.s3Key,
  }).promise();
  
  // Delete from database
  await File.delete(fileId);
  
  res.json({ success: true });
}
```

## Progress Tracking

### Upload Progress
```typescript
function uploadWithProgress(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        const progress = (e.loaded / e.total) * 100;
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload failed'));
      }
    });
    
    xhr.addEventListener('error', reject);
    
    const formData = new FormData();
    formData.append('file', file);
    
    xhr.open('POST', '/api/upload/resume');
    xhr.send(formData);
  });
}
```

## Error Handling

### Upload Errors
```typescript
enum UploadError {
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  VIRUS_DETECTED = 'VIRUS_DETECTED',
  UPLOAD_FAILED = 'UPLOAD_FAILED',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
}

function handleUploadError(error: UploadError) {
  const errorMessages = {
    [UploadError.FILE_TOO_LARGE]: 'File size exceeds limit',
    [UploadError.INVALID_FILE_TYPE]: 'Invalid file type',
    [UploadError.VIRUS_DETECTED]: 'File failed security scan',
    [UploadError.UPLOAD_FAILED]: 'Upload failed, please try again',
    [UploadError.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded',
  };
  
  return errorMessages[error] || 'Unknown error';
}
```

## Performance Optimization

### Image Optimization
```typescript
import sharp from 'sharp';

async function optimizeImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toBuffer();
}
```

### Chunked Upload (Large Files)
```typescript
async function uploadLargeFile(file: File, chunkSize: number = 5 * 1024 * 1024) {
  const totalChunks = Math.ceil(file.size / chunkSize);
  const uploadId = await initiateMultipartUpload(file.name);
  
  const parts = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const part = await uploadChunk(uploadId, i + 1, chunk);
    parts.push(part);
  }
  
  await completeMultipartUpload(uploadId, parts);
  return uploadId;
}
```

## Future Enhancements

1. **Advanced Resume Parsing**
   - AI-powered extraction
   - Structured data extraction
   - Skill matching

2. **File Versioning**
   - Version history
   - Compare versions
   - Restore previous version

3. **Bulk Upload**
   - Multiple files at once
   - ZIP file extraction
   - Batch processing

4. **File Sharing**
   - Share files with team
   - Set expiration dates
   - Access permissions

5. **Integration**
   - Google Drive
   - Dropbox
   - OneDrive

