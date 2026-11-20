/**
 * Pure Web Audio auspicious temple chime & serene tanpura drone synthesizer,
 * plus calendar (.ics) download utility for the wedding ceremony.
 */

let audioCtx: AudioContext | null = null;
let droneNodes: { stop: () => void } | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }
  return audioCtx;
}

export function playAuspiciousChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    // Soft harmonious bell partials (Sa - Pa - upper Sa in C# / D)
    const frequencies = [293.66, 440.0, 587.33, 880.0];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.045 / (idx + 1), now + idx * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 2.5);
    });
  } catch {
    // Ignore audio errors if blocked by browser autoplay policy
  }
}

export function startAmbientDrone(): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;
    if (droneNodes) return true;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 1.5);
    masterGain.connect(ctx.destination);

    // Warm Tanpura Sa-Pa-Sa harmonic drone
    const freqs = [146.83, 220.0, 293.66];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 520;

      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = f;
      osc.connect(filter);
      filter.connect(masterGain);
      osc.start();
      return osc;
    });

    droneNodes = {
      stop: () => {
        try {
          const t = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(t);
          masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), t);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
          setTimeout(() => {
            oscs.forEach((o) => {
              try {
                o.stop();
                o.disconnect();
              } catch {
                // ignore
              }
            });
            masterGain.disconnect();
          }, 650);
        } catch {
          // ignore
        }
      },
    };
    return true;
  } catch {
    return false;
  }
}

export function stopAmbientDrone(): void {
  if (droneNodes) {
    droneNodes.stop();
    droneNodes = null;
  }
}

export function downloadWeddingCalendarICS(): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Soham-Poonam-Wedding//MR',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:soham-poonam-wedding-20261201@shubhvivah',
    'DTSTAMP:20261119T000000Z',
    'DTSTART;TZID=Asia/Kolkata:20261201T113000',
    'DTEND;TZID=Asia/Kolkata:20261201T153000',
    'SUMMARY:शुभविवाह सोहळा – चि. सोहम आणि चि. सौ. कां. पूनम',
    'DESCRIPTION:श्री गणेशाच्या कृपेने चि. सोहम आणि चि. सौ. कां. पूनम यांचा शुभविवाह सोहळा. सस्नेह निमंत्रक: समस्त परिवार.',
    'LOCATION:यशवंत मल्टिपर्पज हॉल, गडमुडशिंगी, कोल्हापूर',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Soham-Poonam-Shubhvivah-2026.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
