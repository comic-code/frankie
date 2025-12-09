"use client";
import React, { useState } from 'react';
import { FMContainer, FMIcon, FMMainButton, FMMainIcon, FMMenuButton, FMMenuWrapper, FMOverlay } from './styles';

export default function FloatingMenu({  }) {
  const [open, setOpen] = useState(false);
  const options = [
    { label: '', icon: '💰', onClick: () => alert('Buscar') },
    { label: '', icon: '🎮', onClick: () => alert('Perfil') },
    { label: '', icon: '📚', onClick: () => alert('Perfil') },
    { label: '', icon: '🛒', onClick: () => alert('Perfil') },
    { label: '', icon: '🎸', onClick: () => alert('Perfil') },
  ];

  return (
    <FMContainer>
      {open && (
        <FMOverlay onClick={() => setOpen(false)} />
      )}
      <FMMenuWrapper>
        {options.map((opt, i) => {
          const arc = Math.PI * 2 / 2.75;
          const startAngle = -Math.PI / 2;
          const angle = startAngle - (arc / (options.length - 1 || 1)) * i;
          const distance = open ? 90 : 0;
          const x = Math.round(Math.cos(angle) * distance);
          const y = Math.round(Math.sin(angle) * distance);
          return (
            <FMMenuButton
              key={opt.label}
              className={`absolute bg-white text-neutral-900 shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 ease-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              onClick={opt.onClick}
              aria-label={opt.label}
            >
              <FMIcon className="text-2xl">{opt.icon}</FMIcon>
            </FMMenuButton>
          );
        })}
        <FMMainButton
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          <FMMainIcon className="text-3xl">{open ? '✖️' : '☰'}</FMMainIcon>
        </FMMainButton>
      </FMMenuWrapper>
    </FMContainer>
  );
} 