import React, { useEffect, useId, useRef } from 'react';
import {
  ArrowUpRight,
  Check,
  X,
  Clock3,
  Wind,
  Leaf,
  PenLine,
  Sun,
  Heart,
  Shield,
} from 'lucide-react';
import { Mood, moodLabels } from '../domain/model';
import { Ritual } from '../domain/content';

export function BrandMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.1">
        <ellipse cx="24" cy="22" rx="8" ry="17" transform="rotate(-30 24 22)" />
        <ellipse cx="24" cy="22" rx="8" ry="17" transform="rotate(30 24 22)" />
        <path d="M24 7v35" />
        <circle cx="24" cy="22" r="3" />
      </g>
    </svg>
  );
}
export function MoodFace({ value, size = 32 }: { value: Mood; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="18"
        cy="18"
        r="14.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M12 14h.1m11.8 0h.1"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {value === 1 ? (
        <path
          d="M11 25q7-8 14 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : value === 2 ? (
        <path
          d="M12 24q6-5 12 0"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : value === 3 ? (
        <path
          d="M12 23h12"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d={value === 4 ? 'M11 21q7 7 14 0' : 'M10 20q8 11 16 0'}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
export function MoodPicker({
  value,
  onChange,
  label = 'Como você está se sentindo?',
}: {
  value?: Mood;
  onChange: (mood: Mood) => void;
  label?: string;
}) {
  return (
    <div className="mood-picker" role="group" aria-label={label}>
      {([1, 2, 3, 4, 5] as Mood[]).map((mood) => (
        <button
          key={mood}
          type="button"
          aria-pressed={value === mood}
          onClick={() => onChange(mood)}
          className={`mood-option mood-${mood} ${value === mood ? 'selected' : ''}`}
        >
          <MoodFace value={mood} />
          <span>{moodLabels[mood]}</span>
        </button>
      ))}
    </div>
  );
}
export function Dialog({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      el?.close();
      document.body.style.overflow = old;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`dialog ${wide ? 'wide' : ''}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close.current();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const box = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < box.left ||
            e.clientX > box.right ||
            e.clientY < box.top ||
            e.clientY > box.bottom
          )
            close.current();
        }
      }}
    >
      <div className="dialog-header">
        <span className="eyebrow">UM MOMENTO PARA VOCÊ</span>
        <button
          type="button"
          className="icon-button"
          aria-label="Fechar janela"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </div>
      <h2 id={titleId}>{title}</h2>
      {children}
    </dialog>
  );
}
export function Confirm({
  title,
  description,
  label = 'Confirmar',
  onConfirm,
  onClose,
  danger = false,
}: {
  title: string;
  description: string;
  label?: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  return (
    <Dialog title={title} onClose={onClose}>
      <p className="muted">{description}</p>
      <div className="dialog-actions">
        <button className="button secondary" onClick={onClose}>
          Cancelar
        </button>
        <button
          className={`button ${danger ? 'danger' : 'primary'}`}
          onClick={onConfirm}
        >
          {label}
        </button>
      </div>
    </Dialog>
  );
}
export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-description">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="muted small">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </div>
  );
}
export function RitualIcon({
  icon,
  size = 23,
}: {
  icon: Ritual['icon'];
  size?: number;
}) {
  const Component = {
    wind: Wind,
    leaf: Leaf,
    pen: PenLine,
    sun: Sun,
    heart: Heart,
    shield: Shield,
  }[icon];
  return <Component size={size} strokeWidth={1.4} />;
}
export function RitualCard({
  ritual,
  onOpen,
  compact = false,
}: {
  ritual: Ritual;
  onOpen: () => void;
  compact?: boolean;
}) {
  return (
    <button
      className={`ritual-card ${ritual.color} ${compact ? 'compact' : ''}`}
      onClick={onOpen}
    >
      <div className="ritual-card-top">
        <span className="ritual-icon">
          <RitualIcon icon={ritual.icon} />
        </span>
        <ArrowUpRight size={18} />
      </div>
      <div>
        <span className="eyebrow">{ritual.category}</span>
        <h3>{ritual.title}</h3>
        <p>{ritual.subtitle}</p>
      </div>
      <span className="duration">
        <Clock3 size={13} />
        {ritual.minutes} min <span>·</span> No seu ritmo
      </span>
    </button>
  );
}
export function SavedLabel() {
  return (
    <span className="saved-label">
      <Check size={13} /> Salvo neste navegador
    </span>
  );
}
