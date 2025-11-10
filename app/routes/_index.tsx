import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Github,
  FileText,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export default function Index() {
  const [scrollY, setScrollY] = useState(0);
  const [mbdProgress, setMbdProgress] = useState(0);
  const [lcmProgress, setLcmProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  const audioRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const startAnimation = () => {
    setIsAnimating(true);
    setMbdProgress(0);
    setLcmProgress(0);

    const lcmDuration = 111;
    const lcmInterval = setInterval(() => {
      setLcmProgress((prev) => {
        if (prev >= 100) {
          clearInterval(lcmInterval);
          return 100;
        }
        return prev + 100 / (lcmDuration / 10);
      });
    }, 10);

    const mbdDuration = 61837;
    const mbdInterval = setInterval(() => {
      setMbdProgress((prev) => {
        if (prev >= 100) {
          clearInterval(mbdInterval);
          setIsAnimating(false);
          return 100;
        }
        return prev + 100 / (mbdDuration / 10);
      });
    }, 10);
  };

  const audioSamples = [
    {
      id: "ground-truth",
      label: "Ground Truth",
      subtitle: "24 kHz Original",
      file: "/sounds/ground_truth.wav",
    },
    {
      id: "lcm",
      label: "LCM Output",
      subtitle: "0.111s inference",
      file: "/sounds/lcm.wav",
    },
    {
      id: "mbd",
      label: "MBD Teacher",
      subtitle: "61.8s inference",
      file: "/sounds/mbd.wav",
    },
  ];

  const handlePlayAudio = (id) => {
    // Stop all other audio
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id && audioRefs.current[key]) {
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });

    if (playingAudio === id) {
      // Pause current audio
      if (audioRefs.current[id]) {
        audioRefs.current[id].pause();
      }
      setPlayingAudio(null);
    } else {
      // Play new audio
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

  const opacity = Math.max(0, 1 - scrollY / 500);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <div className="space-y-8 sm:space-y-12" style={{ opacity }}>
            <div className="space-y-4">
              <p className="text-sm sm:text-base tracking-wider uppercase text-stone-400 font-light">
                Audio Super Resolution Research
              </p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
                From minutes
                <br />
                <span className="text-stone-400">to milliseconds</span>
              </h1>
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

                {/* Hidden audio element */}
                <audio
                  ref={(el) => (audioRefs.current[sample.id] = el)}
                  src={sample.file}
                  onEnded={() => handleAudioEnded(sample.id)}
                  onTimeUpdate={(e) => {
                    if (playingAudio === sample.id) {
                      const progress =
                        (e.target.currentTime / e.target.duration) * 100;
                      // Progress bar updates automatically via CSS transition
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

      {/* Research Links Section */}
      <section className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-20 text-center tracking-tight">
            Research
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            <a
              href="https://github.com/retr0-spection/ASR-LCM-Research"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border border-stone-200 hover:border-stone-900 transition-all duration-300 p-8 sm:p-12"
            >
              <Github className="w-8 h-8 mb-6 text-stone-400 group-hover:text-stone-900 transition-colors" />
              <h3 className="text-xl font-light mb-3">Code Repository</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Implementation details and training scripts
              </p>
              <ArrowRight className="w-5 h-5 mt-6 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
            </a>

            <div className="group block border border-stone-200 hover:border-stone-900 transition-all duration-300 p-8 sm:p-12 cursor-pointer">
              <FileText className="w-8 h-8 mb-6 text-stone-400 group-hover:text-stone-900 transition-colors" />
              <h3 className="text-xl font-light mb-3">Full Paper</h3>
              <p className="text-stone-400 text-sm font-light leading-relaxed">
                Complete methodology and analysis
              </p>
              <ArrowRight className="w-5 h-5 mt-6 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div className="mt-20 pt-12 border-t border-stone-200 text-center space-y-2">
            <p className="text-stone-400 text-xs tracking-wider uppercase">
              Research by
            </p>
            <a
              href="https://oratilenailana.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-light hover:text-stone-600 transition-colors inline-block underline decoration-stone-300 hover:decoration-stone-600 underline-offset-4"
            >
              Oratile Nailana
            </a>
            <p className="text-stone-400 text-sm font-light">
              University of the Witwatersrand
            </p>
          </div>
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
