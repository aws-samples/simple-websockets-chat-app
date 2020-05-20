import * as React from 'react'

const Navbar: React.FC = () => {
  return (
    <section className="navbar"></section>
  );
}
const Hero: React.FC = () => {
  return (
    <section className="hero"></section>
  );
}
const SocialProof: React.FC = () => {
  return (
    <section className="socialproof"></section>
  );
}
const CTA: React.FC = () => {
  return (
    <section className="cta"></section>
  );
}
const Features: React.FC = () => {
  return (
    <section className="features"></section>
  );
}
const Footer: React.FC = () => {
  return (
    <section className="footer"></section>
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
