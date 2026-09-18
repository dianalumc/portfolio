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
    type: 'Identidad / Dirección de arte / Branding / Editorial',
    description:
      'Sistema de identidad para una marca que trabaja con lo esencial y convierte cada detalle en lenguaje.',
    year: '2025',
    tags: ['Identidad', 'Dirección de arte', 'Editorial'],
    images: ['MuxsaLu_1.png', 'MuxsaLu_2.png'],
  },
  {
    slug: 'plastimet',
    title: 'Plastimet',
    type: 'Web design / UX-UI / Prototipado / Cotizador',
    description:
      'Plataforma digital informativa con cotizador para facilitar la toma de decisiones. El diseño respeta fielmente el branding de la marca, con un gran enfoque en la experiencia de usuario pensada para invitar al usuario a entrar, explorar, quedarse un poco más. Todo bajo un enfoque responsive.',
    year: '2024',
    tags: ['Web design', 'UX-UI', 'Prototipado', 'Cotizador'],
    images: ['Plastimet_1.png'],
  },
];
