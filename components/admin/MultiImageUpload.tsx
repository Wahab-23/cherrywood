"use client";
import { useState, useRef, useCallback, DragEvent } from "react";
import { X, Plus, Loader2, Star, RefreshCw, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

// ─── Types ────────────────────────────────────────────────────────────────────

type SingleProps = {
    mode: "single";
    value: string | null;
    onChange: (url: string | null) => void;
    hint?: string;
    uploadPath?: string;
};

type MultiProps = {
    mode: "multi";
    value: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    uploadPath?: string;
};

type ImageUploadProps = SingleProps | MultiProps;

// ─── Shared utils ─────────────────────────────────────────────────────────────

function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) return `${file.name}: unsupported type`;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return `${file.name}: exceeds ${MAX_SIZE_MB}MB`;
    return null;
}

async function uploadOne(file: File, path: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.url as string;
}

// ─── Single mode ─────────────────────────────────────────────────────────────

function SingleUpload({ value, onChange, hint, uploadPath = "general" }: Omit<SingleProps, "mode">) {
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const upload = useCallback(async (file: File) => {
        const err = validateFile(file);
        if (err) { toast.error(err); return; }

        setUploading(true);
        setProgress(30);
        try {
            const url = await uploadOne(file, uploadPath);
            setProgress(100);
            onChange(url);
            setTimeout(() => setProgress(0), 400);
        } catch (e: any) {
            toast.error(e.message);
            setProgress(0);
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    }, [onChange, uploadPath]);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) upload(file);
    };

    return (
        <div className="space-y-2">
            <div
                className={[
                    "relative w-full aspect-video rounded-xl overflow-hidden border transition-all cursor-pointer",
                    isDragging ? "border-foreground/40 bg-muted/20" : "border-dashed border-border/50 bg-muted/10 hover:bg-muted/20 hover:border-border/70",
                    value ? "border-solid border-border/30" : "",
                ].join(" ")}
                onClick={() => !uploading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                aria-label={value ? "Replace image" : "Upload image"}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            >
                {value ? (
                    <>
                        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                        {/* hover overlay */}
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/45 transition-all flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/15 border border-white/30 text-white text-xs"
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                            >
                                <RefreshCw className="w-3 h-3" /> Replace
                            </button>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/15 border border-white/30 text-white text-xs"
                                onClick={(e) => { e.stopPropagation(); onChange(null); }}
                            >
                                <Trash2 className="w-3 h-3" /> Remove
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        {uploading
                            ? <Loader2 className="w-7 h-7 animate-spin text-muted-foreground" />
                            : <ImageIcon className="w-7 h-7 text-muted-foreground/50" />
                        }
                        <span className="text-xs text-muted-foreground font-mono">
                            {uploading ? "uploading…" : "click or drag to upload"}
                        </span>
                    </div>
                )}
            </div>

            {/* Progress */}
            {progress > 0 && (
                <div className="h-px w-full bg-border/20 rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
            )}

            <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] text-muted-foreground/50">
                    {hint ?? `jpg · png · webp · max ${MAX_SIZE_MB}mb`}
                </p>
                <span className="font-mono text-[11px] text-muted-foreground/50">
                    {value ? "1 image" : "no image"}
                </span>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
            />
        </div>
    );
}

// ─── Multi mode ───────────────────────────────────────────────────────────────

function MultiUpload({ value, onChange, maxImages = 50, uploadPath = "general" }: Omit<MultiProps, "mode">) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFiles = useCallback(async (files: File[]) => {
        const valid: File[] = [];
        for (const f of files) {
            const err = validateFile(f);
            if (err) toast.error(err);
            else valid.push(f);
        }
        if (!valid.length) return;

        const remaining = maxImages - value.length;
        if (valid.length > remaining) {
            toast.error(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed`);
            valid.splice(remaining);
        }
        if (!valid.length) return;

        setUploading(true);
        setProgress(0);

        let done = 0;
        const results = await Promise.allSettled(
            valid.map(async (file) => {
                const url = await uploadOne(file, uploadPath);
                setProgress(Math.round((++done / valid.length) * 95));
                return url;
            })
        );

        const newUrls: string[] = [];
        results.forEach((r, i) => {
            if (r.status === "fulfilled") newUrls.push(r.value);
            else toast.error(`${valid[i].name}: ${(r.reason as Error)?.message ?? "failed"}`);
        });

        onChange([...value, ...newUrls]);
        setProgress(100);
        setTimeout(() => setProgress(0), 400);
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
    }, [value, onChange, maxImages, uploadPath]);

    const removeImage = (index: number) => onChange(value.filter((_, i) => i !== index));

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        uploadFiles(Array.from(e.dataTransfer.files));
    };

    return (
        <div className="space-y-3">
            <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Images</span>
                <span className="font-mono text-[11px] text-muted-foreground/60">{value.length} / {maxImages}</span>
            </div>

            <div
                className={`grid grid-cols-3 sm:grid-cols-4 gap-2 transition-opacity ${isDragging ? "opacity-60" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
            >
                {value.map((url, i) => (
                    <div key={url + i} className="relative aspect-square rounded-lg overflow-hidden border border-border/40 group">
                        <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
                        {i === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/65 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm">
                                <Star className="w-2 h-2 fill-white" /> primary
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => removeImage(i)}
                            aria-label={`Remove image ${i + 1}`}
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {value.length < maxImages && (
                    <button
                        type="button"
                        disabled={uploading}
                        onClick={() => inputRef.current?.click()}
                        aria-label="Add images"
                        className="aspect-square flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/50 hover:border-border/80 hover:bg-muted/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {uploading
                            ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                            : <Plus className="w-5 h-5 text-muted-foreground" />
                        }
                        <span className="font-mono text-[10px] text-muted-foreground">
                            {uploading ? "uploading…" : "add files"}
                        </span>
                    </button>
                )}
            </div>

            {progress > 0 && (
                <div className="h-px w-full bg-border/20 rounded-full overflow-hidden">
                    <div className="h-full bg-foreground rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
            )}

            <p className="font-mono text-[11px] text-muted-foreground/50">
                first = primary · drag & drop · max {MAX_SIZE_MB}mb per file
            </p>

            <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={(e) => uploadFiles(Array.from(e.target.files ?? []))}
            />
        </div>
    );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export default function ImageUpload(props: ImageUploadProps) {
    if (props.mode === "single") {
        const { mode, ...rest } = props;
        return <SingleUpload {...rest} />;
    }
    const { mode, ...rest } = props;
    return <MultiUpload {...rest} />;
}