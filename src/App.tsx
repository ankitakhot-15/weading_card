/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { DoorEntrance } from './components/DoorEntrance';
import { PetalCanvas } from './components/PetalCanvas';
import { WeddingContent } from './components/WeddingContent';
import { playAuspiciousChime, stopAmbientDrone } from './utils/auspiciousAudio';

export default function App() {
  const [doorOpen, setDoorOpen] = useState(false);
  const [doorOpening, setDoorOpening] = useState(false);
  const [doorKey, setDoorKey] = useState(0);
  const [petalBurstKey, setPetalBurstKey] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const handleStartOpening = () => {
    setDoorOpening(true);
    playAuspiciousChime();
    setPetalBurstKey((k) => k + 1);
  };

  const handleOpenComplete = () => {
    setDoorOpen(true);
  };

  const handleReplayDoor = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setDoorOpen(false);
    setDoorOpening(false);
    setDoorKey((k) => k + 1);
  };

  const handleToggleAudio = () => {
    setAudioEnabled((prev) => {
      const next = !prev;
      if (next) {
        playAuspiciousChime();
      } else {
        stopAmbientDrone();
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#190307] text-[#FDF7EC] overflow-x-clip">
      <DoorEntrance
        key={doorKey}
        isOpen={doorOpen}
        onStartOpening={handleStartOpening}
        onOpenComplete={handleOpenComplete}
      />

      <PetalCanvas burstKey={petalBurstKey} active={doorOpening || doorOpen} />

      <main>
        <WeddingContent
          doorOpen={doorOpening || doorOpen}
          onReplayDoor={handleReplayDoor}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
        />
      </main>
    </div>
  );
}
