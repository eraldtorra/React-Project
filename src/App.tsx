import React from 'react';
import './App.css';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { ExploreTop } from './layouts/HomePage/ExploreTop';
import { Carousel } from './layouts/HomePage/Carousel';
import { Heros } from './layouts/HomePage/Heros';
import { LibraryServices } from './layouts/HomePage/LibraryServices';
import {Footer} from "./layouts/NavbarAndFooter/Footer";

function App() {
  return (
    <div>
      <Navbar />
      <ExploreTop/>
      <Carousel/>
      <Heros/>
      <LibraryServices/>
        <Footer/>
    </div>
  );
}

export default App;
