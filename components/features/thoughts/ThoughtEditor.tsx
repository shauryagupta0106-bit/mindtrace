"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { EmotionSelector } from "./EmotionSelector";
import { TagInput } from "./TagInput";
import { PredictionPanel } from "./PredictionPanel";

const thoughtSchema = z.object({
  title: z.string().min(1, "Title is required"),
  context: z.string().min(10, "Tell us more about what's on your mind"),
  emotion: z.string().min(1, "Please select an emotion"),
  intensity: z.number().min(1).max(10),
  tags: z.array(z.string()),
  prediction: z.string().optional(),
  evidence: z.array(z.object({ url: z.string(), type: z.string() })).default([]),
});

type ThoughtFormValues = z.infer<typeof thoughtSchema>;

interface ThoughtEditorProps {
  initialData?: Partial<ThoughtFormValues>;
  voiceTranscript?: string;
  onSubmit: (data: ThoughtFormValues) => Promise<void>;
  isSubmitting: boolean;
}

import { EvidenceUploader } from "./EvidenceUploader";
import { useEffect } from "react";

export function ThoughtEditor({ initialData, voiceTranscript, onSubmit, isSubmitting }: ThoughtEditorProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ThoughtFormValues>({
    resolver: zodResolver(thoughtSchema),
    defaultValues: {
      title: initialData?.title || "",
      context: initialData?.context || "",
      emotion: initialData?.emotion || "neutral",
      intensity: initialData?.intensity || 5,
      tags: initialData?.tags || [],
      prediction: initialData?.prediction || "",
      evidence: [],
    },
  });

  useEffect(() => {
    if (voiceTranscript) {
      const currentContext = watch("context");
      setValue("context", currentContext ? `${currentContext}\n\n${voiceTranscript}` : voiceTranscript);
    }
  }, [voiceTranscript, setValue]);

  const emotion = watch("emotion");
  const tags = watch("tags");
  const evidence = watch("evidence") || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted">Title</label>
        <Input {...register("title")} placeholder="What's this thought about?" />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted">Context</label>
        <textarea
          {...register("context")}
          rows={5}
          className="flex w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple input-glow"
          placeholder="Describe your thoughts in detail..."
        />
        {errors.context && <p className="text-xs text-red-500">{errors.context.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted">Emotion & Intensity</label>
          <EmotionSelector
            value={emotion}
            onChange={(val) => setValue("emotion", val)}
          />
          <div className="pt-2">
            <input
              type="range"
              min="1"
              max="10"
              {...register("intensity", { valueAsNumber: true })}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-purple"
            />
            <div className="flex justify-between text-[10px] text-text-muted mt-2">
              <span>Mild</span>
              <span>Intense</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold font-heading uppercase tracking-wider text-text-muted">Metadata</label>
          <TagInput
            tags={tags}
            onChange={(newTags) => setValue("tags", newTags)}
          />
          <EvidenceUploader
            files={evidence}
            onUploadComplete={(url, type) => setValue("evidence", [...evidence, { url, type }])}
            onRemove={(url) => setValue("evidence", evidence.filter(f => f.url !== url))}
          />
        </div>
      </div>

      <PredictionPanel
        context={watch("context")}
        onPredictionGenerated={(pred) => setValue("prediction", pred)}
      />

      <div className="pt-4">
        <Button type="submit" className="w-full h-12 text-lg font-bold" disabled={isSubmitting}>
          {isSubmitting ? <Spinner className="mr-2" /> : null}
          Commit to Neural Bank
        </Button>
      </div>
    </form>
  );
}
