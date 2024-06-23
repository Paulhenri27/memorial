import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Navigation.css';
import logo from '../assets/bird-removebg-preview.png';
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
          <li>
            <NavLink
              exact="true"
              to="/"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/life"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Life
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Gallery
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/stories"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Stories
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

