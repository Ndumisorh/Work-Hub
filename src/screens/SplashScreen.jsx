import { useEffect, useState } from "react";

// Shown once when the app first loads. Auto-advances after a short delay,
// or immediately if the person taps/clicks anywhere.
export default function SplashScreen({ onDone }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 1050);
    const doneTimer = setTimeout(onDone, 1350);
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer); };
  }, [onDone]);

  return (
    <div
      className="workhub-splash"
      onClick={onDone}
      style={{
        position: "absolute", inset: 0, borderRadius: 16, cursor: "pointer", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 50% 43%, #0A1F1A 0%, #071812 48%, #051410 100%)",
        opacity: visible ? 1 : 0, transition: "opacity 0.28s ease",
        zIndex: 100,
      }}
    >
      <div className="splash-glow" />
      <div className="splash-orbit splash-orbit-one" />
      <div className="splash-orbit splash-orbit-two" />
      <div className="splash-rays" />

      <div className="splash-content">
        <div className="splash-logo-wrap">
          <div className="splash-logo">W</div>
        </div>
        <div className="splash-name">Work Hub</div>
        <div className="splash-tagline">Calm control for busy studios</div>
        <div className="splash-progress" role="progressbar" aria-label="Loading Work Hub">
          <div className="splash-progress-fill" />
        </div>
      </div>

      <style>{`
        .workhub-splash::before {
          content: ""; position: absolute; inset: 0; opacity: 0.16; pointer-events: none;
          background-image: radial-gradient(rgba(148, 218, 187, 0.2) 0.65px, transparent 0.65px);
          background-size: 24px 24px; mask-image: linear-gradient(transparent, black 30%, transparent 85%);
        }
        .splash-glow {
          position: absolute; width: 360px; height: 300px; border-radius: 50%;
          background: radial-gradient(ellipse, rgba(29, 130, 91, 0.19), transparent 68%);
          filter: blur(12px); transform: translateY(-46px); pointer-events: none;
        }
        .splash-rays {
          position: absolute; inset: 0; opacity: 0.15; pointer-events: none;
          background: conic-gradient(from 222deg at 50% 43%, transparent 0deg, rgba(100, 190, 147, 0.08) 8deg, transparent 16deg, transparent 36deg, rgba(100, 190, 147, 0.06) 43deg, transparent 51deg, transparent 360deg);
          mask-image: radial-gradient(ellipse at center, black, transparent 70%);
        }
        .splash-orbit {
          position: absolute; border: 1px solid rgba(115, 190, 153, 0.08); border-radius: 50%;
          transform: rotate(-25deg); pointer-events: none;
        }
        .splash-orbit-one { width: 470px; height: 180px; }
        .splash-orbit-two { width: 560px; height: 250px; transform: rotate(28deg); border-color: rgba(115, 190, 153, 0.045); }
        .splash-content { z-index: 1; display: flex; flex-direction: column; align-items: center; animation: splash-arrive 0.65s cubic-bezier(.2,.75,.25,1) both; }
        .splash-logo-wrap { position: relative; margin-bottom: 20px; }
        .splash-logo-wrap::before {
          content: ""; position: absolute; inset: -11px; border-radius: 27px;
          background: rgba(57, 201, 145, 0.18); filter: blur(19px);
        }
        .splash-logo {
          position: relative; width: 74px; height: 74px; border-radius: 22px;
          display: flex; align-items: center; justify-content: center;
          color: #052016; font-size: 31px; font-weight: 750; letter-spacing: -2px;
          background: linear-gradient(145deg, rgba(150, 255, 210, 0.98), #43D6A0 48%, #238C68);
          border: 1px solid rgba(210, 255, 232, 0.56);
          box-shadow: inset 0 1px 1px rgba(255,255,255,0.55), inset 0 -5px 10px rgba(4,62,42,0.22), 0 12px 28px rgba(0,0,0,0.3), 0 0 34px rgba(63,214,170,0.14);
          animation: splash-breathe 2.4s ease-in-out infinite;
        }
        .splash-name { color: #F0F8F3; font-size: 20px; font-weight: 650; letter-spacing: -0.45px; }
        .splash-tagline { margin-top: 7px; color: #9ABBA9; font-size: 12.5px; font-weight: 400; letter-spacing: 0.12px; }
        .splash-progress { width: 112px; height: 2px; margin-top: 29px; border-radius: 2px; overflow: hidden; background: rgba(160, 209, 181, 0.13); }
        .splash-progress-fill { width: 100%; height: 100%; border-radius: inherit; transform-origin: left; background: linear-gradient(90deg, #2B9D71, #79E3B4); animation: splash-progress 1.2s cubic-bezier(.45,0,.55,1) both; box-shadow: 0 0 8px rgba(93, 225, 165, 0.6); }
        @keyframes splash-progress { from { transform: scaleX(0.06); opacity: 0.7; } to { transform: scaleX(1); opacity: 1; } }
        @keyframes splash-breathe { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes splash-arrive { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .splash-content, .splash-logo, .splash-progress-fill { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>
    </div>
  );
}
