import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trophy, Calendar } from 'lucide-react';
import './HowToEarnVc.css';

export default function HowToEarnVc() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="earn-vc-page">
      <div className="earn-vc-header">
        <button className="earn-vc-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          <span className="earn-vc-title">How to earn VC</span>
        </button>
      </div>

      <div className="earn-vc-content">
        <div className="earn-vc-card">
          <UserPlus size={36} strokeWidth={2} className="earn-vc-icon" />
          <p className="earn-vc-text">
            Invite a friend to join us and attend an event together to earn VC's.
          </p>
        </div>

        <div className="earn-vc-card">
          <Trophy size={36} strokeWidth={2} className="earn-vc-icon" />
          <p className="earn-vc-text">
            Compete in events and give your best—winning earns you additional VC's.
          </p>
        </div>

        <div className="earn-vc-card">
          <Calendar size={36} strokeWidth={2} className="earn-vc-icon" />
          <p className="earn-vc-text">
            Participate in our regular events and stay actively involved.
          </p>
        </div>
      </div>
    </div>
  );
}
