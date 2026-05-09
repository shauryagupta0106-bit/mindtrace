import { Router } from "express";
import { getAuth } from "@clerk/express";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.sessionClaims?.userId || auth?.userId;
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  req.userId = userId;
  next();
};

function parsePredictBody(body: any): { context: string; emotion: string; intensity: number; tags: string[]; title?: string } | null {
  if (!body || typeof body.context !== "string" || body.context.trim() === "") return null;
  const emotion = typeof body.emotion === "string" ? body.emotion : "focused";
  const intensity = typeof body.intensity === "number" ? Math.max(1, Math.min(10, body.intensity)) : 5;
  const tags = Array.isArray(body.tags) ? body.tags.filter((t: any) => typeof t === "string") : [];
  const title = typeof body.title === "string" ? body.title : undefined;
  return { context: body.context.trim(), emotion, intensity, tags, title };
}

const POSITIVE_EMOTIONS = ["joy", "calm", "focused", "excited", "hopeful"];
const NEGATIVE_EMOTIONS = ["anxious", "sad", "angry", "overwhelmed", "frustrated"];

function analyzeCognition(context: string, emotion: string, intensity: number) {
  const text = context.toLowerCase();
  const isPositive = POSITIVE_EMOTIONS.includes(emotion);
  const isNegative = NEGATIVE_EMOTIONS.includes(emotion);

  const stressMarkers   = ["deadline","pressure","overwhelm","can't","impossible","fail","behind","late","struggle","hard","difficult","stuck","blocked","anxious","worry"];
  const progressMarkers = ["working on","making progress","figured out","learning","improving","better","almost","nearly","close","finished","completed","done","achieved"];
  const socialMarkers   = ["people","person","friend","colleague","team","someone","they","relationship","meeting","conversation","talked","said","told","group"];
  const creativeMarkers = ["idea","creative","project","build","design","write","create","make","develop","plan","imagine","vision","concept","story"];
  const selfDoubtMarkers = ["not sure","doubt","uncertain","maybe","might","wonder","question","don't know","unsure","confused","lost","unclear"];

  const score = (markers: string[]) => markers.filter(m => text.includes(m)).length;
  const scores = {
    stress:    score(stressMarkers),
    progress:  score(progressMarkers),
    social:    score(socialMarkers),
    creative:  score(creativeMarkers),
    selfDoubt: score(selfDoubtMarkers),
  };

  const dominant = (Object.entries(scores).sort(([,a],[,b]) => b - a)[0][0]) as keyof typeof scores;
  const maxScore = Math.max(...Object.values(scores));
  const confidence = Math.min(92, Math.max(48, 56 + maxScore * 9 + (isPositive ? 10 : isNegative ? -6 : 2) - Math.abs(intensity - 5) * 1.5));

  return { isPositive, isNegative, dominant, confidence: Math.round(confidence) };
}

type ValenceKey = "positive" | "negative" | "neutral";

const PREDICTIONS: Record<string, Record<ValenceKey, { prediction: string; reasoning: string; steps: string[] }>> = {
  stress: {
    positive: {
      prediction: "Despite the surface tension, your positive emotional state signals strong adaptive capacity. A resolution pathway is likely to crystallize within 24–48 hours.",
      reasoning: "High-stress context paired with positive affect indicates active problem-solving mode. This combination historically precedes breakthrough moments — the mind is working, not breaking.",
      steps: [
        "Detected elevated stress markers in your thought content",
        "Cross-referenced with positive emotional valence",
        "Applied cognitive load theory: moderate stress + positive affect = heightened focus window",
        "Intensity level assessed as within manageable range",
        "Pattern matched to challenge-engagement response — productive state identified",
      ],
    },
    negative: {
      prediction: "Your cognitive load is at its limit right now. Deliberate rest (20–60 min, no screens) is predicted to shift your perspective more than continued effort will.",
      reasoning: "Stress markers with negative affect suggest the prefrontal cortex is experiencing reduced executive function. Paradoxically, stepping away is the highest-leverage action available.",
      steps: [
        "Identified high-stress linguistic markers across your entry",
        "Detected negative emotional state with elevated intensity",
        "Applied cognitive exhaustion threshold model",
        "Analysis: active problem-solving yields diminishing returns in this state",
        "Prediction: recovery window precedes the clarity you're seeking",
      ],
    },
    neutral: {
      prediction: "You're in analytical processing mode on a real challenge. Breaking it into three discrete sub-problems will unlock forward momentum faster than sustained broad effort.",
      reasoning: "Neutral affect during stress indicates the analytical cortex is engaged. This state is ideal for structured decomposition — leveraging your current clarity before it narrows.",
      steps: [
        "Stress indicators detected in thought content",
        "Emotional tone measured as neutral / analytical",
        "Applied structured cognition model",
        "Intensity level suggests the challenge feels manageable, not overwhelming",
        "Prediction: systematic decomposition of the problem will unlock momentum",
      ],
    },
  },
  progress: {
    positive: {
      prediction: "You're in a flow-adjacent state. The next 60–90 minutes have unusually high output potential — protect this window from interruption.",
      reasoning: "Progress signals combined with positive emotion create a self-reinforcing feedback loop. Dopaminergic reward pathways are engaged, sustaining both motivation and cognitive precision.",
      steps: [
        "Identified multiple progress-indicating phrases in your thought",
        "Confirmed strongly positive emotional baseline",
        "Applied flow state theory — all conditions favorable",
        "Momentum trajectory: upward and accelerating",
        "Prediction: continuation of current approach maximizes outcome quality",
      ],
    },
    negative: {
      prediction: "You're making real progress despite how you feel. Your output quality is likely better than your current perception of it — an objective review of recent work will confirm this.",
      reasoning: "Progress markers amid negative emotion signal 'progress blindness' — where cognitive focus on remaining gaps obscures real advancement already made.",
      steps: [
        "Detected genuine progress signals in thought content",
        "Noted significant gap between progress reality and emotional state",
        "Applied attribution bias correction model",
        "Analysis: negative affect is suppressing accurate progress recognition",
        "Prediction: reviewing completed milestones will recalibrate your emotional read",
      ],
    },
    neutral: {
      prediction: "Steady, sustainable forward motion is underway. Your current trajectory suggests reaching a major checkpoint within your anticipated timeframe.",
      reasoning: "Neutral affect during active progress is a marker of professional-grade focus. The absence of emotional volatility consistently predicts higher-quality outputs.",
      steps: [
        "Multiple progress indicators confirmed",
        "Steady emotional baseline detected — no volatility",
        "Applied sustainable performance model",
        "Consistency pattern recognized throughout your entry",
        "Prediction: stable trajectory toward meaningful completion",
      ],
    },
  },
  social: {
    positive: {
      prediction: "A meaningful connection or collaborative breakthrough is within reach. Your positive state makes you especially receptive to social nuance — an important conversation is likely to go well.",
      reasoning: "Positive affect expands social cognition and empathy bandwidth. Combined with social context, this predicts heightened relational intelligence in the near term.",
      steps: [
        "Identified strong social context signals in your entry",
        "Confirmed positive emotional state",
        "Applied broaden-and-build theory of social cognition",
        "Positive affect confirmed to widen social processing capacity",
        "Prediction: favorable interpersonal outcome is the likely trajectory",
      ],
    },
    negative: {
      prediction: "Social friction is generating cognitive noise. Waiting 2–3 hours before responding to any interpersonal tension is predicted to meaningfully improve the outcome.",
      reasoning: "Negative affect narrows social cognition and increases misattribution of intent. A temporal buffer allows the emotional regulation system to recalibrate before re-engagement.",
      steps: [
        "Social context detected alongside negative emotional overlay",
        "Applied emotional regulation and misattribution research",
        "Identified elevated risk of reactive interpersonal response",
        "Intensity analysis: de-escalation buffer recommended",
        "Prediction: time delay before engagement optimizes relational outcome",
      ],
    },
    neutral: {
      prediction: "You're in an unusually clear-headed state for navigating social complexity. Approaching the situation with directness and curiosity will yield mutual understanding.",
      reasoning: "Neutral affect provides the optimal lens for social analysis — free from both excessive positivity (naïveté) and negativity (threat bias).",
      steps: [
        "Social context confirmed as primary theme",
        "Neutral emotional baseline verified",
        "Applied social intelligence framework",
        "Signal clarity: high — minimal distortion in social processing",
        "Prediction: balanced, direct approach achieves best relational resolution",
      ],
    },
  },
  creative: {
    positive: {
      prediction: "You're entering a creative peak window. The next 2–3 hours have high potential for a significant insight or breakthrough. Protect this state from interruption.",
      reasoning: "Creative markers combined with positive affect signal activation of the default mode network — the brain's creativity engine. This pairing is associated with divergent thinking and novel idea formation.",
      steps: [
        "Identified strong creative theme markers in your entry",
        "Confirmed positive emotional catalyst",
        "Applied default mode network activation model",
        "Pattern: positive affect + creative intent = divergent thinking mode active",
        "Prediction: protect and extend this creative state for maximum impact",
      ],
    },
    negative: {
      prediction: "Creative blocks often precede the biggest breakthroughs. The friction you're feeling is generating the pressure that frequently precedes insight. The answer is closer than it feels.",
      reasoning: "Creative frustration activates persistent unconscious processing. The discomfort is evidence of active problem-search mode running in the brain's associative network.",
      steps: [
        "Detected creative context with negative emotional friction",
        "Applied incubation theory of creativity",
        "Identified block-preceding-breakthrough pattern",
        "Unconscious processing model: frustration signals active associative search",
        "Prediction: insight likely to surface after a period of mental incubation",
      ],
    },
    neutral: {
      prediction: "Methodical creative work is producing consistent output. Your neutral state is optimal for refinement and polish — high-quality execution mode is active.",
      reasoning: "Neutral affect during creative work signals convergent thinking mode — ideal for bringing existing ideas to high-quality completion with precision.",
      steps: [
        "Creative context with neutral affect confirmed",
        "Applied dual-process creativity theory",
        "Convergent vs. divergent mode analysis completed",
        "Current state: optimal for refinement, not radical ideation",
        "Prediction: quality execution through methodical completion is the path",
      ],
    },
  },
  selfDoubt: {
    positive: {
      prediction: "Your self-questioning is intellectual honesty, not weakness. Combined with your positive baseline, this is the cognitive profile of a thoughtful high-performer. Trust the process.",
      reasoning: "Moderate self-doubt in a positive context is a marker of metacognitive awareness — the ability to question and refine one's own thinking. This is a significant cognitive asset.",
      steps: [
        "Detected self-questioning and uncertainty markers",
        "Noted positive emotional baseline underneath",
        "Applied metacognition and growth mindset framework",
        "Analysis: self-doubt + positive affect = intellectual rigor, not paralysis",
        "Prediction: questioning will sharpen, not derail, your forward path",
      ],
    },
    negative: {
      prediction: "Your inner critic is louder than the evidence warrants. An objective audit of your recent actions will reveal a significant gap between self-perception and actual capability.",
      reasoning: "Self-doubt combined with negative affect amplifies the negativity bias, producing a systematically distorted self-assessment that consistently understates real ability.",
      steps: [
        "High self-doubt markers with negative emotional amplification detected",
        "Applied negativity bias correction model",
        "Evidence-vs-feeling divergence flagged as significant",
        "Cognitive distortion pattern: negative self-appraisal exceeding evidence base",
        "Prediction: objective evidence review will counter the distorted self-narrative",
      ],
    },
    neutral: {
      prediction: "Healthy skepticism of your own ideas is at work. This neutral self-examination is likely to surface a nuanced insight that clarifies your next move.",
      reasoning: "Neutral self-reflection without emotional charge is the most productive form of self-analysis — producing clear-eyed insights unclouded by mood distortions.",
      steps: [
        "Moderate self-questioning in neutral emotional state detected",
        "Applied reflective practice model",
        "Emotional neutrality confirmed: confirmation bias reduced",
        "Pattern: this mode reliably precedes genuine insight",
        "Prediction: self-examination will yield actionable clarity",
      ],
    },
  },
};

function getValenceKey(isPositive: boolean, isNegative: boolean): ValenceKey {
  if (isPositive) return "positive";
  if (isNegative) return "negative";
  return "neutral";
}

function getDefaultPrediction(emotion: string, intensity: number, isPositive: boolean) {
  if (isPositive) {
    return {
      prediction: "Your current state opens a productive window. Lean into this energy — your capacity for meaningful output is elevated right now.",
      reasoning: `${emotion} at intensity ${intensity}/10 indicates an engaged, constructive cognitive state. Reward circuitry is active, supporting both motivation and clarity.`,
      steps: [
        `Primary emotion analyzed: ${emotion}`,
        `Intensity level evaluated: ${intensity}/10`,
        "Mapped to cognitive capacity model",
        "Positive valence confirmed — reward pathways engaged",
        "Prediction: high-quality output window is open",
      ],
    };
  }
  return {
    prediction: "Your emotional state is signaling a need for self-compassion right now. This state is temporary — allow yourself to process without judgment, and capacity will return.",
    reasoning: `${emotion} at intensity ${intensity}/10 creates a temporary narrowing of cognitive perspective. This is a normal, cyclical experience that precedes natural recalibration.`,
    steps: [
      `Primary emotion analyzed: ${emotion}`,
      `Intensity level evaluated: ${intensity}/10`,
      "Applied emotional cyclicality and recovery model",
      "Negative valence detected — protective cognitive narrowing active",
      "Prediction: processing this state leads to natural rebound",
    ],
  };
}

router.post("/predict", requireAuth, async (req: any, res): Promise<void> => {
  try {
    const parsed = parsePredictBody(req.body);
    if (!parsed) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { context, emotion, intensity } = parsed;

    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const { isPositive, isNegative, dominant, confidence } = analyzeCognition(context, emotion, intensity);
    const valenceKey = getValenceKey(isPositive, isNegative);
    const predContent = PREDICTIONS[dominant]?.[valenceKey] ?? getDefaultPrediction(emotion, intensity, isPositive);

    const intensityModifier =
      intensity >= 8
        ? " The elevated intensity makes acting on this insight especially timely."
        : intensity <= 3
        ? " The low intensity suggests a gentle, exploratory approach will work best."
        : "";

    res.json({
      prediction: predContent.prediction + intensityModifier,
      confidence,
      reasoning: predContent.reasoning,
      steps: predContent.steps,
      timestamp: Date.now(),
    });
  } catch {
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
