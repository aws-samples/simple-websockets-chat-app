import * as React from 'react'
import '../styles/Home.css'
import ShareRoom from '../components/ShareRoom';
const Navbar: React.FC = () => {
  return (
    <section className="navbar">
      <span>dilo</span>
      <span>new conversation</span>
    </section>
  );
}
const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="header">
        <h1>No-accounts Chat</h1>
      </div>
      <div className="subheader">
        Annonymous Conversations
      </div>
    </section>
  );
}
const SocialProof: React.FC = () => {
  return (
    <section className="socialproof">socialproof</section>
  );
}
const CTA: React.FC = () => {
  return (
    <section className="cta">cta</section>
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
