import React, { useState } from 'react';
import { Home, Send, Compass, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

export function DreamDelivery() {
  const { playChime, playTone } = useAudio();

  const stops = [
    {
      id: 'willow',
      name: 'Willow Burrow',
      recipient: 'Barnaby the Bunny Kit',
      coords: { x: '18%', y: '68%' },
      dreamTitle: 'The Infinite Dandelion Field',
      dreamDescription: 'Barnaby dreamt he was floating on giant fluffy dandelion seeds that gently floated over peaceful meadow streams.',
      deliveredTime: '8:15 PM · Delivered via Soft Cloud Glide'
    },
    {
      id: 'clocktower',
      name: 'The Old Clocktower',
      recipient: 'Hoot the Baby Barn Owl',
      coords: { x: '46%', y: '32%' },
      dreamTitle: 'Silent Sky Symphony',
      dreamDescription: 'Hoot dreamt the ticking gears of the town tower transformed into quiet woodwind music, silencing all thunderstorm noise.',
      deliveredTime: '9:40 PM · Delivered via Starlight Beam'
    },
    {
      id: 'cloudloft',
      name: 'The Cloud Loft Attic',
      recipient: 'Milo the Mouse Cub',
      coords: { x: '78%', y: '45%' },
      dreamTitle: 'Cheese Moon & Cracker Canoes',
      dreamDescription: 'Milo sailed a golden toasted cracker boat across a quiet fondue lake, accompanied by three singing crickets.',
      deliveredTime: '10:10 PM · Delivered via Lavender Breeze'
    },
    {
      id: 'lighthouse',
      name: 'Cove Lighthouse',
      recipient: 'Kip the Harbor Seal Pup',
      coords: { x: '88%', y: '78%' },
      dreamTitle: 'Bioluminescent Seashells',
      dreamDescription: 'Kip rested on a sandy sandbar where sea foam glowed turquoise, singing sleepy ocean lullabies with friendly sea turtles.',
      deliveredTime: '11:05 PM · Delivered via Star Sparkle'
    }
  ];

  const [activeStopIndex, setActiveStopIndex] = useState(0);
  const activeStop = stops[activeStopIndex];

  const handleSelectStop = (index) => {
    setActiveStopIndex(index);
    playChime(659.25);
  };

  const handleNextDelivery = () => {
    const nextIdx = (activeStopIndex + 1) % stops.length;
    setActiveStopIndex(nextIdx);
    playTone(587.33, 0.3, 'sine');
  };

  return (
    <div className="project-card delivery-card">
      <div className="project-grid">
        {/* Left Visual Column: Interactive Dream Route Map */}
        <div className="project-visual-col">
          <div className="village-map-container" role="region" aria-label="Dream Delivery Interactive Map">
            {/* Ambient Moon & Stars Background */}
            <div className="map-moon-glow"></div>

            {/* Dotted Flight Path SVG */}
            <svg className="map-flight-path" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M 18,68 Q 30,45 46,32 T 78,45 T 88,78"
                fill="none"
                stroke="var(--color-amber)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="animated-dash-path"
              />
            </svg>

            {/* Village Cottages / Waypoints */}
            {stops.map((stop, index) => {
              const isActive = index === activeStopIndex;
              return (
                <button
                  key={stop.id}
                  onClick={() => handleSelectStop(index)}
                  className={`map-cottage-node ${isActive ? 'active-node' : ''}`}
                  style={{ left: stop.coords.x, top: stop.coords.y }}
                  title={`Deliver to ${stop.name}`}
                  aria-label={`Select ${stop.name}`}
                >
                  <Home size={18} className="cottage-icon" />
                  <span className="node-tooltip">{stop.name}</span>
                </button>
              );
            })}

            {/* Floating Pip Courier Star on Active Coords */}
            <div
              className="courier-star-indicator"
              style={{
                left: activeStop.coords.x,
                top: activeStop.coords.y,
                transition: 'all 0.6s cubic-bezier(0.2, 0.9, 0.3, 1)',
              }}
            >
              <div className="courier-pulse"></div>
              <span className="courier-icon">⭐</span>
            </div>
          </div>

          <div className="project-tag-strip">
            <span>PROJECT NO. 03</span>
            <span>NOCTURNAL LOGISTICS MAP</span>
          </div>
        </div>

        {/* Right Interaction Column: Delivered Dream Dispatch */}
        <div className="project-info-col">
          <span className="project-eyebrow">DREAM CARTOGRAPHY &amp; ROUTING</span>
          <h3 className="project-title">Dream Delivery Routes</h3>
          <p className="project-desc">
            A real-time flight route through the sleepy village. Pip navigates silent chimneys and open bedroom windows to place customized dreams under sleepy heads.
          </p>

          {/* Delivered Dream Dispatch Scroll */}
          <div className="dream-dispatch-scroll">
            <div className="dispatch-header">
              <div className="dispatch-badge">
                <CheckCircle2 size={15} color="#27ae60" />
                <span>DELIVERY VERIFIED</span>
              </div>
              <span className="dispatch-timestamp">{activeStop.deliveredTime}</span>
            </div>

            <div className="dispatch-body">
              <h4 className="dispatch-dream-name">"{activeStop.dreamTitle}"</h4>
              <p className="dispatch-recipient">
                <strong>Recipient:</strong> {activeStop.recipient} ({activeStop.name})
              </p>
              <p className="dispatch-text">{activeStop.dreamDescription}</p>
            </div>
          </div>

          {/* Controls to cycle deliveries */}
          <div className="delivery-action-row">
            <button
              onClick={handleNextDelivery}
              className="btn btn-primary"
            >
              <Send size={15} />
              <span>Advance to Next Delivery</span>
            </button>
            <span className="delivery-counter">
              Stop {activeStopIndex + 1} of {stops.length}
            </span>
          </div>

          <div className="project-foot-role">
            <strong>Pip's Creative Role:</strong> "I map the routes around windy trees so the dreams don't get tangled in telephone wires."
          </div>
        </div>
      </div>
    </div>
  );
}
