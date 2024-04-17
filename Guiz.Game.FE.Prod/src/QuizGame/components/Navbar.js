import React, { useState, useEffect } from "react";
import "./Navbar.css";
import settings_icon from "../img/settings.svg";
import rules_icon from "../img/info.svg";
import share_icon from "../img/share.svg";
import close_icon from "../img/close.svg";
import SessionStore from "../backend/SessionStore";

import RulesModal from "./modals/RulesModal";
import SettingsModal from "./modals/Settings";

function Navbar() {
  const [session, setSession] = useState(SessionStore.getData());
  const updateData = () => {
    setSession(SessionStore.getData());
  };
  useState(() => {
    SessionStore.addListener(updateData);

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      const index = SessionStore.listeners.indexOf(updateData);
      if (index !== -1) {
        SessionStore.listeners.splice(index, 1);
      }
    };
  }, []);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Modal handling RulesModal
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setImageSrcRules(initialImageSrcRules);
    setShowModal(false);
  };
  //end of modal handling

  // Modal handling SettingsModal
  const [showModalSettings, setShowModalSettings] = useState(false);

  const handleShowModalSettings = () => {
    setShowModalSettings(true);
  };

  const handleCloseModalSettings = () => {
    setImageSrcSettings(initialImageSrcSettings);
    setShowModalSettings(false);
  };
  //end of modal handling

  // Modal handling ShareModal
  const [showModalShare, setShowModalShare] = useState(false);

  const handleShowModalShare = () => {
    setShowModalShare(true);
  };

  const handleCloseModalShare = () => {
    setImageSrcShare(initialImageSrcShare);
    setShowModalShare(false);
  };
  //end of modal handling

  // Alert dot handling
  const [isElementDotHidden, setIsElementDotHidden] = useState(false);

  useEffect(() => {
    const storedStateDot = localStorage.getItem("isElementDotHidden");
    setIsElementDotHidden(storedStateDot === "true");
  }, []);

  const hideDotElement = () => {
    setIsElementDotHidden(true);
    localStorage.setItem("isElementDotHidden", "true");
  };
  //end of alert dot handling

  // Icon changing
  const [imageSrcSettings, setImageSrcSettings] = useState(settings_icon);
  const initialImageSrcSettings = settings_icon;
  const [imageSrcRules, setImageSrcRules] = useState(rules_icon);
  const initialImageSrcRules = rules_icon;
  const [imageSrcShare, setImageSrcShare] = useState(share_icon);
  const initialImageSrcShare = share_icon;

  const handleButtonClickSettings = () => {
    setImageSrcSettings(close_icon);
  };

  const handleButtonClickRules = () => {
    setImageSrcRules(close_icon);
  };

  const handleButtonClickShare = () => {
    setImageSrcShare(close_icon);
  };

  const handleEndGame = () => {
    localStorage.clear();
    SessionStore.resetSession();
  };

  return (
    <nav
      className={`navbar mobile_navbar zbig ${isExpanded ? "expanded" : ""}`}
    >
      <div className="nav_expanded">
        <ul className="nav-links">
          <li>
            <a
              href="#"
              onClick={() => {
                handleShowModalSettings();
                handleButtonClickSettings();
              }}
            >
              <img src={imageSrcSettings} alt="settings_icon" />
              {/* <i className={`fas fa-bars`}></i> */}
            </a>
          </li>
        </ul>
        <ul className="nav-links">
          <li>
            <a
              href="#"
              onClick={() => {
                handleShowModal();
                handleButtonClickRules();
              }}
            >
              <img src={imageSrcRules} alt="rules_icon" />
            </a>
          </li>
          {!isElementDotHidden && <div className="alert_dot"></div>}
          <a
            href="#"
            onClick={() => {
              handleShowModalShare();
              hideDotElement();
              handleButtonClickShare();
            }}
          >
            <img src={imageSrcShare} alt="share_icon" className="logo" />
          </a>
          <RulesModal
            showModal={showModal}
            handleCloseModal={handleCloseModal}
          />
          <SettingsModal
            handleEndGame={handleEndGame}
            type={"settings"}
            showModal={showModalSettings}
            handleCloseModal={handleCloseModalSettings}
          />
          <SettingsModal
            handleEndGame={handleEndGame}
            type={"share"}
            showModal={showModalShare}
            handleCloseModal={handleCloseModalShare}
          />
        </ul>
      </div>
      {isExpanded && (
        <div className="title_settings">
          <h2 className="text-center title_players_settings">Menu</h2>
          <a href="/info" className="center_row">
            <div className="score_row_settings">
              <div className="number_text_board">Rules</div>
              <div className="">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </a>
          <a href="#" className="center_row">
            <div className="score_row_settings">
              <div className="number_text_board">About Us</div>
              <div className="">
                <i className="fas fa-arrow-right"></i>
              </div>
            </div>
          </a>
          {session.status !== "home" && (
            <a onClick={handleEndGame} href="/" className="center_row">
              <div className="score_row_settings">
                <div className="number_text_board red_text">Leave Game</div>
                <div className="">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
