import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from 'react'
import './App.css'
import './enhancements.css'

type Course = {
  id: number
  title: string
  category: string
  instructor: string
  progress: number
  lessons: number
  completed: number
  color: string
  icon: string
  description: string
  duration: string
  level: string
  topics: string[]
}

const courses: Course[] = [
  { id: 1, title: 'Advanced React Patterns', category: 'Development', instructor: 'Maya Chen', progress: 68, lessons: 24, completed: 16, color: 'yellow', icon: '⚛', description: 'Build resilient React interfaces with composition, state machines, and performance patterns.', duration: '8 weeks', level: 'Advanced', topics: ['Compound components', 'Render props', 'Performance'] },
  { id: 2, title: 'Product Design Foundations', category: 'Design', instructor: 'Alex Morgan', progress: 42, lessons: 18, completed: 8, color: 'purple', icon: '✦', description: 'Learn the practical design process from first sketch to validated product experience.', duration: '6 weeks', level: 'Beginner', topics: ['User research', 'Wireframing', 'Prototyping'] },
  { id: 3, title: 'Data Science with Python', category: 'Data Science', instructor: 'Dr. Liam Patel', progress: 24, lessons: 32, completed: 8, color: 'blue', icon: '⌁', description: 'Turn messy datasets into useful insights with Python, pandas, and visual storytelling.', duration: '10 weeks', level: 'Intermediate', topics: ['Pandas', 'Statistics', 'Data visualization'] },
  { id: 4, title: 'TypeScript for Product Teams', category: 'Development', instructor: 'Noah Williams', progress: 0, lessons: 20, completed: 0, color: 'yellow', icon: 'TS', description: 'Make large frontend codebases safer and easier to evolve with practical TypeScript.', duration: '5 weeks', level: 'Intermediate', topics: ['Generics', 'API types', 'Refactoring'] },
  { id: 5, title: 'Machine Learning Essentials', category: 'Artificial Intelligence', instructor: 'Priya Shah', progress: 0, lessons: 28, completed: 0, color: 'purple', icon: '◈', description: 'Understand the intuition behind modern machine learning and build your first models.', duration: '9 weeks', level: 'Intermediate', topics: ['Regression', 'Classification', 'Model evaluation'] },
  { id: 6, title: 'Cloud Architecture with AWS', category: 'Cloud', instructor: 'Owen Brooks', progress: 0, lessons: 22, completed: 0, color: 'blue', icon: '☁', description: 'Design secure, scalable cloud systems using the core AWS architecture principles.', duration: '7 weeks', level: 'Advanced', topics: ['Networking', 'Containers', 'Scalability'] },
  { id: 7, title: 'Cybersecurity Fundamentals', category: 'Security', instructor: 'Samira Okafor', progress: 0, lessons: 26, completed: 0, color: 'yellow', icon: '⌁', description: 'Build strong security habits and learn how modern teams identify and reduce risk.', duration: '8 weeks', level: 'Beginner', topics: ['Threat modeling', 'Identity', 'Incident response'] },
  { id: 8, title: 'SQL and Database Design', category: 'Data', instructor: 'Ethan Cole', progress: 0, lessons: 19, completed: 0, color: 'purple', icon: '▦', description: 'Model reliable data and write SQL queries that remain understandable as systems grow.', duration: '5 weeks', level: 'Intermediate', topics: ['Schema design', 'Joins', 'Indexes'] },
  { id: 9, title: 'Communication for Engineers', category: 'Career', instructor: 'Elena Rossi', progress: 0, lessons: 14, completed: 0, color: 'blue', icon: '↗', description: 'Communicate technical decisions clearly in writing, meetings, and product reviews.', duration: '4 weeks', level: 'Beginner', topics: ['Writing', 'Presentations', 'Feedback'] },
]

const navItems = ['Overview', 'My Courses', 'AI Tutor', 'Assignments', 'Achievements', 'Settings']
type Profile = { name: string; email: string; bio: string; goal: string }

const defaultProfile: Profile = { name: 'Jordan Davis', email: 'demo@vertexlearn.com', bio: 'Building better habits, one lesson at a time.', goal: 'Become a stronger full-stack developer' }

const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

function LiveBackground() {
  return <div className="live-background" aria-hidden="true"><div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" /><div className="ambient-grid" />{Array.from({ length: 14 }, (_, index) => <span className="ambient-particle" key={index} style={{ '--particle-x': `${(index * 37) % 100}%`, '--particle-y': `${(index * 61) % 100}%`, '--particle-delay': `${(index % 7) * -1.7}s` } as CSSProperties} />)}</div>
}

function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('demo@vertexlearn.com')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (email === 'demo@vertexlearn.com' && password === 'demo123') onLogin()
    else setError('Use the demo credentials shown below.')
  }
  return <div className="login-shell"><LiveBackground /><div className="login-glow" /><div className="login-card"><div className="brand login-brand"><span className="brand-mark">V</span><span>vertex<span className="brand-accent">learn</span></span></div><p className="eyebrow">STUDENT WORKSPACE</p><h1>Welcome back.</h1><p className="login-copy">Continue your learning journey with a clearer next step.</p><form onSubmit={submit}><label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></label><label>Password<input value={password} onChange={(event) => setPassword(event.target.value)} type="password" /></label>{error && <p className="login-error">{error}</p>}<button className="primary-button login-submit">Sign in <span>→</span></button></form><div className="demo-credentials"><strong>Demo account</strong><span>demo@vertexlearn.com</span><span>demo123</span></div></div></div>
}

function WorkspacePage({ page, onTutor, onAction }: { page: string; onTutor: () => void; onAction: (text: string) => void }) {
  const [showMore, setShowMore] = useState(false)
  const content: Record<string, { eyebrow: string; title: string; description: string; action: string; cards: string[] }> = {
    'My Courses': { eyebrow: 'YOUR LIBRARY', title: 'My courses', description: 'Everything you are learning, in one place.', action: 'Browse courses', cards: ['Advanced React Patterns', 'Product Design Foundations', 'Data Science with Python'] },
    'Assignments': { eyebrow: 'STAY ON TRACK', title: 'Assignments', description: 'Plan your next submission and keep deadlines under control.', action: 'View calendar', cards: ['Submit design critique', 'React hooks quiz', 'Python data wrangling'] },
    'Achievements': { eyebrow: 'YOUR PROGRESS', title: 'Achievements', description: 'Small wins add up to meaningful progress.', action: 'View leaderboard', cards: ['12 day learning streak', 'First course milestone', 'Quiz score: 90%'] },
    Settings: { eyebrow: 'PERSONALIZE', title: 'Settings', description: 'Manage your preferences and account details.', action: 'Save changes', cards: ['Profile preferences', 'Learning reminders', 'Notification settings'] },
  }
  if (page === 'AI Tutor') return <div className="workspace-page"><div className="workspace-hero ai-hero"><div><p className="eyebrow">YOUR LEARNING COMPANION</p><h1>Ask better questions.<br /><span>Learn with confidence.</span></h1><p className="subheading">Get clear explanations grounded in your course material.</p></div><button className="primary-button" onClick={onTutor}>Open tutor <span>→</span></button></div><div className="feature-grid"><div><span className="feature-number">01</span><h3>Explain a concept</h3><p>Break down difficult topics at the right level for you.</p></div><div><span className="feature-number">02</span><h3>Build a study plan</h3><p>Turn your goals into a practical weekly routine.</p></div><div><span className="feature-number">03</span><h3>Practice smarter</h3><p>Generate focused questions from your active courses.</p></div></div></div>
  const data = content[page] ?? content['My Courses']
  const visibleCards = showMore ? [...data.cards, ...(page === 'My Courses' ? ['Machine Learning Essentials', 'Cloud Architecture with AWS', 'Cybersecurity Fundamentals'] : page === 'Assignments' ? ['Accessibility review', 'Portfolio reflection', 'SQL practice test'] : [])] : data.cards
  return <div className="workspace-page"><div className="workspace-hero"><div><p className="eyebrow">{data.eyebrow}</p><h1>{data.title}</h1><p className="subheading">{data.description}</p></div><button className="primary-button" onClick={() => page === 'Settings' ? onAction('Settings saved') : onTutor()}>{data.action} <span>→</span></button></div><div className="workspace-list">{visibleCards.map((card, index) => <article className="workspace-row" key={card}><span className="row-index">{String(index + 1).padStart(2, '0')}</span><div><h3>{card}</h3><p>{page === 'Assignments' ? `Due ${index === 0 ? 'tomorrow' : `November ${index + 1}`}` : page === 'Settings' ? 'Review and update this preference' : 'In progress · Continue where you left off'}</p></div><button className="row-action" onClick={() => page === 'Settings' ? onAction(`${card} opened`) : onTutor()}>{page === 'Assignments' ? 'Open' : 'View'} <span>→</span></button></article>)}</div>{(page === 'My Courses' || page === 'Assignments') && <button className="view-more-button" onClick={() => setShowMore((value) => !value)}>{showMore ? 'Show less' : 'View more'} <span>{showMore ? '↑' : '↓'}</span></button>}</div>
}

function ProfileEditor({ profile, onSave, onLogout }: { profile: Profile; onSave: (profile: Profile) => void; onLogout: () => void }) {
  const [draft, setDraft] = useState(profile)
  return <div className="profile-editor workspace-page"><div className="workspace-hero"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Edit profile</h1><p className="subheading">Keep your learning profile up to date.</p></div><button className="primary-button" onClick={() => onSave(draft)}>Save profile <span>→</span></button></div><div className="profile-layout"><div className="profile-preview"><div className="large-avatar">{initials(draft.name) || 'JD'}</div><h2>{draft.name || 'Your name'}</h2><p>{draft.email || 'your@email.com'}</p><span className="profile-status">Student account</span><button className="logout-button" onClick={onLogout}>Sign out</button></div><form className="profile-form" onSubmit={(event) => { event.preventDefault(); onSave(draft) }}><label>Full name<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Your full name" /></label><label>Email address<input value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} type="email" placeholder="you@example.com" /></label><label>Learning goal<input value={draft.goal} onChange={(event) => setDraft({ ...draft, goal: event.target.value })} placeholder="What are you working toward?" /></label><label>About you<textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} rows={4} placeholder="Tell your learning community about yourself" /></label><button className="secondary-button" type="submit">Save changes</button></form></div></div>
}

function CourseDetail({ course, onClose, onEnroll }: { course: Course; onClose: () => void; onEnroll: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="course-detail-modal" role="dialog" aria-modal="true" aria-labelledby="course-detail-title" onClick={(event) => event.stopPropagation()}><button className="detail-close" aria-label="Close course details" onClick={onClose}>×</button><div className={`detail-art ${course.color}`}><span>{course.icon}</span><small>{course.category.toUpperCase()}</small></div><div className="detail-content"><p className="eyebrow">{course.level.toUpperCase()} · {course.duration}</p><h2 id="course-detail-title">{course.title}</h2><p className="detail-description">{course.description}</p><div className="detail-meta"><span><strong>Instructor</strong>{course.instructor}</span><span><strong>Lessons</strong>{course.lessons} lessons</span><span><strong>Rating</strong>4.9 / 5</span></div><h3>What you’ll learn</h3><div className="topic-list">{course.topics.map((topic) => <span key={topic}>✓ {topic}</span>)}</div><button className="primary-button detail-action" onClick={onEnroll}>{course.progress ? 'Continue course' : 'Enroll in course'} <span>→</span></button></div></section></div>
}

function NotesPanel({ notes, onSave, onClose }: { notes: string; onSave: (notes: string) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(notes)
  return <div className="modal-backdrop" onClick={onClose}><section className="notes-modal" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="ai-orb">▤</span><div><h2>Study notes</h2><p>Capture ideas while they are fresh</p></div></div><button onClick={onClose}>×</button></div><div className="notes-body"><label>Quick note<textarea autoFocus value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a takeaway, question, or reminder..." rows={9} /></label><div className="notes-footer"><span>{draft.length} characters</span><button className="primary-button" onClick={() => { onSave(draft); onClose() }}>Save note <span>→</span></button></div></div></section></div>
}

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('vertexlearn:logged-in') === 'true')
  const [activeNav, setActiveNav] = useState('Overview')
  const [query, setQuery] = useState('')
  const [tutorOpen, setTutorOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sentMessages, setSentMessages] = useState<string[]>(() => {
    const saved = localStorage.getItem('vertexlearn:tutor-messages')
    return saved ? JSON.parse(saved) as string[] : []
  })
  const [completedTasks, setCompletedTasks] = useState<number[]>(() => {
    const saved = localStorage.getItem('vertexlearn:tasks')
    return saved ? JSON.parse(saved) as number[] : []
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [liveMinutes, setLiveMinutes] = useState(1470)
  const [liveCourses, setLiveCourses] = useState(courses)
  const [liveScore, setLiveScore] = useState(87)
  const [liveActivity, setLiveActivity] = useState([35, 54, 42, 75, 58, 88, 46])
  const [lastLiveUpdate, setLastLiveUpdate] = useState('now')
  const [todayLabel] = useState(() => new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase())
  const [toast, setToast] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [focusDone, setFocusDone] = useState(false)
  const [focusSeconds, setFocusSeconds] = useState(20 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [notes, setNotes] = useState(() => localStorage.getItem('vertexlearn:notes') ?? '')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('vertexlearn:enrollments')
    return saved ? JSON.parse(saved) as number[] : []
  })
  const [tutorReplies, setTutorReplies] = useState<Record<string, string>>({})
  const [profile, setProfile] = useState<Profile>(() => {
    const saved = localStorage.getItem('vertexlearn:profile')
    return saved ? JSON.parse(saved) as Profile : defaultProfile
  })

  const showToast = (text: string) => {
    setToast(text)
    window.setTimeout(() => setToast(''), 2600)
  }

  const saveProfile = (nextProfile: Profile) => {
    const cleanProfile = { ...nextProfile, name: nextProfile.name.trim(), email: nextProfile.email.trim() }
    if (!cleanProfile.name || !cleanProfile.email) {
      showToast('Name and email are required')
      return
    }

    setProfile(cleanProfile)
    localStorage.setItem('vertexlearn:profile', JSON.stringify(cleanProfile))
    showToast('Profile updated successfully')
  }

  const saveNotes = (nextNotes: string) => {
    setNotes(nextNotes)
    localStorage.setItem('vertexlearn:notes', nextNotes)
    showToast('Study note saved')
  }

  const enrollInCourse = (course: Course) => {
    if (enrolledCourseIds.includes(course.id)) {
      showToast(`${course.title} is already in your learning plan`)
      return
    }
    const nextIds = [...enrolledCourseIds, course.id]
    setEnrolledCourseIds(nextIds)
    localStorage.setItem('vertexlearn:enrollments', JSON.stringify(nextIds))
    showToast(`${course.title} added to your learning plan`)
    setSelectedCourse(null)
  }

  useEffect(() => {
    localStorage.setItem('vertexlearn:tasks', JSON.stringify(completedTasks))
  }, [completedTasks])

  useEffect(() => {
    const timer = window.setInterval(() => setLiveMinutes((value) => value + 1), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveCourses((current) => current.map((course, index) => {
        if (index !== 0 || course.progress >= 100) return course
        const progress = Math.min(100, course.progress + 1)
        return { ...course, progress, completed: Math.min(course.lessons, Math.round(course.lessons * progress / 100)) }
      }))
      setLiveScore((score) => Math.min(99, score + (Math.random() > 0.45 ? 1 : 0)))
      setLiveActivity((activity) => [...activity.slice(1), Math.min(100, activity[activity.length - 1] + (Math.random() > 0.5 ? 2 : -1))])
      setLastLiveUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }, 8000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const closeOverlays = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setTutorOpen(false)
      setSelectedCourse(null)
      setNotesOpen(false)
      setNotificationsOpen(false)
    }
    window.addEventListener('keydown', closeOverlays)
    return () => window.removeEventListener('keydown', closeOverlays)
  }, [])

  useEffect(() => {
    if (!timerRunning) return
    const timer = window.setInterval(() => {
      setFocusSeconds((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false)
          showToast('Focus session complete · +30 XP')
          return 20 * 60
        }
        return seconds - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [timerRunning])

  const filteredCourses = useMemo(
    () => liveCourses.filter((course) => `${course.title} ${course.category}`.toLowerCase().includes(query.toLowerCase())),
    [liveCourses, query],
  )

  const sendMessage = () => {
    if (!message.trim()) return
    const prompt = message.trim()
    const response = prompt.toLowerCase().includes('react')
      ? 'React patterns become easier when you separate composition from data flow. Start with small reusable components, then use a custom hook when several screens share the same stateful behavior.'
      : prompt.toLowerCase().includes('plan')
        ? 'Here is a simple plan: 20 minutes of React on Monday, one practice exercise Tuesday, review notes Wednesday, and a 30-minute project session on Thursday.'
        : 'That is a useful question. Based on your current courses, I recommend connecting the idea to a small practice project and reviewing the related lesson notes.'
    setSentMessages((current) => [...current, prompt])
    setTutorReplies((current) => ({ ...current, [prompt]: response }))
    localStorage.setItem('vertexlearn:tutor-messages', JSON.stringify([...sentMessages, prompt]))
    showToast('Message saved to your tutor history')
    setMessage('')
  }

  if (!loggedIn) return <Login onLogin={() => { localStorage.setItem('vertexlearn:logged-in', 'true'); setLoggedIn(true) }} />

  return (
    <div className="app-shell"><LiveBackground />
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand"><span className="brand-mark">V</span><span>vertex<span className="brand-accent">learn</span></span></div>
        <div className="workspace-label">LEARNING SPACE</div>
        <nav>
          {navItems.map((item, index) => (
            <button className={`nav-item ${activeNav === item ? 'active' : ''}`} onClick={() => { setActiveNav(item); setMenuOpen(false) }} key={item}>
              <span className="nav-icon">{['⌂', '▤', '✦', '✓', '♢', '⚙'][index]}</span>{item}
              {item === 'Assignments' && <span className="nav-badge">3</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><span className="sparkle">✦</span><strong>Unlock your potential</strong><p>Get unlimited access to every course.</p><button onClick={() => showToast('Pro preview added to your workspace')}>Explore Pro <span>→</span></button></div>
          <button className="user-row user-row-button" onClick={() => setActiveNav('Settings')}><div className="avatar">{initials(profile.name)}</div><div><strong>{profile.name}</strong><small>Student account</small></div><span className="more">•••</span></button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{activeNav}</strong></div>
          <div className="top-actions">
            <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label>
            <button className="icon-button notification" aria-label="Notifications" onClick={() => setNotificationsOpen((value) => !value)}>♢<i /></button>
            <button className="top-avatar avatar-button" onClick={() => setActiveNav('Settings')} aria-label="Edit profile">{initials(profile.name)}</button>
            {notificationsOpen && <div className="notification-drawer"><div className="drawer-heading"><strong>Notifications</strong><button onClick={() => setNotificationsOpen(false)}>×</button></div><div className="drawer-item"><span className="drawer-dot yellow-dot">✦</span><div><strong>New lesson available</strong><p>Advanced React Patterns · 5 min ago</p></div></div><div className="drawer-item"><span className="drawer-dot green-dot">✓</span><div><strong>Assignment deadline reminder</strong><p>Design critique is due tomorrow</p></div></div><button className="drawer-link" onClick={() => { setNotificationsOpen(false); showToast('All notifications marked as read') }}>Mark all as read</button></div>}
          </div>
        </header>
        <div className="demo-banner"><span>DEMO MODE</span> Data is stored locally in this browser <button onClick={() => showToast('Demo data is stored locally in this browser')}>Learn more</button></div>

        <div className="page-content">
         {activeNav !== 'Overview' && activeNav !== 'Settings' && <WorkspacePage page={activeNav} onTutor={() => setTutorOpen(true)} onAction={showToast} />}
         {activeNav === 'Settings' && <ProfileEditor profile={profile} onSave={saveProfile} onLogout={() => { localStorage.removeItem('vertexlearn:logged-in'); setLoggedIn(false); showToast('Signed out safely') }} />}
         {activeNav === 'Overview' && <>
          <section className="welcome-row">
            <div><p className="eyebrow">{todayLabel}</p><h1>Good morning, {profile.name.split(' ')[0]} <span>✦</span></h1><p className="subheading">Keep your momentum going. You’re doing great.</p></div>
            <button className="primary-button" onClick={() => setTutorOpen(true)}><span>✦</span> Ask AI Tutor</button>
          </section>

          <section className="stats-grid">
            <article className="stat-card"><div className="stat-top"><span>Learning hours</span><span className="stat-icon yellow-icon">◷</span></div><strong>{(liveMinutes / 60).toFixed(1)} <small>hrs</small></strong><div className="trend positive">↗ 12.8% <span>live this week</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Course progress</span><span className="stat-icon purple-icon">▣</span></div><strong>48<small>%</small></strong><div className="trend positive">↗ 8.4% <span>vs last week</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Current streak</span><span className="stat-icon orange-icon">♨</span></div><strong>12 <small>days</small></strong><div className="trend neutral">Keep it going! <span>Best: 18 days</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Average score</span><span className="stat-icon green-icon">♢</span></div><strong>{liveScore}<small>%</small></strong><div className="trend positive">↗ 4.2% <span>live average</span></div></article>
            <article className="stat-card"><div className="stat-top"><span>Lessons completed</span><span className="stat-icon blue-icon">✓</span></div><strong>32 <small>lessons</small></strong><div className="trend positive">↗ 6 this week</div></article>
            <article className="stat-card"><div className="stat-top"><span>Certificates</span><span className="stat-icon pink-icon">✧</span></div><strong>4 <small>earned</small></strong><div className="trend neutral">1 nearly ready</div></article>
          </section>

          <section className="content-grid">
            <div className="primary-column">
              <div className="section-heading"><div><h2>Continue learning</h2><p>Pick up where you left off</p></div><button className="text-button" onClick={() => setActiveNav('My Courses')}>View more <span>→</span></button></div>
              <div className="course-list">
                {filteredCourses.slice(0, 4).map((course) => <article className="course-card" key={course.id}>
                  <div className={`course-art ${course.color}`}><span>{course.icon}</span><small>{course.category.toUpperCase()}</small></div>
                  <div className="course-info"><div className="course-label">{course.category} <span>•</span> {course.lessons} lessons</div><h3>{course.title}</h3><p>with {course.instructor}</p><div className="progress-meta"><span>{course.completed} of {course.lessons} lessons</span><strong>{course.progress}%</strong></div><div className="progress-track"><div style={{ width: `${course.progress}%` }} /></div><button className="continue-button" onClick={() => setSelectedCourse(course)}>{course.progress ? 'View course details' : 'Explore course'} <span>→</span></button></div>
                </article>)}
                {!filteredCourses.length && <div className="empty-state">No courses match “{query}”. Try another search.</div>}
              </div>
            </div>
            <aside className="right-column">
              <div className="section-heading"><div><h2>Weekly activity</h2><p>Your learning rhythm</p></div><button className="dots" aria-label="Weekly activity options" onClick={() => showToast('Weekly activity is up to date')}>•••</button></div>
              <div className="activity-card"><div className="activity-total"><strong>6.4 <small>hrs</small></strong><span className="live-indicator"><i /> Live demo</span></div><div className="chart">{liveActivity.map((height, index) => <div className="bar-wrap" key={index}><div className={`bar ${index === 5 ? 'today' : ''}`} style={{ height: `${height}%` }} /><small>{['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}</small></div>)}</div></div>
              <div className="section-heading upcoming-heading"><div><h2>Upcoming</h2><p>Don’t miss a deadline</p></div><button className="text-button" onClick={() => setActiveNav('Assignments')}>See all <span>→</span></button></div>
              <div className="task-list">{[['Submit design critique', 'Product Design', 'Tomorrow', 1], ['React hooks quiz', 'Advanced React', 'Oct 31', 2], ['Python data wrangling', 'Data Science', 'Nov 02', 3]].map(([title, course, due, id]) => <button className={`task ${completedTasks.includes(id as number) ? 'task-done' : ''}`} key={id} onClick={() => { const completed = !completedTasks.includes(id as number); setCompletedTasks((items) => completed ? [...items, id as number] : items.filter((item) => item !== id)); showToast(completed ? 'Assignment marked complete' : 'Assignment reopened') }}><span className="task-check">{completedTasks.includes(id as number) ? '✓' : ''}</span><span><strong>{title}</strong><small>{course}</small></span><time>{due}</time></button>)}</div>
            </aside>
          </section>
          <section className="focus-panel"><div className="focus-copy"><p className="eyebrow">YOUR NEXT BEST STEP</p><h2>Today’s focus</h2><p>Complete one React lesson and keep your learning streak alive.</p><div className="focus-meta"><span>20 min session</span><span>+30 XP</span><span>Due today</span></div></div><div className={`focus-check ${focusDone ? 'is-done' : ''}`} onClick={() => { setFocusDone((value) => !value); showToast(focusDone ? 'Focus session reopened' : 'Focus session completed · +30 XP') }}>{focusDone ? '✓' : '→'}</div></section>
          <section className="timer-panel"><div><p className="eyebrow">STUDY TIMER</p><h2>Stay in the zone</h2><p>Use a focused 20-minute session, then take a short break.</p></div><div className="timer-controls"><strong>{String(Math.floor(focusSeconds / 60)).padStart(2, '0')}:{String(focusSeconds % 60).padStart(2, '0')}</strong><button onClick={() => setTimerRunning((value) => !value)}>{timerRunning ? 'Pause' : 'Start session'}</button><button className="timer-reset" onClick={() => { setTimerRunning(false); setFocusSeconds(20 * 60) }}>Reset</button></div></section>
          <div className="quick-actions"><button onClick={() => setTutorOpen(true)}><span>✦</span><div><strong>Ask your tutor</strong><small>Get unstuck in seconds</small></div><b>→</b></button><button onClick={() => { setActiveNav('Assignments'); showToast('Opening your assignment plan') }}><span>✓</span><div><strong>Plan your week</strong><small>Organize upcoming work</small></div><b>→</b></button><button onClick={() => setNotesOpen(true)}><span>▤</span><div><strong>{notes ? 'Edit your note' : 'Capture a note'}</strong><small>{notes ? 'Your note is saved locally' : 'Save a useful idea'}</small></div><b>→</b></button></div>
          <section className="insights-grid"><article className="insight-card"><div className="section-heading"><div><h2>Weekly goal</h2><p>Keep your momentum</p></div><span className="goal-percent">72%</span></div><div className="goal-meter"><div style={{ width: '72%' }} /></div><div className="goal-footer"><span>3.6 of 5 hours</span><button onClick={() => showToast('Weekly goal added to your focus')}>Adjust goal →</button></div></article><article className="insight-card"><div className="section-heading"><div><h2>Top learners</h2><p>This week’s community</p></div><button className="dots" aria-label="Leaderboard options" onClick={() => showToast('Leaderboard is up to date')}>•••</button></div><div className="leader-row"><span className="rank gold">1</span><span className="leader-avatar">MC</span><strong>Maya Chen</strong><b>1,240 XP</b></div><div className="leader-row"><span className="rank silver">2</span><span className="leader-avatar purple-avatar">AS</span><strong>Alex Smith</strong><b>1,080 XP</b></div><div className="leader-row current-rank"><span className="rank">8</span><span className="leader-avatar">{initials(profile.name)}</span><strong>You</strong><b>640 XP</b></div></article><article className="insight-card recommendation"><p className="eyebrow">RECOMMENDED FOR YOU</p><h2>Machine Learning Essentials</h2><p>Based on your interest in Python and data.</p><button onClick={() => setSelectedCourse(liveCourses[4])}>Explore course <span>→</span></button></article></section>
          <section className="roadmap-section"><div className="section-heading"><div><p className="eyebrow">YOUR LEARNING PATH</p><h2>Full-stack developer roadmap</h2><p>Four milestones to reach your goal</p></div><button className="text-button" onClick={() => showToast('Roadmap progress is up to date')}>View roadmap <span>→</span></button></div><div className="roadmap"><div className="road-line" /><div className="road-step complete"><span className="road-node">✓</span><div><strong>Foundations</strong><small>HTML, CSS and JavaScript</small></div><b>Complete</b></div><div className="road-step active-step"><span className="road-node">2</span><div><strong>Frontend craft</strong><small>React patterns and TypeScript</small></div><b>In progress</b></div><div className="road-step"><span className="road-node">3</span><div><strong>Backend systems</strong><small>APIs, databases and auth</small></div><b>Locked</b></div><div className="road-step"><span className="road-node">4</span><div><strong>Launch a project</strong><small>Ship your portfolio project</small></div><b>Locked</b></div></div></section>

          <div className="tip-banner"><span className="tip-icon">✦</span><div><strong>Make learning a habit</strong><p>People who study for 20 minutes daily are 3× more likely to complete their courses.</p></div><button onClick={() => setTutorOpen(true)}>Build a study plan <span>→</span></button><span className="data-sync">Updated {lastLiveUpdate}</span></div>
           </>}
        </div>
      </main>

      {tutorOpen && <div className="modal-backdrop" onClick={() => setTutorOpen(false)}><section className="tutor-modal" onClick={(event) => event.stopPropagation()}><div className="modal-head"><div><span className="ai-orb">✦</span><div><h2>AI Tutor</h2><p>Ask anything about your learning</p></div></div><button onClick={() => setTutorOpen(false)}>×</button></div><div className="chat-body"><div className="ai-message"><span className="mini-orb">✦</span><p>Hi Jordan! I’m ready to help you understand a concept, review a lesson, or create a study plan.</p></div>{sentMessages.map((item, index) => <div className="chat-pair" key={`${item}-${index}`}><div className="user-message">{item}</div><div className="ai-reply"><span className="mini-orb">✦</span>{tutorReplies[item]}</div></div>)}</div><div className="suggestions"><button onClick={() => setMessage('Summarize my React course')}>Summarize my React course</button><button onClick={() => setMessage('Create a study plan')}>Create a study plan</button></div><div className="chat-input"><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Ask your tutor..." /><button onClick={sendMessage}>↑</button></div></section></div>}
      {selectedCourse && <CourseDetail course={selectedCourse} onClose={() => setSelectedCourse(null)} onEnroll={() => enrollInCourse(selectedCourse)} />}
      {notesOpen && <NotesPanel notes={notes} onSave={saveNotes} onClose={() => setNotesOpen(false)} />}
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  )
}

export default App
