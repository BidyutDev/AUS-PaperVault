import { Code2, Database, Globe, Layout, Mail, Palette } from 'lucide-react';
import './DevsSection.css';
import Niigadyut from './Niigadyut.jpeg';
import Adih from './adih.jpeg';
import Mehehe from './mehehe.jpeg';

// Custom SVG icons for brands
const GithubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Custom SVG icons for tech stack
const ReactIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="2.139"/>
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M12 6.044c3.6 0 6.737.828 8.627 2.13.852.588 1.478 1.26 1.828 1.988.35.728.431 1.485.231 2.228-.398 1.473-1.93 2.72-4.227 3.56-2.073.757-4.726 1.16-7.459.95-2.733-.21-5.19-.88-6.991-1.91C1.925 13.722.775 12.26.775 10.86c0-1.12.77-2.16 2.094-3.03C4.76 6.872 8.124 6.044 12 6.044z"/>
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M8.272 8.994c1.79-3.137 4.138-5.535 6.233-6.537.946-.453 1.862-.622 2.681-.468.82.154 1.488.62 1.95 1.342.918 1.434.802 3.614-.175 5.943-.882 2.102-2.486 4.347-4.533 6.008-2.047 1.66-4.304 2.742-6.287 3.09-2.198.385-3.847-.15-4.633-1.38-.628-.982-.694-2.27-.29-3.714.435-1.554 1.35-3.256 2.782-4.89"/>
    <path fill="none" stroke="currentColor" strokeWidth="1" d="M8.272 15.006c-1.79-3.137-2.64-6.358-2.366-8.636.124-1.03.453-1.916.956-2.62.503-.705 1.18-1.172 1.993-1.36 1.615-.374 3.52.48 5.28 2.287 1.588 1.63 2.997 4.004 3.838 6.646.842 2.643 1.004 5.192.552 7.05-.5 2.06-1.734 3.163-3.42 3.163-.675 0-1.403-.18-2.163-.53-1.558-.717-3.204-2.092-4.67-3.926"/>
  </svg>
);

const ViteIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M21.805 2.385L12.35 21.235c-.208.414-.803.414-1.012 0L1.895 2.385c-.228-.454.177-.966.666-.844l9.32 2.32c.075.018.153.018.228 0l9.03-2.32c.489-.122.894.39.666.844z" fill="url(#vite-a)"/>
    <path d="M16.32.555l-7.8 1.56c-.154.03-.268.156-.283.313l-.508 5.186c-.02.212.143.397.356.404l2.264.072c.232.007.41.209.375.44l-.408 2.614c-.037.24.157.45.397.432l1.45-.114c.242-.019.436.193.396.432L11.785 16c-.059.347.396.534.576.237l.12-.197 5.71-11.57c.108-.218-.062-.472-.3-.45l-2.263.215c-.237.022-.425-.2-.368-.434l1.248-5.366" fill="url(#vite-b)"/>
    <defs>
      <linearGradient id="vite-a" x1="1.247" y1="1.846" x2="13.014" y2="18.767" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41D1FF"/>
        <stop offset="1" stopColor="#BD34FE"/>
      </linearGradient>
      <linearGradient id="vite-b" x1="11.048" y1=".197" x2="13.937" y2="14.48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FFBD4F"/>
        <stop offset="1" stopColor="#FF9517"/>
      </linearGradient>
    </defs>
  </svg>
);

const TailwindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8 c0.913,0.228,1.565,0.89,2.288,1.624C7.666,17.818,9.027,19.2,12.001,19.2c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8 c-0.913-0.228-1.565-0.89-2.288-1.624C10.337,13.382,8.976,12,6.001,12z"/>
  </svg>
);

const techStack = [
  { name: 'React 19', desc: 'UI Framework', icon: ReactIcon, color: '#61dafb' },
  { name: 'Vite', desc: 'Build Tool', icon: ViteIcon, color: '#bd34fe' },
  { name: 'Tailwind CSS', desc: 'Styling', icon: TailwindIcon, color: '#38bdf8' },
  { name: 'React Router', desc: 'Navigation', icon: Layout, color: '#f44250' },
  { name: 'Lucide React', desc: 'Icon System', icon: Palette, color: '#afb3f7' },
  { name: 'LocalStorage', desc: 'Data Layer', icon: Database, color: '#92bcea' },
];

const developers = [
  {
    name: 'Developer One',
    initials: 'D1',
    image: Niigadyut,
    role: 'Full Stack Developer',
    bio: 'Passionate about building tools that help students succeed. Architecting the backend and frontend integration.',
    skills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
    socials: {
      github: '#',
      linkedin: '#',
      email: 'mailto:dev1@example.com',
      website: '#',
    },
  },
  {
    name: 'Developer Two',
    initials: 'D2',
    image: Mehehe,
    role: 'Frontend Developer & UI Designer',
    bio: 'Crafting pixel-perfect interfaces with a love for design systems, animations, and cyberpunk aesthetics.',
    skills: ['React', 'CSS/Tailwind', 'Figma', 'Motion'],
    socials: {
      github: '#',
      linkedin: '#',
      email: 'mailto:dev2@example.com',
      website: '#',
    },
  },
  {
    name: 'Developer Three',
    initials: 'D3',
    image: Adih,
    role: 'Backend Developer',
    bio: 'Database wizard and API architect. Making sure every paper is stored safely and served lightning fast.',
    skills: ['Python', 'Express', 'PostgreSQL', 'Docker'],
    socials: {
      github: '#',
      linkedin: '#',
      email: 'mailto:dev3@example.com',
      website: '#',
    },
  },
];

export default function DevsSection() {
  return (
    <section className="devs-section">
      {/* Ambient Background */}
      <div className="devs-bg-effects">
        <div className="devs-bg-orb devs-bg-orb-1" />
        <div className="devs-bg-orb devs-bg-orb-2" />
      </div>

      <div className="container-vault devs-content">
        {/* Header */}
        <div className="devs-header">
          <div className="devs-badge">
            <Code2 size={14} />
            Meet The Team
          </div>
          <h1 className="devs-title">
            Built By <span className="devs-title-accent">Students</span>, For Students
          </h1>
          <p className="devs-subtitle">
            We&apos;re a team of Assam University students who designed and built
            this platform to make exam preparation effortless for everyone.
          </p>
        </div>

        {/* ═══════ DEVELOPER CARDS ═══════ */}
        <h2 className="devs-cards-label">👨‍💻 The Developers</h2>
        <div className="devs-grid">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="dev-card animate-slideUp"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="dev-card-bar" />
              <div className="dev-card-inner">
                <div className="dev-avatar">
                  <div className="dev-avatar-ring-outer" />
                  <div className="dev-avatar-ring" />
                  <div className="dev-status" />
                  {dev.image ? (
                    <img src={dev.image} alt={dev.name} className="dev-avatar-image" />
                  ) : (
                    dev.initials
                  )}
                </div>
                <h3 className="dev-name">{dev.name}</h3>
                <span className="dev-role">{dev.role}</span>
                <p className="dev-bio">{dev.bio}</p>

                {/* Skill tags */}
                <div className="dev-skills">
                  {dev.skills.map((skill, i) => (
                    <span key={i} className="dev-skill-tag">{skill}</span>
                  ))}
                </div>

                {/* Social links */}
                <div className="dev-socials">
                  <a href={dev.socials.github} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="GitHub">
                    <GithubIcon />
                  </a>
                  <a href={dev.socials.linkedin} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <LinkedinIcon />
                  </a>
                  <a href={dev.socials.email} className="dev-social-link" title="Email">
                    <Mail size={15} />
                  </a>
                  <a href={dev.socials.website} className="dev-social-link" target="_blank" rel="noopener noreferrer" title="Website">
                    <Globe size={15} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ═══════ TECH STACK ═══════ */}
        <div className="tech-stack-section" style={{ marginTop: '3rem' }}>
          <h2 className="tech-stack-label">⚡ Our Tech Stack</h2>
          <div className="tech-stack-grid">
            {techStack.map((tech, index) => {
              const Icon = tech.icon;
              return (
                <div
                  key={index}
                  className="tech-card animate-slideUp"
                  style={{
                    '--tech-color': tech.color,
                    animationDelay: `${0.5 + index * 0.08}s`,
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

        {/* Terminal-style info */}
        <div className="devs-terminal animate-slideUp" style={{ animationDelay: '1s' }}>
          <div><span className="devs-terminal-prompt">$ </span>cat version.txt</div>
          <div><span className="devs-terminal-value">AUS PaperVault v1.0.0</span></div>
          <div><span className="devs-terminal-prompt">$ </span>echo $STATUS</div>
          <div><span className="devs-terminal-value">🟢 Live — Serving {new Date().getFullYear()}</span></div>
          <div><span className="devs-terminal-prompt">$ </span>echo $MADE_WITH</div>
          <div><span className="devs-terminal-value">☕ Coffee + 💜 Passion + 🎓 AUS</span></div>
        </div>

        <div className="devs-decoration">
          Crafted with passion at AUS // Silchar
        </div>
      </div>
    </section>
  );
}
