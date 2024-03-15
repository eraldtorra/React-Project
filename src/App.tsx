import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { ExploreTop } from './layouts/HomePage/ExploreTop';
import { Carousel } from './layouts/HomePage/Carousel';
import { Heros } from './layouts/HomePage/Heros';

function App() {
  return (
    <div>
      <Navbar />
      <ExploreTop/>
      <Carousel/>
      <Heros/>
    </div>
  );
}

export default App;
