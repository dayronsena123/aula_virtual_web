import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

export default function CustomPlayer({ src, watermarkText }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Speed controller states
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  // Detect and convert external URLs to embed preview URLs (Google Drive, YouTube, Vimeo)
  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?modestbranding=1&rel=0&iv_load_policy=3`;
      }
    }
    if (url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?dnt=1`;
      }
    }
    return null;
  };

  const embedUrl = getEmbedUrl(src);

  // Prevent Context Menu (Right Click)
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => console.log("Playback error: ", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newVolume = Math.max(0, Math.min(1, clickX / width));
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleSpeedChange = (speed) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        console.log("Fullscreen request failed", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef} 
      className="video-container"
      onContextMenu={handleContextMenu}
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000000',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}
    >
      {/* Dynamic Floating Watermarks - high z-index to stay on top of iframes */}
      {watermarkText && (
        <>
          <div 
            className="watermark"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.15)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontWeight: 700,
              zIndex: 50,
              userSelect: 'none',
              animation: 'floatWatermark1 26s infinite linear',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase'
            }}
          >
            {watermarkText} - ULEMA PROTECTED
          </div>
          <div 
            className="watermark"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.15)',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              fontWeight: 700,
              zIndex: 50,
              userSelect: 'none',
              animation: 'floatWatermark2 22s infinite linear',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase'
            }}
          >
            {watermarkText} - ULEMA PROTECTED
          </div>
        </>
      )}

      {embedUrl ? (
        /* If it's a Drive, Youtube or Vimeo link, render iframe and overlay block */
        <>
          {/* Top Bar Protection Overlay - blocks the title & pop-out (download) button of Google Drive */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '56px',
            backgroundColor: 'transparent',
            zIndex: 40,
            cursor: 'not-allowed'
          }} 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onContextMenu={handleContextMenu}
          />
          
          <iframe
            src={embedUrl}
            style={{ width: '100%', height: '100%', border: 'none', zIndex: 1 }}
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Video Player"
          />
        </>
      ) : (
        /* Else, render native video player */
        <>
          <video
            ref={videoRef}
            src={src}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            Your browser does not support the video tag.
          </video>

          {/* Custom Video Controls Panel */}
          <div className="video-controls">
            {/* Timeline Slider */}
            <div 
              className="progress-bar-container"
              onClick={handleProgressClick}
            >
              <div 
                className="progress-bar"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>

            {/* Action Buttons Row */}
            <div className="controls-row">
              <div className="controls-left">
                <button className="control-btn" onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button className="control-btn" onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                {/* Volume Control */}
                <div 
                  className="volume-slider"
                  onClick={handleVolumeChange}
                >
                  <div 
                    className="volume-progress"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                </div>

                <span style={{ fontSize: '0.85rem', color: '#ffffff', opacity: 0.9 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="controls-right" style={{ position: 'relative' }}>
                {/* Speed Controller Trigger */}
                <button 
                  className="control-btn" 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  style={{ fontSize: '0.85rem', fontWeight: 700, gap: '4px' }}
                >
                  <Settings size={18} />
                  {playbackSpeed}x
                </button>

                {/* Speed Options Dropdown */}
                {showSpeedMenu && (
                  <div style={{
                    position: 'absolute',
                    bottom: '36px',
                    right: 0,
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 60,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    minWidth: '70px'
                  }}>
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: playbackSpeed === speed ? 'var(--accent-red)' : '#ffffff',
                          padding: '6px 10px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          fontSize: '0.8rem',
                          fontWeight: playbackSpeed === speed ? 'bold' : 'normal',
                          borderRadius: '4px',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}

                <button className="control-btn" onClick={toggleFullscreen}>
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
