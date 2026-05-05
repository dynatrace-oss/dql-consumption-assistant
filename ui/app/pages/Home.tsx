import React, { Fragment } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import WelcomePage from './welcome/WelcomePage';

const Home: React.FC = () => {
  // gives location details
  const currentLocation = useLocation();
  const homeUrl = '/';
  const isHomePage = currentLocation.pathname === homeUrl;

  return <Fragment>{isHomePage ? <WelcomePage /> : <Outlet />}</Fragment>;
};

export default Home;
