import * as React from 'react'
import '../styles/Home.css'
import Chat from '../components/Chat'
import { RoomContext } from '../context/roomContext';
import { clsn } from '../helpers/color'
const Navbar: React.FC = () => {
  return (
    <div className="navbar">
      <span className="link">dilo</span>
      <span className="link">new chat</span>
    </div>
  );
}

const MiniChat: React.FC = () => {
  const { joinRoom, leaveRoom } = React.useContext(RoomContext);
  React.useEffect(() => {
    joinRoom('home');
    return () => leaveRoom('home');
  }, []);
  return (
    <div className="minichat">
      <div className="room">
        <Chat />
      </div>
    </div>
  )
}
const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="header">
        <h1>No-accounts Chat</h1>
        <p>
          Start conversations without revealing any personal details.
          No email, no phone #, no login, no surprises.
        </p>
        <CTA>Get Started</CTA>
      </div>
      <div className="subheader">
        <MiniChat />
      </div>
    </div>
  );
}
const CTA: React.FC<{hot?: boolean}> = ({ children, hot }) => {
  return (
    <div className={"cta" + (hot ? ' hot' : '')}>
      {children}
    </div>
  );
}

const Features: React.FC = () => {
  const features: { headline: string, copy: string}[] = [
    { headline: 'Simple', copy: `Scan the QR Code or open the link and start texting. You won't be prompted to fill email, phone number or any other kind of information. Not even a name. Get straight to sharing your message.`},
    { headline: 'Annonymous', copy: `When you join a Chat Room, you get assigned a random color. There's no way of knowing who you are unless you share that info yourself. All your messages will have the same color, the same as the messages from another unknown author will all have the same color.` },
    { headline: 'Ephimerous', copy: `Conversations are not stored. There's no history. Messages are delivered to the people in the Chat Room. If you reload the page you will get assigned a new color and only new messages will be displayed.` },
    { headline: 'Present', copy: `Are you done chatting? just close the tab. You will not get notified about new messages in the room. Do you want to join again? reload the page and take part of the conversation.` },
  ];
  return (
    <div className="features sticky-section clearfix">
      <div className="sticky-column">
        <h2>Talking without commitment</h2>
        <p>
          People should be able to chat without revealing personal
          information. Image you just arrived to a hostel and want
          to know what's up for tonight. Just scan the code and
          interact with other guests, that simple.
        </p>
      </div>
      <div className="sticky-cards-wrap">
        {features.map(({ headline, copy }) => (
          <div className="sticky-card" key={headline}>
            <div className="sticky-card-header">
              <h3>{headline}</h3>
            </div>
            <p className="sticky-card-copy">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="rights">      
      </div>
    </div>
  );
}

const Section: React.FC<{white?: boolean}> = ({ white, children }) => {
  return (
    <div className={clsn("section", white && "white")}>
      <div className="container">
        {children}
      </div>
    </div>
  )
}

export const Home: React.FC = () => {
  return (
    <div className="home">
      <Section white>
        <Navbar />
        <Hero />
      </Section>

      <Section>
        <Features />
      </Section>

      <Section white>
        <Footer />
      </Section>
    </div>
  )
}
