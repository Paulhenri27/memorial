import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';
import logo from '../assets/logo.jpeg';
import rightImage from '../assets/right-image.jpg';

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-top">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-background">
        <div className="navbar-content">
          <div className="navbar-right-image">
            <img src={rightImage} alt="Right Image" />
          </div>
          <div className="navbar-text">
            <h1>FELICITE MANGO VEUVE NGUETEMO</h1>
            <h2>1947 - 2024</h2>
          </div>
        </div>
      </div>
      <div className="navbar-bottom">
        <ul>
          <li><NavLink exact to="/" className="nav-link" activeClassName="active">About</NavLink></li>
          <li><NavLink to="/life" className="nav-link" activeClassName="active">Life</NavLink></li>
          <li><NavLink to="/gallery" className="nav-link" activeClassName="active">Gallery</NavLink></li>
          <li><NavLink to="/stories" className="nav-link" activeClassName="active">Stories</NavLink></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

