import React, { useEffect, useRef, useState } from 'react';
import { Slot, usePathname, router } from 'expo-router';
import {
  House,
  MessageCircle,
  BookOpen,
  Orbit,
  Leaf,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Menu,
  X,
  HeartHandshake,
  ChevronRight,
  Sun,
} from 'lucide-react';
import { useAnima } from './Store';
import { BrandMark } from './components/UI';
const navigation = [
  { path: '/', label: 'Hoje', icon: House },
  { path: '/session', label: 'Conversa guiada', icon: MessageCircle },
  { path: '/journal', label: 'Meu diário', icon: BookOpen },
  { path: '/cycles', label: 'Meus ciclos', icon: Orbit },
  { path: '/rituals', label: 'Pequenos rituais', icon: Leaf },
  { path: '/soul-map', label: 'Mapa da jornada', icon: Sparkles },
] as const;
export default function AppShell() {
  const drawer = useRef<HTMLElement>(null);
  const [smallScreen, setSmallScreen] = useState(false);
  const pathname = usePathname();
  const { state, ready, notice, storageError } = useAnima();
  const [mobileMenu, setMobileMenu] = useState(false);
  const pageTitle =
    navigation.find((n) => n.path === pathname)?.label ??
    {
      '/profile': 'Meu espaço',
      '/future-self': 'Meu eu futuro',
      '/crisis': 'Encontrar apoio',
    }[pathname] ??
    'Seu espaço';
  useEffect(() => {
    document.title = `${pageTitle} · ANIMA`;
    setMobileMenu(false);
    window.scrollTo({ top: 0 });
  }, [pathname, pageTitle]);
  useEffect(() => {
    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.href = '/assets/favicon.svg';
    document.documentElement.lang = 'pt-BR';
  }, []);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const sync = () => {
      setSmallScreen(media.matches);
      if (!media.matches) setMobileMenu(false);
    };
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!mobileMenu) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawer.current?.querySelector<HTMLElement>('button')?.focus();
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenu(false);
      if (event.key === 'Tab') {
        const items = Array.from(
          drawer.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not(:disabled)',
          ) ?? [],
        ).filter((item) => item.getClientRects().length > 0);
        const first = items[0],
          last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener('keydown', listener);
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, [mobileMenu]);
  const go = (path: string) => {
    setMobileMenu(false);
    router.push(path as '/');
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Pular para o conteúdo
      </a>
      {mobileMenu && (
        <button
          tabIndex={-1}
          className="sidebar-overlay"
          aria-label="Fechar menu"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside
        ref={drawer}
        inert={smallScreen && !mobileMenu}
        className={`sidebar ${mobileMenu ? 'open' : ''}`}
        aria-label="Navegação principal"
      >
        <button
          className="brand"
          onClick={() => go('/')}
          aria-label="ANIMA, início"
        >
          <BrandMark />
          <span>
            anima<span className="brand-caption">O SEU LUGAR DE VOLTA</span>
          </span>
        </button>
        <button
          className="mobile-close icon-button"
          aria-label="Fechar menu"
          onClick={() => setMobileMenu(false)}
        >
          <X size={20} />
        </button>
        <span className="nav-caption">SUA TRAVESSIA</span>
        <nav>
          {navigation.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              aria-current={pathname === item.path ? 'page' : undefined}
              onClick={(event) => {
                if (
                  !event.metaKey &&
                  !event.ctrlKey &&
                  !event.shiftKey &&
                  !event.altKey &&
                  event.button === 0
                ) {
                  event.preventDefault();
                  go(item.path);
                }
              }}
            >
              <item.icon size={19} strokeWidth={1.5} />
              <span>{item.label}</span>
              {pathname === item.path && <span className="active-dot" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <BrandMark size={30} />
            <p>
              Florescer também
              <br />é respeitar seu tempo.
            </p>
            <span>UM PASSO DE CADA VEZ.</span>
          </div>
          <button className="support-link" onClick={() => go('/crisis')}>
            <HeartHandshake size={17} /> Preciso de apoio{' '}
            <ArrowUpRight size={14} />
          </button>
          <button
            className={`profile-link ${pathname === '/profile' ? 'selected' : ''}`}
            onClick={() => go('/profile')}
          >
            <span className="avatar">
              {state.profile.name ? (
                state.profile.name.charAt(0).toLocaleUpperCase('pt-BR')
              ) : (
                <Leaf size={19} />
              )}
            </span>
            <span>
              <strong>{state.profile.name || 'Seu espaço'}</strong>
              <small>Preferências e dados</small>
            </span>
            <ChevronRight size={15} />
          </button>
        </div>
      </aside>
      <div className="main-wrap" inert={mobileMenu}>
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            aria-label="Abrir menu"
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <span>Seu refúgio</span>
            <ChevronRight size={12} />
            <strong>{pageTitle}</strong>
          </div>
          <div className="topbar-right">
            <span className="local-badge">
              <span /> Espaço local
            </span>
            <button
              className="icon-button help-button"
              onClick={() => go('/crisis')}
              aria-label="Encontrar apoio"
            >
              <HeartHandshake size={19} />
            </button>
            <button
              className="top-avatar"
              onClick={() => go('/profile')}
              aria-label="Abrir meu espaço"
            >
              {state.profile.name ? (
                state.profile.name.charAt(0).toLocaleUpperCase('pt-BR')
              ) : (
                <Sun size={17} />
              )}
            </button>
          </div>
        </header>
        <main id="main" className="main-content" tabIndex={-1}>
          {storageError && (
            <div className="storage-banner" role="alert">
              {storageError}{' '}
              <button onClick={() => go('/profile')}>Abrir Meu espaço</button>
            </div>
          )}
          {ready ? (
            <Slot />
          ) : (
            <div className="loading-state" role="status">
              <BrandMark size={48} />
              <p>Preparando seu espaço…</p>
            </div>
          )}
        </main>
        <footer className="page-footer">
          <span>
            <BrandMark size={18} /> Feito para o seu tempo.
          </span>
          <button onClick={() => go('/profile')}>
            <ShieldCheck size={13} /> Seus dados ficam neste navegador
          </button>
        </footer>
      </div>
      {notice && (
        <div className="toast" role="status">
          <span className="toast-dot" />
          {notice}
        </div>
      )}
    </div>
  );
}
