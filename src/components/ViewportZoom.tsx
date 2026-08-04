'use client';

import { useEffect } from 'react';

const DESIGN_W = 1280;
const MIN_W = 1024;

export default function ViewportZoom() {
  useEffect(() => {
    const s = document.createElement('style');
    s.id = 'vpz';
    function zoom() {
      const w = window.innerWidth;
      s.textContent = `html{zoom:${w < DESIGN_W && w >= MIN_W ? w / DESIGN_W : 1}}`;
    }
    s.textContent = 'html{zoom:1}';
    document.head.appendChild(s);
    zoom();
    window.addEventListener('resize', zoom);
    return () => {
      s.remove();
      window.removeEventListener('resize', zoom);
    };
  }, []);

  return null;
}
