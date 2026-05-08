import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './HowToEarnVc.css';

import referralImg from '../assets/Referal to a friend.png';
import winningImg from '../assets/Winning an event.png';
import attendanceImg from '../assets/Attending an Event.png';

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
          <img src={referralImg} alt="Referral" className="earn-vc-img-icon" />
          <p className="earn-vc-text">
            Invite a friend to join us and attend an event together to earn VC's.
          </p>
        </div>

        <div className="earn-vc-card">
          <img src={winningImg} alt="Winning" className="earn-vc-img-icon" />
          <p className="earn-vc-text">
            Compete in events and give your best—winning earns you additional VC's.
          </p>
        </div>

        <div className="earn-vc-card">
          <img src={attendanceImg} alt="Attendance" className="earn-vc-img-icon" />
          <p className="earn-vc-text">
            Participate in our regular events and stay actively involved.
          </p>
        </div>
      </div>
    </div>
  );
}
