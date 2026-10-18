import React, { useState, useEffect, useRef } from 'react';

interface StopwatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StopwatchModal: React.FC<StopwatchModalProps> = ({ isOpen, onClose }) => {
  const [timeMs, setTimeMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<any>(null);

  // Metronome for running cadence / breathing
  const [metronomeBpm, setMetronomeBpm] = useState<number>(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const metronomeIntervalRef = useRef<any>(null);

  // Web Audio Context for clear pedagogic beeps
  const playBeep = (freq = 800, duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // AudioContext fallback
    }
  };

  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - timeMs;
      intervalRef.current = setInterval(() => {
        setTimeMs(Date.now() - start);
      }, 30);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (isMetronomeActive) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        playBeep(880, 0.05);
      }, intervalMs);
    } else {
      clearInterval(metronomeIntervalRef.current);
    }
    return () => clearInterval(metronomeIntervalRef.current);
  }, [isMetronomeActive, metronomeBpm]);

  if (!isOpen) return null;

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps([timeMs, ...laps]);
      playBeep(1200, 0.06);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-stopwatch text-amber-400 text-lg"></i>
            <h3 className="font-bold text-sm tracking-wide uppercase">
              Đồng Hồ Bấm Giờ Sư Phạm & Nhịp Điệu (BPM)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Stopwatch Display */}
        <div className="text-center py-4 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-4xl md:text-5xl font-mono font-black text-amber-400 tracking-wider">
            {formatTime(timeMs)}
          </span>
          <p className="text-[11px] text-slate-500 mt-1 uppercase">Phút : Giây . Tích tắc</p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => {
              setIsRunning(!isRunning);
              playBeep(isRunning ? 600 : 900, 0.08);
            }}
            className={`py-2.5 rounded-xl font-bold text-xs uppercase transition cursor-pointer ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isRunning ? 'Tạm Dừng' : 'Bắt Đầu'}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            Ghi Vòng (Lap)
          </button>

          <button
            onClick={handleReset}
            className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs transition cursor-pointer"
          >
            Đặt Lại
          </button>
        </div>

        {/* Metronome / Nhịp chạy */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-emerald-400 flex items-center gap-1.5">
              <i className="fa-solid fa-volume-high"></i>
              Nhịp Đếm Bước / Nhịp Thở: {metronomeBpm} BPM
            </span>
            <button
              onClick={() => setIsMetronomeActive(!isMetronomeActive)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                isMetronomeActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
              }`}
            >
              {isMetronomeActive ? 'Tắt Tiếng' : 'Bật Nhịp'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[10px]">60</span>
            <input
              type="range"
              min={60}
              max={180}
              step={5}
              value={metronomeBpm}
              onChange={(e) => setMetronomeBpm(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-slate-400 text-[10px]">180</span>
          </div>
          <p className="text-[10px] text-slate-400">
            • 80-100 BPM: Nhịp thở dưỡng sinh 4 thì & thả lỏng • 120-140 BPM: Nhịp chạy bước nhỏ/bước lướt
          </p>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="max-h-28 overflow-y-auto space-y-1 text-xs border-t border-slate-800 pt-2">
            <span className="text-[11px] text-slate-400 font-semibold">Danh sách thời gian ghi nhận:</span>
            {laps.map((lap, idx) => (
              <div key={idx} className="flex justify-between text-slate-300 bg-slate-950 px-2.5 py-1 rounded">
                <span>Vòng #{laps.length - idx}</span>
                <span className="font-mono text-amber-300">{formatTime(lap)}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
