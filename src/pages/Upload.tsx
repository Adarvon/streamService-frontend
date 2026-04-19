import { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Upload as UploadIcon, Image, X, Music, AlertCircle } from 'lucide-react';
import { tracksApi } from '../api';
import { useAuthStore } from '../store/authStore';
import styles from './Upload.module.css';

const GENRES = ['Electronic', 'Hip-hop', 'Rock', 'Pop', 'Jazz', 'Classical', 'R&B', 'Country'];
const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const AUDIO_TYPES = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/mp3'];
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

interface FormErrors {
  audio?: string;
  cover?: string;
  title?: string;
  genre?: string;
}

export const Upload = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [tags, setTags] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDraggingAudio, setIsDraggingAudio] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return tracksApi.upload({
        title: data.get('title') as string,
        description: data.get('description') as string,
        genre: data.get('genre') as string,
        audio: data.get('audio') as File,
        cover: data.get('cover') as File | undefined,
      });
    },
    onSuccess: (track) => {
      navigate(`/track/${track.id}`);
    },
    onError: (error: any) => {
      setErrors({ audio: error.response?.data?.message || 'Upload failed' });
    },
  });

  const validateAudioFile = (file: File): string | null => {
    if (!AUDIO_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload MP3, WAV, or FLAC';
    }
    if (file.size > MAX_AUDIO_SIZE) {
      return 'File too large. Maximum size is 100MB';
    }
    return null;
  };

  const validateImageFile = (file: File): string | null => {
    if (!IMAGE_TYPES.includes(file.type)) {
      return 'Invalid image type. Please upload JPG or PNG';
    }
    if (file.size > MAX_IMAGE_SIZE) {
      return 'Image too large. Maximum size is 5MB';
    }
    return null;
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingAudio(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateAudioFile(file);
      if (error) {
        setErrors({ ...errors, audio: error });
      } else {
        setAudioFile(file);
        setErrors({ ...errors, audio: undefined });
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    }
  };

  const handleCoverDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingCover(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        setErrors({ ...errors, cover: error });
      } else {
        setCoverFile(file);
        setErrors({ ...errors, cover: undefined });
        const reader = new FileReader();
        reader.onload = (e) => setCoverPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateAudioFile(file);
      if (error) {
        setErrors({ ...errors, audio: error });
      } else {
        setAudioFile(file);
        setErrors({ ...errors, audio: undefined });
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
      }
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        setErrors({ ...errors, cover: error });
      } else {
        setCoverFile(file);
        setErrors({ ...errors, cover: undefined });
        const reader = new FileReader();
        reader.onload = (e) => setCoverPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: FormErrors = {};
    if (!audioFile) newErrors.audio = 'Audio file is required';
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!genre) newErrors.genre = 'Genre is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('audio', audioFile!);
    if (coverFile) formData.append('cover', coverFile);

    uploadMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className={styles.error}>
        <h2>Please sign in to upload tracks</h2>
      </div>
    );
  }

  return (
    <div className={styles.upload}>
      <h1 className={styles.title}>Upload Track</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.column}>
            <div
              className={`${styles.dropzone} ${isDraggingAudio ? styles.dragging : ''} ${
                audioFile ? styles.hasFile : ''
              }`}
              onDrop={handleAudioDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingAudio(true);
              }}
              onDragLeave={() => setIsDraggingAudio(false)}
              onClick={() => audioInputRef.current?.click()}
            >
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                onChange={handleAudioSelect}
                style={{ display: 'none' }}
              />
              {audioFile ? (
                <div className={styles.fileInfo}>
                  <Music size={48} />
                  <p className={styles.fileName}>{audioFile.name}</p>
                  <p className={styles.fileSize}>
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAudioFile(null);
                    }}
                  >
                    <X size={16} />
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <UploadIcon size={48} />
                  <p className={styles.dropzoneText}>
                    Drag & drop audio file or click to browse
                  </p>
                  <p className={styles.dropzoneHint}>MP3, WAV, FLAC (max 100MB)</p>
                </>
              )}
            </div>
            {errors.audio && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors.audio}
              </div>
            )}

            {uploadMutation.isPending && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} />
                <span className={styles.progressText}>{uploadProgress}%</span>
              </div>
            )}
          </div>

          <div className={styles.column}>
            <div
              className={`${styles.coverDropzone} ${isDraggingCover ? styles.dragging : ''}`}
              onDrop={handleCoverDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingCover(true);
              }}
              onDragLeave={() => setIsDraggingCover(false)}
              onClick={() => coverInputRef.current?.click()}
            >
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverSelect}
                style={{ display: 'none' }}
              />
              {coverPreview ? (
                <div className={styles.coverPreview}>
                  <img src={coverPreview} alt="Cover preview" />
                  <button
                    type="button"
                    className={styles.removeCoverBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCoverFile(null);
                      setCoverPreview(null);
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Image size={48} />
                  <p className={styles.coverText}>Add cover image</p>
                  <p className={styles.coverHint}>JPG, PNG (max 5MB)</p>
                </>
              )}
            </div>
            {errors.cover && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors.cover}
              </div>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter track title"
          />
          {errors.title && (
            <div className={styles.errorMessage}>
              <AlertCircle size={16} />
              {errors.title}
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your track..."
            rows={4}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Genre <span className={styles.required}>*</span>
            </label>
            <select
              className={styles.select}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            {errors.genre && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errors.genre}
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tags</label>
            <input
              type="text"
              className={styles.input}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="electronic, chill, ambient"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className={styles.checkbox}
            />
            Make this track public
          </label>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate(-1)}
            disabled={uploadMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={!audioFile || uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : 'Upload Track'}
          </button>
        </div>
      </form>
    </div>
  );
};
