import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, FileText, Megaphone, Heart, 
  BarChart, UserRound, Presentation, Users, Box, 
  CircleDollarSign, StickyNote, BadgeCheck, 
  CalendarCheck, Wrench, PenTool, UserPlus, 
  Play, Rocket, Award, Trophy
} from 'lucide-react';
import './HowToEarnVc.css';

// Import custom assets
import calnderImg from '../assets/calnder.png';
import newspaperImg from '../assets/ion_newspaper.png';
import loudspeakerImg from '../assets/tdesign_loudspeaker-filled.png';
import volunteerImg from '../assets/material-symbols_volunteer-activism.png';
import leaderboardImg from '../assets/material-symbols_leaderboard.png';
import mentorImg from '../assets/simple-icons_codementor.png';
import friendsImg from '../assets/fa-solid_user-friends.png';
import consistencyImg from '../assets/ix_consistency-check.png';

// New assets for remaining cards
import moneySolidImg from '../assets/streamline-sharp_business-idea-money-solid.png';
import documentFillImg from '../assets/mingcute_document-2-fill.png';
import sealCheckImg from '../assets/ph_seal-check-fill.png';
import supportSolidImg from '../assets/streamline-plump_customer-support-7-solid.png';
import toolsSolidImg from '../assets/fa7-solid_tools.png';
import inviteImg from '../assets/mdi_invite.png';
import startupImg from '../assets/material-symbols_not-started.png';
import rocketLaunchImg from '../assets/material-symbols_rocket-launch.png';
import awardSolidImg from '../assets/fa7-solid_award.png';

export default function HowToEarnVc() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: "10 VCs — Participation & Contribution",
      cards: [
        { icon: <img src={calnderImg} alt="" className="vc-reward-img-icon" />, text: "Attend workshops or events" },
        { icon: <img src={newspaperImg} alt="" className="vc-reward-img-icon" />, text: "Write for E-Cell blogs or newsletters" },
        { icon: <img src={loudspeakerImg} alt="" className="vc-reward-img-icon" />, text: "Manage promotions or outreach activities" },
      ]
    },
    {
      title: "20 VCs — Community Engagement & Leadership",
      cards: [
        { icon: <img src={volunteerImg} alt="" className="vc-reward-img-icon" />, text: "Volunteer at E-Cell programs" },
        { icon: <img src={leaderboardImg} alt="" className="vc-reward-img-icon" />, text: "Lead teams or help organize events" },
        { icon: <img src={mentorImg} alt="" className="vc-reward-img-icon" />, text: "Mentor fellow members" },
        { icon: <Presentation size={36} />, text: "Conduct peer training sessions" },
        { icon: <img src={friendsImg} alt="" className="vc-reward-img-icon" />, text: "Refer active new members" },
        { icon: <img src={consistencyImg} alt="" className="vc-reward-img-icon" />, text: "Maintain consistent engagement in E-Cell activities" },
      ]
    },
    {
      title: "30 VCs — Innovation & Competitive Participation",
      cards: [
        { icon: <img src={moneySolidImg} alt="" className="vc-reward-img-icon" />, text: "Participate in startup competitions" },
        { icon: <Presentation size={36} />, text: "Represent E-Cell externally" },
        { icon: <img src={documentFillImg} alt="" className="vc-reward-img-icon" />, text: "Submit or pitch startup ideas" },
        { icon: <img src={sealCheckImg} alt="" className="vc-reward-img-icon" />, text: "Win competitions or hackathons" },
        { icon: <img src={calnderImg} alt="" className="vc-reward-img-icon" />, text: "Complete learning sessions or bootcamps" },
        { icon: <img src={supportSolidImg} alt="" className="vc-reward-img-icon" />, text: "Support community initiatives" },
        { icon: <img src={toolsSolidImg} alt="" className="vc-reward-img-icon" />, text: "Build tools or resources for E-Cell" },
      ]
    },
    {
      title: "40 VCs — Collaborative Participation",
      cards: [
        { icon: <img src={inviteImg} alt="" className="vc-reward-img-icon" />, text: "Invite a friend to join and attend an event together" },
      ]
    },
    {
      title: "50 VCs — Major Achievements & Startup Growth",
      cards: [
        { icon: <img src={startupImg} alt="" className="vc-reward-img-icon" />, text: "Run an E-Cell registered startup" },
        { icon: <img src={rocketLaunchImg} alt="" className="vc-reward-img-icon" />, text: "Launch new E-Cell projects" },
        { icon: <img src={awardSolidImg} alt="" className="vc-reward-img-icon" />, text: "Earn special recognitions or awards" },
      ]
    }
  ];

  return (
    <div className="earn-vc-page">
      <div className="earn-vc-container">
        <div className="earn-vc-header">
          <button className="earn-vc-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span className="earn-vc-back-text">How to earn VC</span>
          </button>
        </div>

        <section className="earn-vc-intro">
          <h2 className="section-header-text">About</h2>
          <p className="intro-paragraph">
            Venture Coins (VCs) are more than just points — they’re proof that you’re showing up, building, competing, creating, and growing within the E-Cell ecosystem. Every event you attend, idea you pitch, challenge you take on, and contribution you make helps you earn VCs and level up your entrepreneurial journey.
          </p>
        </section>

        <h1 className="main-page-title">How to earn Vc's</h1>

        {sections.map((section, idx) => (
          <section key={idx} className="vc-reward-section">
            <h3 className="vc-reward-tier-title">{section.title}</h3>
            <div className="vc-reward-grid">
              {section.cards.map((card, cidx) => (
                <div key={cidx} className="vc-reward-card">
                  <div className="vc-reward-icon-box">
                    {card.icon}
                  </div>
                  <p className="vc-reward-card-text">{card.text}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
