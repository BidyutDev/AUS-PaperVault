import { Code2, Globe, Mail, Plus } from 'lucide-react';
import './DevsSection.css';
import Niigadyut from './Niigadyut.jpeg';
import Adih from './adih.jpeg';
import Mehehe from './mehehe.jpeg';
import Bubbly from './Bubbly.jpeg';

/* ─── Brand SVG icons ─── */
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ─── Tech stack icons ─── */
const ReactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="2.139" />
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M12 6.044c3.6 0 6.737.828 8.627 2.13.852.588 1.478 1.26 1.828 1.988.35.728.431 1.485.231 2.228-.398 1.473-1.93 2.72-4.227 3.56-2.073.757-4.726 1.16-7.459.95-2.733-.21-5.19-.88-6.991-1.91C1.925 13.722.775 12.26.775 10.86c0-1.12.77-2.16 2.094-3.03C4.76 6.872 8.124 6.044 12 6.044z" />
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M8.272 8.994c1.79-3.137 4.138-5.535 6.233-6.537.946-.453 1.862-.622 2.681-.468.82.154 1.488.62 1.95 1.342.918 1.434.802 3.614-.175 5.943-.882 2.102-2.486 4.347-4.533 6.008-2.047 1.66-4.304 2.742-6.287 3.09-2.198.385-3.847-.15-4.633-1.38-.628-.982-.694-2.27-.29-3.714.435-1.554 1.35-3.256 2.782-4.89" />
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M8.272 15.006c-1.79-3.137-2.64-6.358-2.366-8.636.124-1.03.453-1.916.956-2.62.503-.705 1.18-1.172 1.993-1.36 1.615-.374 3.52.48 5.28 2.287 1.588 1.63 2.997 4.004 3.838 6.646.842 2.643 1.004 5.192.552 7.05-.5 2.06-1.734 3.163-3.42 3.163-.675 0-1.403-.18-2.163-.53-1.558-.717-3.204-2.092-4.67-3.926" />
  </svg>
);

const TailwindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z" />
  </svg>
);

const ExpressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="22" height="22" fill="currentColor">
    <path d="M126.67 98.44c-4.56 1.16-7.38.05-9.91-3.75-5.68-8.51-11.95-16.63-18-24.9-.78-1.07-1.59-2.12-2.6-3.45C89 76 81.85 85.2 75.14 94.77c-2.4 3.42-4.92 4.91-9.4 3.7l26.92-36.13L67.6 29.71c4.31-.84 7.29-.41 9.93 3.45 5.83 8.52 12.26 16.63 18.67 25.21 6.45-8.55 12.8-16.67 18.8-25.11 2.41-3.42 5-4.72 9.33-3.46-3.28 4.35-6.49 8.63-9.72 12.88-4.36 5.73-8.64 11.53-13.16 17.14-1.61 2-1.35 3.3.09 5.19C109.9 76 118.16 87.1 126.67 98.44zM1.33 61.74c.72-3.61 1.2-7.29 2.2-10.83 6-21.43 30.6-30.34 47.5-17.06C60.93 41.64 63.39 52.62 62.9 65H7.1c-.84 22.21 15.15 35.62 35.53 28.78 7.15-2.4 11.36-8 13.47-15 1.07-3.51 2.84-4.06 6.14-3.06-1.69 8.76-5.52 16.08-13.52 20.66-12 6.86-29.13 4.64-38.14-4.89C5.26 85.89 3 78.92 2 71.39c-.15-1.2-.46-2.38-.7-3.57q.03-3.04.03-6.08zm5.87-1.49h50.43c-.33-16.06-10.33-27.47-24-27.57-15-.12-25.78 11.02-26.43 27.57z" />
  </svg>
);

/* ─── Arrow hint SVG ─── */
const ArrowRight = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ─── Data ─── */
const techStack = [
  { name: 'React', desc: 'UI Framework', icon: ReactIcon, color: '#61dafb' },
  { name: 'Tailwind CSS', desc: 'Styling', icon: TailwindIcon, color: '#38bdf8' },
  { name: 'Express', desc: 'Backend', icon: ExpressIcon, color: '#e2e8f0' },
];

const developers = [
  {
    name: 'Bidyut Priyam Kumar',
    image: Niigadyut,
    role: 'Full Stack Developer',
    dept: 'CSE, TSSOT',
    bio: 'Architecting the backend and frontend integration. Passionate about tools that help students succeed.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    socials: {
      github: 'https://github.com/BidyutDev',
      linkedin: 'https://www.linkedin.com/in/bidyut-priyam-kumar/',
      email: 'mailto:dev1@example.com',
      website: '#',
    },
  },
  {
    name: 'Nilanjan Kumar Roy',
    image: Mehehe,
    role: 'Frontend & UI Designer',
    dept: 'CSE, TSSOT',
    bio: 'Crafting pixel-perfect interfaces with a love for design systems, animations, and sharp aesthetics.',
    skills: ['React', 'CSS/Tailwind', 'Figma', 'Motion'],
    socials: {
      github: 'https://github.com/kamiism',
      linkedin: 'https://www.linkedin.com/in/nilanjan-kumar-roy-186260380/',
      email: 'mailto:dev2@example.com',
      website: '#',
    },
  },
  {
    name: 'Anirban Nath',
    image: Adih,
    role: 'Backend Developer',
    dept: 'CSE, TSSOT',
    bio: 'Database wizard and API architect. Making sure every paper is stored safely and served fast.',
    skills: ['Python', 'Express', 'PostgreSQL', 'Docker'],
    socials: {
      github: 'https://github.com/anirbandotdev',
      linkedin: 'https://www.linkedin.com/in/anirban-nath-42a63b25b/',
      email: 'mailto:anirbandev0101@gmail.com',
      website: '#',
    },
  },
  {
    name: 'Bhavik Lal',
    image: Bubbly,
    role: 'Logo Designer',
    dept: 'CSE, TSSOT',
    bio: 'A catfisher',
    skills: ['Canva', 'Figma'],
    socials: {
      github: '#',
      linkedin: '#',
      email: '#',
      website: '#',
    }
  }
];

/* ─── Dev Card ─── */
function DevCard({ dev, index }) {
  const hasSocials = Object.keys(dev.socials).length > 0;

  if (dev.isOpen) {
    return (
      <div
        className="dev-card dev-card--open animate-slideUp"
        style={{ animationDelay: `${index * 0.12}s` }}
      >
        <div className="dev-card-inner" style={{ transform: 'none', transition: 'none' }}>
          <div className="dev-face dev-face-front" style={{ cursor: 'default' }}>
            <div className="dev-open-icon">
              <Plus size={22} />
            </div>
            <p className="dev-open-title">{dev.name}</p>
            <span className="dev-open-sub">{dev.role}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dev-card animate-slideUp"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="dev-card-inner dual-gallery">
        {/* Face 1: Image covering whole card */}
        <div className="dev-face dev-face-front dev-img-1">
          {dev.image ? (
            <img src={dev.image} alt={dev.name} className="dev-full-image" />
          ) : (
            <div className="dev-full-initials">{dev.initials || dev.name.slice(0, 2)}</div>
          )}
          <div className="dev-name-overlay">
            <p className="dev-front-name">{dev.name}</p>
            <span className="dev-front-role">{dev.role}</span>
          </div>
        </div>

        {/* Face 2: Details */}
        <div className="dev-face dev-face-back dev-img-2">
          <div className="dev-back-header">
            <p className="dev-back-name">{dev.name}</p>
            <div className="dev-back-badges">
              <span className="dev-back-role-badge">{dev.role}</span>
              {dev.dept && <span className="dev-back-dept-badge">{dev.dept}</span>}
            </div>
          </div>

          <p className="dev-bio">{dev.bio}</p>

          {dev.skills.length > 0 && (
            <div className="dev-skills">
              {dev.skills.map((skill, i) => (
                <span key={i} className="dev-skill-tag">{skill}</span>
              ))}
            </div>
          )}

          {hasSocials && (
            <div className="dev-socials">
              {dev.socials.github && (
                <a href={dev.socials.github} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="GitHub">
                  <GithubIcon />
                </a>
              )}
              {dev.socials.linkedin && (
                <a href={dev.socials.linkedin} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <LinkedinIcon />
                </a>
              )}
              {dev.socials.email && (
                <a href={dev.socials.email} className="dev-social-link" title="Email">
                  <Mail size={14} />
                </a>
              )}
              {dev.socials.website && dev.socials.website !== '#' && (
                <a href={dev.socials.website} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="Website">
                  <Globe size={14} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function DevsSection() {
  return (
    <section className="devs-section">
      {/* Ambient bg */}
      <div className="devs-bg-effects">
        <div className="devs-bg-orb devs-bg-orb-1" />
        <div className="devs-bg-orb devs-bg-orb-2" />
      </div>

      <div className="container-vault devs-content">
        {/* Header */}
        <div className="devs-header">
          <div className="devs-badge">
            <Code2 size={13} />
            Meet the team
          </div>
          <h1 className="devs-title">
            Built by <span className="devs-title-accent">Students</span>, for Students
          </h1>
          <p className="devs-subtitle">
            A team of Assam University students who designed and built this platform
            to make exam preparation effortless for everyone.
          </p>
        </div>

        {/* Dev cards */}
        <h2 className="section-label">The Developers</h2>
        <div className="devs-grid">
          {developers.map((dev, i) => (
            <DevCard key={i} dev={dev} index={i} />
          ))}
        </div>

        {/* Tech stack */}
        <div className="tech-stack-section">
          <h2 className="section-label">Our Tech Stack</h2>
          <div className="tech-stack-grid">
            {techStack.map((tech, i) => {
              const Icon = tech.icon;
              return (
                <div
                  key={i}
                  className="tech-card animate-slideUp"
                  style={{
                    '--tech-color': tech.color,
                    animationDelay: `${0.5 + i * 0.1}s`,
                  }}
                >
                  <div className="tech-icon-wrapper" style={{ color: tech.color }}>
                    <Icon />
                  </div>
                  <span className="tech-name">{tech.name}</span>
                  <span className="tech-desc">{tech.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Terminal */}
        <div className="devs-terminal animate-slideUp" style={{ animationDelay: '1s' }}>
          <div><span className="devs-terminal-prompt">$ </span>cat version.txt</div>
          <div><span className="devs-terminal-value">AUS PaperVault v1.0.0</span></div>
          <div><span className="devs-terminal-prompt">$ </span>echo $STATUS</div>
          <div><span className="devs-terminal-value">Live — Serving {new Date().getFullYear()}</span></div>
          <div><span className="devs-terminal-prompt">$ </span>echo $MADE_WITH</div>
          <div><span className="devs-terminal-value">Coke + Passion + AUS</span></div>
        </div>

        <div className="devs-decoration">
          Crafted with passion at AUS — Silchar
        </div>
      </div>
    </section>
  );
}