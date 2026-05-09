import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, AlertCircle, Plus, X,
  BrainCircuit, Sparkles, Cpu, ChevronDown, ChevronUp,
  CheckCircle2, Loader2, Zap,
} from "lucide-react";
import {
  useCreateThought,
  getListThoughtsQueryKey,
  getGetDashboardSummaryQueryKey,
  getGetTimelineQueryKey,
  getGetAnalyticsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { EMOTIONS } from "@/lib/emotion-utils";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface PredictionResult {
  prediction: string;
  confidence: number;
  reasoning: string;
  steps: string[];
  timestamp: number;
}

export default function NewThoughtPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [emotion, setEmotion] = useState("focused");
  const [intensity, setIntensity] = useState(5);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [stepsExpanded, setStepsExpanded] = useState(false);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setVoiceSupported(false);
    }
  }, []);

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (e: any) => {
      let final = "", interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      if (final) setTranscript((p) => p + final + " ");
      setInterimTranscript(interim);
    };
    recognition.onend = () => { setIsListening(false); setInterimTranscript(""); };
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const applyTranscript = () => {
    if (transcript.trim()) {
      setContext((p) => (p ? p + " " + transcript.trim() : transcript.trim()));
      setTranscript("");
    }
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t) && tags.length < 8) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handlePredict = async () => {
    if (!context.trim()) {
      toast({ title: "Add some context first", description: "Tell us what's on your mind before predicting.", variant: "destructive" });
      return;
    }
    setIsPredicting(true);
    setPredictionResult(null);
    setVisibleSteps(0);
    setStepsExpanded(false);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ context, emotion, intensity, tags, title }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      const data: PredictionResult = await res.json();
      setPredictionResult(data);

      let step = 0;
      const interval = setInterval(() => {
        step++;
        setVisibleSteps(step);
        if (step >= data.steps.length) clearInterval(interval);
      }, 280);
    } catch {
      toast({ title: "Prediction failed", description: "Could not generate prediction. Try again.", variant: "destructive" });
    } finally {
      setIsPredicting(false);
    }
  };

  const createThought = useCreateThought({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListThoughtsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTimelineQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAnalyticsQueryKey() });
        queryClient.invalidateQueries({ queryKey: ['/api/analytics/dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['/api/thoughts'] });
        toast({ title: "Trace saved ✨", description: "Your thought and prediction have been saved." });
        navigate("/thoughts");
      },
      onError: () => toast({ title: "Error", description: "Failed to save. Please try again.", variant: "destructive" }),
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !context.trim()) {
      toast({ title: "Fill in the required fields", description: "Title and content are required.", variant: "destructive" });
      return;
    }
    createThought.mutate({
      data: {
        title: title.trim(),
        context: context.trim(),
        emotion,
        intensity,
        tags,
        prediction: predictionResult?.prediction?.trim() || undefined,
      },
    });
  };

  const selectedEmotion = EMOTIONS.find((e) => e.id === emotion);
  const intensityLabel = intensity <= 2 ? "Very Low" : intensity <= 4 ? "Low" : intensity <= 6 ? "Moderate" : intensity <= 8 ? "High" : "Very High";
  const intensityColor = intensity <= 3 ? "text-sky-400" : intensity <= 6 ? "text-amber-400" : "text-red-400";

  const confidenceColor =
    (predictionResult?.confidence ?? 0) >= 80
      ? "from-emerald-500 to-teal-400"
      : (predictionResult?.confidence ?? 0) >= 60
      ? "from-primary to-violet-400"
      : "from-amber-500 to-orange-400";

  const confidenceLabel =
    (predictionResult?.confidence ?? 0) >= 80 ? "High confidence" :
    (predictionResult?.confidence ?? 0) >= 60 ? "Moderate confidence" : "Low confidence";

  return (
    <div className="max-w-2xl mx-auto pb-10">

      {/* ── Page Header ── */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-[hsl(330_80%_68%/0.2)] border border-primary/30 flex items-center justify-center shadow-[0_0_20px_hsl(250_82%_70%/0.3),0_0_8px_hsl(330_80%_68%/0.2)]">
            <BrainCircuit className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">New Trace</h1>
            <p className="text-sm text-muted-foreground">Capture what's on your mind · get AI cognitive prediction</p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* ── Title ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <label className="block text-sm font-medium mb-2">
            Title <span className="text-destructive">*</span>
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's this thought about?"
            className="h-12 bg-card border-card-border focus:border-primary/50 focus:ring-2 focus:ring-primary/15 text-base rounded-xl"
            required
          />
        </motion.div>

        {/* ── Content + Voice ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">
              What's on your mind? <span className="text-destructive">*</span>
            </label>
            {voiceSupported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                  isListening
                    ? "bg-destructive/20 text-red-400 border border-red-500/40 voice-active"
                    : "bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20"
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isListening ? "Stop recording" : "Voice input"}
              </button>
            )}
          </div>
          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe your thoughts in detail..."
            rows={5}
            className="bg-card border-card-border focus:border-primary/50 focus:ring-2 focus:ring-primary/15 resize-none rounded-xl text-sm leading-relaxed"
            required
          />

          <AnimatePresence>
            {(transcript || interimTranscript) && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="mt-3 glass-card p-4 rounded-xl"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                      Voice transcript
                    </p>
                    <p className="text-sm">
                      {transcript}
                      <span className="text-muted-foreground/60 italic">{interimTranscript}</span>
                    </p>
                  </div>
                  <Button type="button" size="sm" onClick={applyTranscript} className="hero-btn border-0 text-white shrink-0 text-xs h-7 px-3">
                    Apply
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!voiceSupported && (
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <AlertCircle className="w-3.5 h-3.5" />
              Voice input not supported in this browser.
            </div>
          )}
        </motion.div>

        {/* ── Emotion Picker ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <label className="block text-sm font-medium mb-3">How are you feeling?</label>
          <div className="grid grid-cols-5 gap-2">
            {EMOTIONS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setEmotion(e.id)}
                className={`emotion-btn ${emotion === e.id ? "selected" : ""}`}
              >
                <span className="text-xl leading-none">{e.emoji}</span>
                <span className={`text-[10px] font-medium leading-none ${emotion === e.id ? "text-primary" : "text-muted-foreground"}`}>
                  {e.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Intensity ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">Intensity</label>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${intensityColor}`}>{intensity}</span>
              <span className={`text-xs ${intensityColor}`}>— {intensityLabel}</span>
            </div>
          </div>
          <div className="px-1">
            <Slider value={[intensity]} min={1} max={10} step={1} onValueChange={([v]) => setIntensity(v)} className="w-full" />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Barely felt</span>
            <span>Overwhelming</span>
          </div>
        </motion.div>

        {/* ── Tags ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add a tag and press Enter"
              className="h-10 bg-card border-card-border focus:border-primary/50 rounded-xl text-sm"
            />
            <Button type="button" size="sm" variant="outline" onClick={addTag} className="h-10 px-3 rounded-xl border-card-border shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <AnimatePresence>
            {tags.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/12 border border-primary/25 text-primary text-xs font-medium"
                  >
                    {tag}
                    <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-red-400 transition-colors">
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </motion.span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── AI Cognitive Prediction ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">

          {/* Header + trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-pink-500/25 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5" style={{ color: "hsl(330 80% 68%)" }} />
              </div>
              <span className="text-sm font-medium">AI Cognitive Prediction</span>
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded-full bg-muted border border-card-border">optional</span>
            </div>
            <button
              type="button"
              onClick={handlePredict}
              disabled={isPredicting || !context.trim()}
              className="ai-btn flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPredicting ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" />Analyzing…</>
              ) : (
                <><Zap className="w-3.5 h-3.5" />Predict</>
              )}
            </button>
          </div>

          {/* Loading state — steps appearing */}
          <AnimatePresence>
            {isPredicting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-[hsl(330_70%_60%/0.2)] bg-gradient-to-br from-card via-card to-[hsl(330_80%_68%/0.04)] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500/30 to-pink-500/30 border border-pink-500/30 flex items-center justify-center">
                        <BrainCircuit className="w-3.5 h-3.5" style={{ color: "hsl(330 80% 68%)" }} />
                      </div>
                      <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[hsl(330_80%_68%)] animate-ping opacity-75" />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "hsl(330 80% 72%)" }}>Cognitive analysis in progress</span>
                  </div>
                  <div className="space-y-2.5">
                    {["Parsing emotional context…", "Mapping cognitive patterns…", "Applying psychological models…", "Generating prediction…", "Calculating confidence…"].map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.18 }}
                        className="flex items-center gap-2.5"
                      >
                        <div className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                          style={{
                            borderColor: "hsl(330 70% 60% / 0.4)",
                            background: "hsl(330 80% 68% / 0.08)",
                          }}>
                          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "hsl(330 80% 68%)" }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prediction result card */}
          <AnimatePresence>
            {predictionResult && !isPredicting && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className="rounded-2xl pink-glow-card bg-gradient-to-br from-card via-card to-[hsl(330_80%_68%/0.06)] overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="h-[2px] w-full bg-gradient-to-r from-violet-500 via-pink-500 to-rose-400" />

                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-violet-500/25 to-pink-500/25 border border-pink-500/30 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5" style={{ color: "hsl(330 80% 68%)" }} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "hsl(330 80% 72%)" }}>
                        Cognitive Prediction
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400 font-semibold">Trace will be saved</span>
                    </div>
                  </div>

                  {/* Confidence meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">{confidenceLabel}</span>
                      <span className="text-sm font-bold" style={{ color: "hsl(330 80% 72%)" }}>
                        {predictionResult.confidence}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${predictionResult.confidence}%` }}
                        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${confidenceColor}`}
                      />
                    </div>
                  </div>

                  {/* Prediction text */}
                  <div className="rounded-xl bg-gradient-to-br from-[hsl(330_80%_68%/0.06)] to-[hsl(280_75%_62%/0.06)] border border-[hsl(330_70%_60%/0.18)] p-4">
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      {predictionResult.prediction}
                    </p>
                  </div>

                  {/* Reasoning */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Reasoning</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {predictionResult.reasoning}
                    </p>
                  </div>

                  {/* Step-by-step — expandable */}
                  <div className="border-t border-card-border pt-3">
                    <button
                      type="button"
                      onClick={() => setStepsExpanded(!stepsExpanded)}
                      className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors mb-0"
                    >
                      {stepsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      {stepsExpanded ? "Hide" : "Show"} thought process ({predictionResult.steps.length} steps)
                    </button>

                    <AnimatePresence>
                      {stepsExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="space-y-2">
                            {predictionResult.steps.map((step, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -6 }}
                                animate={{ opacity: i < visibleSteps ? 1 : 0.3, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="flex items-start gap-2.5"
                              >
                                <div className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-pink-500/25 flex items-center justify-center shrink-0">
                                  <span className="text-[9px] font-bold" style={{ color: "hsl(330 80% 72%)" }}>{i + 1}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty state hint */}
          {!predictionResult && !isPredicting && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-muted-foreground text-center py-2"
            >
              Fill in your thought content above, then hit <span className="font-medium" style={{ color: "hsl(330 80% 68%)" }}>Predict</span> to get your AI cognitive forecast
            </motion.p>
          )}
        </motion.div>

        {/* ── Submit ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3 pt-2"
        >
          <Button
            type="submit"
            disabled={createThought.isPending}
            className="flex-1 h-12 save-btn border-0 text-white font-semibold rounded-xl flex items-center gap-2"
          >
            {createThought.isPending ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
            ) : (
              <><Sparkles className="w-4 h-4" />Save Trace{predictionResult ? " + Prediction" : ""}</>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/thoughts")}
            className="h-12 px-5 rounded-xl border-card-border text-muted-foreground hover:text-foreground"
          >
            Cancel
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
