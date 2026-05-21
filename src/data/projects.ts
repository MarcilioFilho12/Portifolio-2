export interface Project {
  id: string
  title: string
  category: string
  description: string
  stack: string[]
  href?: string
  image?: string
  imageAlt?: string
  /** Fundo da área de preview */
  imageBg?: string
  /** contain = logo; cover = screenshot */
  imageFit?: 'contain' | 'cover'
}

export const projects: Project[] = [
  {
    id: 'soumed',
    title: 'Soumed',
    category: 'Frontend',
    description: 'Checkout e fluxos digitais para operação de convênio médico.',
    stack: ['React', 'TypeScript'],
    href: 'https://checkout.soumed.com.br/',
    image: '/media/projects/soumed.png',
    imageAlt: 'Soumed checkout — formulário de dados pessoais e pagamento',
    imageBg: '#ffffff',
    imageFit: 'cover',
  },
  {
    id: 'chamateria',
    title: 'Chamateria Praia do Rosa',
    category: 'Web Design',
    description:
      'Landing tropical Mati Chamateria — erva-mate e rum artesanal, cultura de rua em Praia do Rosa.',
    stack: ['Figma', 'UI Design', 'Landing Page'],
    href: 'https://www.figma.com/make/RL5zc1pnIxLxLXXi5BDx05/Ch%C3%A1-Mati-Website-Design?code-node-id=0-9&p=f&t=vTK2jaudy5Iu8GmB-0&fullscreen=1',
    image: '/media/projects/chamateria-praia-do-rosa.png',
    imageAlt: 'Mati Chamateria — hero Praia do Rosa, erva-mate e rum artesanal',
    imageBg: '#0a6b6f',
    imageFit: 'cover',
  },
]

export const skills = [
  'Vue.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'GSAP',
  'Three.js',
  'REST APIs',
  'Performance',
]
