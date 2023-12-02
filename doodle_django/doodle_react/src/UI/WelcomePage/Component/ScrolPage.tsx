// Import necessary modules
import React, { useState, useEffect } from 'react';
import '../CSS/styleLanding.css';
import WelcomePage from './WelcomePage';
import Example from './Example';


const ScrollPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogin = () => {
    console.log("LOGIN")
    
  };

  return (
    <div className={`landing-page ${isScrolled ? 'scrolled' : ''}`}>
      {isScrolled && (
        <header>
          <nav className="toolbar">
            <div className="logo">Doodle</div>
            <ul className="nav-links">
              <li onClick={handleLogin}>Login</li>
              
            </ul>
          </nav>
        </header>
      )}
      <main>
        <section className="hero">

        <WelcomePage />
     
        </section>
       </main>

      <footer>
  
            <Example />
      </footer>
    </div>
  );
};

export default ScrollPage;


