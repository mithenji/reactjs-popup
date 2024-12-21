import React, { ReactNode, memo } from 'react';

interface ContentProps {
  children?: ReactNode;
  close?: () => void;
  title?: string;
}

export const Content = memo(({
  children = ' Lorem, ipsum dolor sit amet consectetur adipisicing elit. Earum ducimus sed dolores, magni saepe libero nemo atque? Sed quibusdam nemo voluptatibus a deleniti aut labore voluptatem illum? Assumenda, modi. Omnis.',
  close = () => {},
  title = 'Modal Title',
}: ContentProps) => (
  <div className="popup-content">
    <button
      onClick={(e) => {
        e.preventDefault();
        close();
      }}
      title="Close"
      className="modal-close"
      aria-label="Close modal"
    >
      Close
    </button>
    <div className="modal-title">
      <h2>{title}</h2>
    </div>
    <div className="modal-content">{children}</div>
  </div>
));

Content.displayName = 'Content';
