import { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AmbientMusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const createAmbientSound = useCallback(() => {
    const ctx = new AudioContext();
    audioContextRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    // Create warm ambient pad with multiple detuned oscillators
    const frequencies = [130.81, 164.81, 196.0, 261.63]; // C3, E3, G3, C4
    const oscs: OscillatorNode[] = [];

    frequencies.forEach((freq, i) => {
      // Main tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Slight detune for warmth
      const detunedOsc = ctx.createOscillator();
      detunedOsc.type = 'sine';
      detunedOsc.frequency.value = freq * 1.002;

      // Individual gain for layering
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.08 - i * 0.015;

      // Filter for warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800 - i * 100;
      filter.Q.value = 0.5;

      osc.connect(filter);
      detunedOsc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(masterGain);

      // Slow volume modulation (breathing effect)
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05 + i * 0.02; // Very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.02;
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      lfo.start();

      osc.start();
      detunedOsc.start();
      oscs.push(osc, detunedOsc, lfo);
    });

    oscillatorsRef.current = oscs;
  }, [volume]);

  const togglePlay = () => {
    if (playing) {
      // Stop
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      audioContextRef.current?.close();
      audioContextRef.current = null;
      oscillatorsRef.current = [];
      setPlaying(false);
    } else {
      createAmbientSound();
      setPlaying(true);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach((osc) => {
        try { osc.stop(); } catch {}
      });
      audioContextRef.current?.close();
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-4 lg:right-4 z-50 flex items-center gap-2">
      {playing && (
        <input
          type="range"
          min={0}
          max={0.3}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-20 accent-primary opacity-70 hover:opacity-100 transition-opacity"
        />
      )}
      <button
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card transition-all"
        title={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      >
        {playing ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>
    </div>
  );
}
