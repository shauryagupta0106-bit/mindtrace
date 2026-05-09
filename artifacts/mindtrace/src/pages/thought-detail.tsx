import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, Edit3, Trash2, Save, X, Tag } from "lucide-react";
import {
  useGetThought,
  useUpdateThought,
  useDeleteThought,
  getGetThoughtQueryKey,
  getListThoughtsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { getEmotionDetails, EMOTIONS } from "@/lib/emotion-utils";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ThoughtDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [emotion, setEmotion] = useState("");
  const [intensity, setIntensity] = useState(5);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [prediction, setPrediction] = useState("");

  const { data: thought, isLoading } = useGetThought(id, {
    query: {
      enabled: !!id,
      queryKey: getGetThoughtQueryKey(id),
    },
  });

  useEffect(() => {
    if (thought) {
      setTitle(thought.title);
      setContext(thought.context);
      setEmotion(thought.emotion);
      setIntensity(thought.intensity);
      setTags(thought.tags || []);
      setPrediction(thought.prediction || "");
    }
  }, [thought]);

  const updateThought = useUpdateThought({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetThoughtQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListThoughtsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        setIsEditing(false);
        toast({ title: "Thought updated" });
      }
    }
  });

  const deleteThought = useDeleteThought({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListThoughtsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
        toast({ title: "Thought deleted" });
        navigate("/thoughts");
      }
    }
  });

  const handleEdit = () => {
    if (thought) {
      setTitle(thought.title);
      setContext(thought.context);
      setEmotion(thought.emotion);
      setIntensity(thought.intensity);
      setTags(thought.tags || []);
      setPrediction(thought.prediction || "");
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateThought.mutate({
      id,
      data: { title, context, emotion, intensity, tags, prediction: prediction || null }
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase().replace(/,/g, "");
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 pb-10">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!thought) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-muted-foreground">Thought not found.</p>
        <Button className="mt-4" onClick={() => navigate("/thoughts")}>
          Back to Thoughts
        </Button>
      </div>
    );
  }

  const emotionDetails = getEmotionDetails(thought.emotion);

  return (
    <div className="space-y-6 pb-10 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <Button
          variant="ghost"
          onClick={() => navigate("/thoughts")}
          className="text-muted-foreground hover:text-foreground -ml-2"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleEdit}
                className="border-white/10 hover:border-primary/30"
                data-testid="button-edit"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    data-testid="button-delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="glass-card">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Thought</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this thought from your memory.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteThought.mutate({ id })}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button
                onClick={handleSave}
                disabled={updateThought.isPending}
                className="bg-primary text-white"
                data-testid="button-save"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
                data-testid="button-cancel"
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 space-y-6"
      >
        {/* Title */}
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold bg-black/20 border-white/10 focus:border-primary/50"
            placeholder="Thought title"
            data-testid="input-title"
          />
        ) : (
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-title">
            {thought.title}
          </h1>
        )}

        <div className="text-xs text-muted-foreground">
          {format(new Date(thought.createdAt), "MMMM d, yyyy • h:mm a")}
          {thought.updatedAt !== thought.createdAt && (
            <span className="ml-2">
              (edited {format(new Date(thought.updatedAt), "MMM d")})
            </span>
          )}
        </div>

        {/* Emotion */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Emotion</p>
          {isEditing ? (
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => setEmotion(emo.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    emotion === emo.id
                      ? `bg-primary/20 border border-primary/40 text-primary`
                      : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                  }`}
                >
                  {emo.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold ${emotionDetails.color}`}>
                {emotionDetails.label}
              </span>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  style={{ width: `${(thought.intensity / 10) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-foreground/80">
                {thought.intensity}/10
              </span>
            </div>
          )}
        </div>

        {/* Intensity (edit mode) */}
        {isEditing && (
          <div>
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
              Intensity: {intensity}/10
            </p>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[intensity]}
              onValueChange={([v]) => setIntensity(v)}
              className="w-full"
              data-testid="slider-intensity"
            />
          </div>
        )}

        {/* Context */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            What was on your mind
          </p>
          {isEditing ? (
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[120px] bg-black/20 border-white/10 focus:border-primary/50"
              placeholder="Describe your thought..."
              data-testid="textarea-context"
            />
          ) : (
            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap" data-testid="text-context">
              {thought.context}
            </p>
          )}
        </div>

        {/* Tags */}
        <div>
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Tags</p>
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter"
                className="bg-black/20 border-white/10 focus:border-primary/50"
                data-testid="input-tags"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-primary/30 text-primary cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors"
                    onClick={() => setTags(tags.filter((t) => t !== tag))}
                  >
                    #{tag} <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {thought.tags.length > 0 ? (
                thought.tags.map((tag: any) => (
                  <Badge key={tag} variant="outline" className="border-white/10 text-muted-foreground">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">No tags</span>
              )}
            </div>
          )}
        </div>

        {/* Prediction */}
        {(thought.prediction || isEditing) && (
          <div className="border-t border-white/5 pt-4">
            <p className="text-xs text-accent uppercase tracking-wider mb-3">
              Cognitive Prediction
            </p>
            {isEditing ? (
              <Textarea
                value={prediction}
                onChange={(e) => setPrediction(e.target.value)}
                className="min-h-[80px] bg-black/20 border-white/10 focus:border-primary/50"
                placeholder="What outcome do you predict from this thought pattern?"
                data-testid="textarea-prediction"
              />
            ) : (
              <p className="text-sm text-accent/90 italic" data-testid="text-prediction">
                {thought.prediction}
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
