import * as React from 'react'
import '../styles/Home.css'
import Chat from '../components/Chat'
import { RoomContext } from '../context/roomContext';

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
  return (
    <section className="features">
      <h2>Talking without commitment</h2>
      <p>
        People should be able to chat without revealing personal
        information. Image you just arrived to a hostel and want
        to know what's up for tonight. Just scan the code and
        interact with other guests, that simple.
      </p>
      <ul>
        <li>
          <h3>Simple</h3>
          <p>
            Scan the QR Code or open the link and start texting.
            You won't be prompted to fill email, phone number or any other
            kind of information. Not even a name. Get straight to sharing
            your message.
          </p>
        </li>
        <li>
          <h3>Annonymous</h3>
          <p>
            When you join a Chat Room, you get assigned a random color.
            There's no way of knowing who you are unless you share that
            info yourself. All your messages will have the same color, the
            same as the messages from another unknown author will all have the
            same color.
          </p>
        </li>
        <li>
          <h3>Ephimerous</h3>
          <p>
            Conversations are not stored. There's no history. Messages are
            delivered to the people in the Chat Room. If you reload the page
            you will get assigned a new color and only new messages will be
            displayed.
          </p>
        </li>
        <li>
          <h3>Present</h3>
          <p>
            Are you done chatting? just close the tab. You will not get
            notified about new messages in the room. Do you want to join
            again? reload the page and take part of the conversation.
          </p>
        </li>
      </ul>
      <CTA hot>Create Chat</CTA>

    </section>
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
      <Features />
      <Footer />
    </div>
  )
}
