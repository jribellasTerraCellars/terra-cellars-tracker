import { type ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { Avatar } from './Avatar'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { to: '/', label: 'Tauler' },
  { to: '/actius', label: 'Actius' },
  { to: '/operacions', label: 'Backups i proveïdors' },
  { to: '/documentacio', label: 'Documentació' },
  { to: '/estadistiques', label: 'Estadístiques' },
  { to: '/configuracio', label: 'Configuració' },
]

export function Layout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)] md:flex-row">
      <aside className="flex shrink-0 flex-col justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:w-64 md:border-b-0 md:border-r md:p-6">
        <div>
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-full bg-white p-1.5 shadow-sm">
              <img src={logo} alt="Terra Cellars" className="h-7 w-7 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Terra Cellars</p>
              <p className="text-xs text-[var(--color-text-muted)]">Gestió IT</p>
            </div>
          </div>

          <nav className="flex flex-wrap gap-1 md:flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--color-primary)] text-[var(--color-primary-contrast)]'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-4 md:mt-0">
          <div className="flex min-w-0 items-center gap-2">
            <Avatar name={profile?.full_name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{profile?.full_name ?? '...'}</p>
              <p className="truncate text-xs text-[var(--color-text-muted)]">{profile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="ml-2 shrink-0 rounded-md border border-[var(--color-border)] px-2 py-1 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
          >
            Sortir
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-end border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 md:px-8">
          <button
            onClick={toggleTheme}
            className="rounded-md border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-surface-alt)]"
          >
            {theme === 'light' ? 'Mode fosc' : 'Mode clar'}
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
