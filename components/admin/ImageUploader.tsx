"use client";

import { useEffect, useRef, useState } from "react";
import {
  ImagePlus,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";

type ImageUploaderProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  previewClassName?: string;
  field?: string;
};

export default function ImageUploader({
  value,
  onChange,
  label,
  description,
  previewClassName = "h-40",
  field = "image",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedUrl, setSelectedUrl] =
    useState<string | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [uploadError, setUploadError] =
    useState("");

  useEffect(() => {
    return () => {
      if (selectedUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(selectedUrl);
      }
    };
  }, [selectedUrl]);

  function handleFileSelected(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    event.target.value = "";

    setUploadError("");

    if (!file) return;

    // Show an immediate preview from the chosen file.
    const preview =
      URL.createObjectURL(file);

    setSelectedUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      return preview;
    });

    uploadFile(file);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("field", field);

      const response = await fetch(
        "/api/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Upload failed."
        );
      }

      onChange(data.url as string);

      setSelectedUrl((previous) => {
        if (previous?.startsWith("blob:")) {
          URL.revokeObjectURL(previous);
        }

        return null;
      });
    } catch (err) {
      setUploadError(
        err instanceof Error
          ? err.message
          : "Upload failed. Please try again."
      );

      setSelectedUrl(null);
    } finally {
      setUploading(false);
    }
  }

  function clearError() {
    setUploadError("");
    setSelectedUrl(null);
  }

  const previewUrl = selectedUrl || value;

  return (
    <div className="rounded-2xl border border-black/10 bg-[#f8f8f6] p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black">
            {label}
          </h3>

          {description && (
            <p className="mt-1 text-[10px] leading-4 text-black/40">
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#222022] px-3.5 py-2 text-[11px] font-bold text-[#C3D809] transition hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus size={14} />
              Upload Image
            </>
          )}
        </button>
      </div>

      {/* Preview */}
      {previewUrl ? (
        <div className="relative mb-3 overflow-hidden rounded-xl border border-black/10 bg-white">
          <img
            src={previewUrl}
            alt={label}
            className={`w-full ${previewClassName} object-cover`}
          />

          {selectedUrl && (
            <button
              type="button"
              onClick={clearError}
              disabled={uploading}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 disabled:opacity-50"
              aria-label="Remove selected image"
              title="Remove selected image"
            >
              <X size={15} />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          className="mb-3 flex h-40 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 bg-white text-black/40 transition hover:border-[#C3D809]/60 hover:text-black/60 disabled:opacity-50"
        >
          <ImagePlus size={20} />

          <span className="text-xs font-semibold">
            Select an image
          </span>

          <span className="text-[10px] text-black/30">
            JPG, PNG or WebP • up to 5 MB
          </span>
        </button>
      )}

      {/* Replace button */}
      {previewUrl && !uploading && (
        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-black/50 transition hover:text-[#222022]"
        >
          <RefreshCw size={12} />
          Replace image
        </button>
      )}

      {/* Error */}
      {uploadError && (
        <p className="mb-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-semibold text-red-600">
          {uploadError}
        </p>
      )}

      {/* Manual URL fallback */}
      <input
        type="url"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Image URL"
        className="w-full rounded-xl border border-black/10 bg-white px-3 py-3 text-xs font-medium outline-none transition focus:border-[#C3D809]"
      />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        className="hidden"
      />
    </div>
  );
}
