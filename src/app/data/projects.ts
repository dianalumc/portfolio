export interface Project {
  slug: string;
  title: string;
  type: string;
  description: string;
  year: string;
  tags: string[];
  images: string[];
}

export const projects: Project[] = [
  {
    slug: 'agrosur',
    title: 'AgroSur',
    type: 'UX Design / Prototipado / Branding',
    description:
      'Diseño de producto end-to-end para una app de bienestar emocional: research, wireframes, prototipo interactivo y guía de marca.',
    year: '2025',
    tags: ['UX Design', 'Prototipado', 'Branding'],
    images: ['AgroSur_1.png'],
  },
  {
    slug: 'muxsalu',
    title: 'MuxsaLu',
    type: 'Identidad / Dirección de arte / Editorial',
    description:
      'Sistema de identidad para una marca que trabaja con lo esencial y convierte cada detalle en lenguaje.',
    year: '2025',
    tags: ['Identidad', 'Dirección de arte', 'Editorial'],
    images: ['MuxsaLu_1.png', 'MuxsaLu_2.png'],
  },
  {
    slug: 'plastimet',
    title: 'Plastimet',
    type: 'Web design / UI / Estrategia',
    description:
      'Experiencia digital y narrativa visual para entrar, explorar y quedarse un poco más.',
    year: '2024',
    tags: ['Web design', 'UI', 'Estrategia'],
    images: ['Plastimet_1.png'],
  },
];
