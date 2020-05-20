import * as React from 'react'
import '../styles/Home.css'
import { Message } from '../interfaces';
import Messages from '../components/Messages';
const Navbar: React.FC = () => {
  return (
    <section className="navbar">
      <span>dilo</span>
      <span>new chat</span>
    </section>
  );
}

const MiniChat: React.FC = () => {
  return (
    <div className="minichat">
      <div className="messages">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="bar">
        <div className="input">
        </div>
      </div>
    </div>
  )
}
const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="header">
        <h1>No-accounts Chat</h1>
        <p>
          Start conversations without revealing any personal details.
          No email, no phone #, no login, no surprises.
        </p>
        <MiniChat />
        <CTA>Let's start</CTA>
      </div>
      <div className="subheader">

      </div>
    </section>
  );
}
const SocialProof: React.FC = () => {
  return (
    <section className="socialproof">socialproof</section>
  );
}
const CTA: React.FC = ({ children }) => {
  return (
    <section className="cta">{children}</section>
  );
}
const Features: React.FC = () => {
  return (
    <section className="features">features</section>
  );
}
const Footer: React.FC = () => {
  return (
    <section className="footer">footer</section>
  );
}

export const Home: React.FC = () => {
  return (
    <div className="home">
      <Navbar />
      <Hero />
      <SocialProof />
      <CTA />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}
