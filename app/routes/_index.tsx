import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Github,
  FileText,
  ArrowRight,
  ChevronDown,
  Headphones,
} from "lucide-react";

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [mbdProgress, setMbdProgress] = useState(0);
  const [lcmProgress, setLcmProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [podcastPlaying, setPodcastPlaying] = useState(false);
  const [podcastProgress, setPodcastProgress] = useState(0);
  const [podcastCurrentTime, setPodcastCurrentTime] = useState(0);
  const [podcastDuration, setPodcastDuration] = useState(0);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const audioRefs = useRef({});
  const podcastRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const intervalsRef = useRef({ lcm: null, mbd: null });

  const startAnimation = () => {
    if (intervalsRef.current.lcm) clearInterval(intervalsRef.current.lcm);
    if (intervalsRef.current.mbd) clearInterval(intervalsRef.current.mbd);

    setIsAnimating(true);
    setMbdProgress(0);
    setLcmProgress(0);

    const lcmDuration = 111;
    const lcmStartTime = Date.now();

    intervalsRef.current.lcm = setInterval(() => {
      const elapsed = Date.now() - lcmStartTime;
      const progress = Math.min((elapsed / lcmDuration) * 100, 100);
      setLcmProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalsRef.current.lcm);
        intervalsRef.current.lcm = null;
      }
    }, 16);

    const mbdDuration = 61837;
    const mbdStartTime = Date.now();

    intervalsRef.current.mbd = setInterval(() => {
      const elapsed = Date.now() - mbdStartTime;
      const progress = Math.min((elapsed / mbdDuration) * 100, 100);
      setMbdProgress(progress);

      if (progress >= 100) {
        clearInterval(intervalsRef.current.mbd);
        intervalsRef.current.mbd = null;
        setIsAnimating(false);
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (intervalsRef.current.lcm) clearInterval(intervalsRef.current.lcm);
      if (intervalsRef.current.mbd) clearInterval(intervalsRef.current.mbd);
    };
  }, []);

  const audioSamples = [
    {
      id: "ground-truth",
      label: "Ground Truth",
      subtitle: "24 kHz Original",
      file: "/sounds/ground_truth.wav",
      spectrogram: "/sounds/ground_truth_spec.png",
    },

    {
      id: "mbd",
      label: "MBD Teacher",
      subtitle: "61.8s inference",
      file: "/sounds/mbd.wav",
      spectrogram: "/sounds/mbd_spec.png",
    },
    {
      id: "lcm",
      label: "LCM Output",
      subtitle: "0.111s inference",
      file: "/sounds/lcm.wav",
      spectrogram: "/sounds/lcm_spec.png",
    },
  ];

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayAudio = (id) => {
    if (podcastRef.current && podcastPlaying) {
      podcastRef.current.pause();
      setPodcastPlaying(false);
    }

    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    if (playingAudio === id) {
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
      setPlayingAudio(null);
    } else {
      if (audioRefs.current[id]) {
        audioRefs.current[id].play();
        setPlayingAudio(id);
      }
    }
  };

  const handleAudioEnded = (id) => {
    if (playingAudio === id) {
      setPlayingAudio(null);
      if (audioRefs.current[id]) {
        audioRefs.current[id].currentTime = 0;
      }
    }
  };

  const handlePodcastToggle = () => {
    if (playingAudio) {
      Object.keys(audioRefs.current).forEach((key) => {
        if (audioRefs.current[key]) {
          audioRefs.current[key].pause();
          audioRefs.current[key].currentTime = 0;
        }
      });
      setPlayingAudio(null);
    }

    if (podcastRef.current) {
      if (podcastPlaying) {
        podcastRef.current.pause();
        setPodcastPlaying(false);
      } else {
        podcastRef.current.play();
        setPodcastPlaying(true);
      }
    }
  };

  const handlePodcastTimeUpdate = (e) => {
    if (podcastRef.current) {
      const progress = (e.target.currentTime / e.target.duration) * 100;
      setPodcastProgress(progress);
      setPodcastCurrentTime(e.target.currentTime);
    }
  };

  const handlePodcastLoaded = () => {
    if (podcastRef.current) {
      setPodcastDuration(podcastRef.current.duration);
    }
  };

  const handlePodcastSeek = (e) => {
    if (podcastRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * podcastRef.current.duration;
      podcastRef.current.currentTime = newTime;
    }
  };

  const handlePodcastEnded = () => {
    setPodcastPlaying(false);
    setPodcastProgress(0);
    setPodcastCurrentTime(0);
    if (podcastRef.current) {
      podcastRef.current.currentTime = 0;
    }
  };

  const opacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/sounds/wits.png" className="w-14" />
            <div>
              <h1 className="text-lg font-light tracking-tight">
                ASR via Latent Consistency
              </h1>
              <p className="text-xs text-stone-400">
                University of the Witwatersrand
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="space-y-8 sm:space-y-12" style={{ opacity }}>
            <div className="space-y-4">
              <p className="text-sm sm:text-base tracking-wider uppercase text-stone-400 font-light">
                Audio Super Resolution Research
              </p>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
                From minutes
                <br />
                <span className="text-stone-400">to milliseconds</span>
              </h2>
            </div>

            <p className="text-lg sm:text-xl md:text-2xl text-stone-500 font-light max-w-2xl leading-relaxed">
              Real-time audio reconstruction through latent consistency models
            </p>

            <div className="flex items-baseline gap-3 pt-8">
              <span className="text-6xl sm:text-7xl md:text-8xl font-extralight text-stone-900">
                557
              </span>
              <span className="text-2xl sm:text-3xl text-stone-400 font-light">
                times faster
              </span>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-stone-300 to-transparent" />
          </div>
        </div>
      </section>

      {/* Podcast Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Headphones className="w-8 h-8 text-stone-400" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-center">
              Listen to the Story as a Podcast
            </h2>
          </div>

          <div className="bg-stone-50 border border-stone-200 p-8 sm:p-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-light">
                  557x Faster Audio AI
                </h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  How Latent Consistency Models Solved the Real-Time Problem for
                  Audio Super Resolution
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <button
                    onClick={handlePodcastToggle}
                    className="flex-shrink-0 w-16 h-16 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {podcastPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-1" />
                    )}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div
                      className="h-2 bg-stone-200 rounded-full overflow-hidden cursor-pointer"
                      onClick={handlePodcastSeek}
                    >
                      <div
                        className="h-full bg-stone-900 transition-all rounded-full"
                        style={{ width: `${podcastProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-stone-400 font-light">
                      <span>{formatTime(podcastCurrentTime)}</span>
                      <span>{formatTime(podcastDuration)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-stone-400 text-xs tracking-wider uppercase text-center">
                Deep dive into the research and implications
              </p>
            </div>

            <audio
              ref={podcastRef}
              src="/sounds/podcast.mp4"
              onTimeUpdate={handlePodcastTimeUpdate}
              onLoadedMetadata={handlePodcastLoaded}
              onEnded={handlePodcastEnded}
            />
          </div>
        </div>
      </section>

      {/* Speed Comparison Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-20 text-center tracking-tight">
            Performance
          </h2>

          <div className="space-y-16">
            {/* LCM */}
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-light mb-2">
                    LCM Student
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base">
                    One-step inference
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-extralight">
                    0.111<span className="text-stone-400 text-xl">s</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 transition-all duration-300 rounded-full"
                    style={{ width: `${lcmProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>SI-SDR: 3.27 dB</span>
                  <span>STOI: 0.894</span>
                </div>
              </div>
            </div>

            {/* MBD */}
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-light mb-2">
                    MBD Teacher
                  </h3>
                  <p className="text-stone-400 text-sm sm:text-base">
                    Multi-step diffusion
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-extralight">
                    61.8<span className="text-stone-400 text-xl">s</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-400 transition-all duration-300 rounded-full"
                    style={{ width: `${mbdProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-stone-400">
                  <span>SI-SDR: -8.47 dB</span>
                  <span>STOI: 0.921</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={startAnimation}
              disabled={isAnimating}
              className="group inline-flex items-center gap-3 px-8 py-4 text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="text-sm tracking-wider uppercase font-light">
                {isAnimating ? "Processing" : "Compare Speed"}
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Key Innovation Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-stone-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-20 text-center tracking-tight">
            The Key Innovation
          </h2>

          <div className="max-w-2xl mx-auto space-y-8">
            <p className="text-stone-500 text-base sm:text-lg font-light leading-relaxed text-center">
              Traditional diffusion models iterate hundreds of times to denoise
              audio. We distilled this process into a
              <span className="text-stone-900">
                {" "}
                single-step transformer model
              </span>{" "}
              that learns the entire trajectory at once, achieving comparable
              quality in a fraction of the time.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 pt-8">
              <div className="text-center space-y-3">
                <div className="text-4xl font-extralight text-stone-400">
                  Multi-Step
                </div>
                <p className="text-sm text-stone-500 font-light">
                  Diffusion Model
                </p>
                <p className="text-xs text-stone-400 font-light">
                  Hundreds of iterations
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="text-4xl font-extralight text-stone-900">
                  One-Step
                </div>
                <p className="text-sm text-stone-500 font-light">
                  Consistency Model
                </p>
                <p className="text-xs text-stone-400 font-light">
                  Single forward pass
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Collapsible */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setHowItWorksOpen(!howItWorksOpen)}
            className="w-full flex items-center justify-between mb-12 group"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              How It Works
            </h2>
            <ChevronDown
              className={`w-8 h-8 text-stone-400 transition-transform duration-300 ${
                howItWorksOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              howItWorksOpen
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 font-light">01</span>
                </div>
                <h3 className="text-xl font-light">Low Quality Input</h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  Audio is downsampled from 24 kHz to 12 kHz, simulating
                  degraded quality with missing high frequencies
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 font-light">02</span>
                </div>
                <h3 className="text-xl font-light">Latent Processing</h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  EnCodec compresses audio into discrete tokens. Our model
                  processes these in a single forward pass instead of hundreds
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-full border border-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 font-light">03</span>
                </div>
                <h3 className="text-xl font-light">High Fidelity Output</h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  Reconstructed 24 kHz audio with restored high frequencies,
                  maintaining perceptual quality in milliseconds
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section - Collapsible */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setMethodologyOpen(!methodologyOpen)}
            className="w-full flex items-center justify-between mb-12 group"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              Methodology
            </h2>
            <ChevronDown
              className={`w-8 h-8 text-stone-400 transition-transform duration-300 ${
                methodologyOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              methodologyOpen
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-16">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-light pb-3 border-b border-stone-200">
                    Dataset
                  </h3>
                  <div className="space-y-3 text-sm font-light text-stone-500 leading-relaxed">
                    <p>
                      LibriTTS corpus with 33,000 speech clips originally
                      sampled at 24 kHz
                    </p>
                    <p>
                      Downsampled to 12 kHz to simulate degraded audio
                      conditions
                    </p>
                    <p>
                      Processed through pretrained EnCodec tokenizer for latent
                      representation
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-light pb-3 border-b border-stone-200">
                    Architecture
                  </h3>
                  <div className="space-y-3 text-sm font-light text-stone-500 leading-relaxed">
                    <p>
                      Transformer-based sequence model operating on discrete
                      latent tokens
                    </p>
                    <p>
                      Multi-codebook heads for parallel prediction across
                      EnCodec codebooks
                    </p>
                    <p>
                      Self-attention mechanisms for long-range temporal
                      dependencies
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-light pb-3 border-b border-stone-200">
                    Training
                  </h3>
                  <div className="space-y-3 text-sm font-light text-stone-500 leading-relaxed">
                    <p>32 epochs on NVIDIA Quadro RTX 8000 GPUs</p>
                    <p>AdamW optimizer with learning rate 2×10⁻⁴</p>
                    <p>
                      Latent consistency loss enforcing agreement with teacher
                      model
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-light pb-3 border-b border-stone-200">
                    Distillation
                  </h3>
                  <div className="space-y-3 text-sm font-light text-stone-500 leading-relaxed">
                    <p>
                      Teacher: Multi-Band Diffusion model with iterative
                      denoising
                    </p>
                    <p>
                      Student: Single-step transformer learning entire
                      trajectory
                    </p>
                    <p>Cross-entropy loss across multiple latent codebooks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 sm:p-12 border border-stone-200">
                <p className="text-stone-500 text-sm font-light leading-relaxed italic text-center max-w-3xl mx-auto">
                  "By distilling a multi-step diffusion model into a single
                  forward pass, we maintain perceptual quality while
                  significantly reducing computational cost—enabling real-time
                  audio super-resolution for the first time."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section - Collapsible */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setApplicationsOpen(!applicationsOpen)}
            className="w-full flex items-center justify-between mb-12 group"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">
              Applications
            </h2>
            <ChevronDown
              className={`w-8 h-8 text-stone-400 transition-transform duration-300 ${
                applicationsOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ${
              applicationsOpen
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-16">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Telecommunications</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    Real-time enhancement of voice calls over limited bandwidth
                    networks
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Audio Streaming</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    On-the-fly quality improvement for podcasts and music
                    streaming services
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Archive Restoration</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    Efficient upsampling of historical recordings and legacy
                    audio content
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Embedded Systems</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    Audio enhancement on resource-constrained devices like
                    hearing aids
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Video Conferencing</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    Low-latency audio quality improvement for remote
                    collaboration platforms
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-8 space-y-3 hover:border-stone-300 transition-colors duration-300">
                  <h3 className="text-lg font-light">Content Production</h3>
                  <p className="text-stone-500 text-sm font-light leading-relaxed">
                    Fast audio upsampling workflows for media and broadcast
                    industries
                  </p>
                </div>
              </div>

              <div className="text-center max-w-3xl mx-auto">
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  The 557× speed improvement makes real-time processing feasible
                  across all these applications, transforming audio
                  super-resolution from a slow batch process into an
                  interactive, production-ready technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audio Comparison Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-20 text-center tracking-tight">
            Audio Quality
          </h2>

          <div className="space-y-4">
            {audioSamples.map((sample, index) => (
              <div
                key={sample.id}
                className="group bg-white border border-stone-200 hover:border-stone-300 transition-all duration-300"
              >
                <div className="flex items-center gap-6 p-6 sm:p-8">
                  <button
                    onClick={() => handlePlayAudio(sample.id)}
                    className="flex-shrink-0 w-12 h-12 rounded-full border border-stone-900 flex items-center justify-center hover:bg-stone-900 hover:text-white transition-all duration-300"
                  >
                    {playingAudio === sample.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h3 className="text-lg sm:text-xl font-light">
                        {sample.label}
                      </h3>
                      <span className="text-xs text-stone-400 tracking-wider uppercase">
                        {sample.subtitle}
                      </span>
                    </div>

                    <div className="h-px bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-stone-900 transition-all"
                        style={{
                          width: playingAudio === sample.id ? "100%" : "0%",
                          transition:
                            playingAudio === sample.id
                              ? "width linear"
                              : "width 0.3s",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Mel Spectrogram */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <div className="bg-stone-50 border border-stone-200 p-4">
                    <p className="text-xs text-stone-400 mb-3 tracking-wider uppercase">
                      Mel Spectrogram
                    </p>
                    <div className="aspect-[3/1] bg-stone-100 flex items-center justify-center">
                      <img
                        src={sample.spectrogram}
                        alt={`${sample.label} spectrogram`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="hidden flex-col items-center justify-center text-stone-400 text-sm">
                        <span>Spectrogram visualization</span>
                        <span className="text-xs mt-1">({sample.label})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hidden audio element */}
                <audio
                  ref={(el) => (audioRefs.current[sample.id] = el)}
                  src={sample.file}
                  onEnded={() => handleAudioEnded(sample.id)}
                  onTimeUpdate={(e) => {
                    if (playingAudio === sample.id) {
                      const progress =
                        (e.target.currentTime / e.target.duration) * 100;
                    }
                  }}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-stone-400 text-sm mt-12 font-light">
            Click play to compare audio quality across different models
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-stone-200">
        <p className="text-stone-400 text-xs tracking-wider uppercase font-light">
          Audio Super Resolution via Latent Consistency Models © 2025
        </p>
      </footer>
    </div>
  );
}
