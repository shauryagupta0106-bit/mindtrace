"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useThoughts } from "@/hooks/useThoughts";
import { ThoughtEditor } from "@/components/features/thoughts/ThoughtEditor";
import { VoiceRecorderButton } from "@/components/voice/VoiceRecorderButton";
import { LiveTranscriptDisplay } from "@/components/voice/LiveTranscriptDisplay";
import { VoiceToThoughtProcessor } from "@/components/voice/VoiceToThoughtProcessor";
import { Card } from "@/components/ui/Card";

export default function NewThoughtPage() {
  const router = useRouter();
  const { createThought } = useThoughts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createThought(data);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleVoiceProcess = (transcript: string) => {
    setVoiceTranscript(transcript);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Trace New Thought</h1>
        <p className="text-text-muted">Speak or type to record your neural patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <ThoughtEditor
              voiceTranscript={voiceTranscript}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="flex flex-col items-center py-10">
            <h3 className="text-sm font-bold font-heading uppercase tracking-widest text-text-muted mb-8">Voice Input</h3>
            <VoiceRecorderButton />
          </Card>
          <LiveTranscriptDisplay />
          <VoiceToThoughtProcessor onProcess={handleVoiceProcess} />
        </div>
      </div>
    </div>
  );
}
