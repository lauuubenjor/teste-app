/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_TRACKS, INITIAL_EQ_STATE } from './data/mockTracks';
import { Track, EqualizerState } from './types/audio';
import { audioEngine } from './services/audioEngine';
import { AeroNavbar } from './components/AeroNavbar';
import { DuDiscPlayer } from './components/DuDiscPlayer';
import { HomeDiscovery } from './components/HomeDiscovery';
import { LibraryView } from './components/LibraryView';
import { AeroEqualizer } from './components/AeroEqualizer';
import { AeroDesignSystem } from './components/AeroDesignSystem';
import { AeroMiniPlayer } from './components/AeroMiniPlayer';
import { MobileDevicePreview } from './components/MobileDevicePreview';

export default function App() {
  const [tracks, setTracks] = useState<Track[]>(() => {
    const saved = localStorage.getItem('aerosound_tracks');
    return saved ? JSON.parse(saved) : INITIAL_TRACKS;
  });

  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'player' | 'library' | 'equalizer' | 'design'>('home');
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(false);
  const [eqState, setEqState] = useState<EqualizerState>(INITIAL_EQ_STATE);

  // Keep track list synced in storage
  useEffect(() => {
    localStorage.setItem('aerosound_tracks', JSON.stringify(tracks));
  }, [tracks]);

  // Handle track ending -> autoplay next
  useEffect(() => {
    audioEngine.setEndListener(() => {
      handleNextTrack();
    });
  }, [tracks, currentTrack]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.playTrack(currentTrack.synthPreset);
      setIsPlaying(true);
    }
  };

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    audioEngine.playTrack(track.synthPreset);
    setIsPlaying(true);
  };

  const handleNextTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    handleSelectTrack(tracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    handleSelectTrack(tracks[prevIndex]);
  };

  const handleToggleFavorite = (trackId: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );
    if (currentTrack.id === trackId) {
      setCurrentTrack((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
    }
  };

  const handleChangeEqState = (newState: EqualizerState) => {
    setEqState(newState);
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-cyan-400 selection:text-white pb-24">
      {/* Decorative Floating Aqua Bubbles (Frutiger Aero signature) */}
      <div className="fixed top-20 left-10 w-24 h-24 rounded-full bg-cyan-300/20 blur-xl pointer-events-none animate-float-bubble" />
      <div className="fixed top-1/3 right-12 w-32 h-32 rounded-full bg-sky-300/25 blur-2xl pointer-events-none animate-float-bubble" style={{ animationDelay: '2s' }} />
      <div className="fixed bottom-24 left-1/4 w-40 h-40 rounded-full bg-emerald-200/20 blur-2xl pointer-events-none animate-float-bubble" style={{ animationDelay: '3.5s' }} />

      {/* Top Bar Contract Navigation */}
      <AeroNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileFrameMode={isMobileFrameMode}
        onToggleFrameMode={() => setIsMobileFrameMode(!isMobileFrameMode)}
        isPlaying={isPlaying}
        activeTrackTitle={currentTrack.title}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {isMobileFrameMode ? (
          <MobileDevicePreview
            tracks={tracks}
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            onSelectTrack={handleSelectTrack}
            onTogglePlay={handleTogglePlay}
            onNextTrack={handleNextTrack}
            onPrevTrack={handlePrevTrack}
            onToggleFavorite={handleToggleFavorite}
            eqState={eqState}
            onChangeEqState={handleChangeEqState}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeDiscovery
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectTrack={handleSelectTrack}
                onTogglePlay={handleTogglePlay}
                onGoToPlayer={() => setActiveTab('player')}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'player' && (
              <div className="py-4">
                <DuDiscPlayer
                  track={currentTrack}
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onNextTrack={handleNextTrack}
                  onPrevTrack={handlePrevTrack}
                  onSelectTrack={handleSelectTrack}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            )}

            {activeTab === 'library' && (
              <LibraryView
                tracks={tracks}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onSelectTrack={handleSelectTrack}
                onTogglePlay={handleTogglePlay}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'equalizer' && (
              <AeroEqualizer
                eqState={eqState}
                onChangeEqState={handleChangeEqState}
                isPlaying={isPlaying}
              />
            )}

            {activeTab === 'design' && (
              <AeroDesignSystem />
            )}
          </>
        )}
      </main>

      {/* Persistent Mini Player when not on the DuDisc view or in mobile mode */}
      {!isMobileFrameMode && activeTab !== 'player' && (
        <AeroMiniPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNextTrack={handleNextTrack}
          onPrevTrack={handlePrevTrack}
          onExpandPlayer={() => setActiveTab('player')}
          onOpenEQ={() => setActiveTab('equalizer')}
        />
      )}
    </div>
  );
}
