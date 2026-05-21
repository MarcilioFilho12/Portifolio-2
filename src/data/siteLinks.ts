/** Links oficiais — única fonte para botões e rodapé */

export const SOCIAL = {
  github: 'https://github.com/MarcilioFilho12',
  linkedin: 'https://www.linkedin.com/in/marcilio-filho1110/',
  behance: 'https://www.behance.net/marciliofilhodev',
  instagram: 'https://www.instagram.com/marciliofilhooficial/',
  whatsapp: 'https://wa.me/5548996385461',
  x: 'https://x.com/MarcilioDevops',
  tiktok: 'https://www.tiktok.com/@marciliofilhodev',
} as const

export const CV = {
  en: {
    href: '/media/cv/cv-marcilio-alano-en.pdf',
    download: 'Marcilio-Alano-Filho-CV-EN.pdf',
    label: 'CV (English)',
  },
  pt: {
    href: '/media/cv/cv-marcilio-alano-pt.pdf',
    download: 'Marcilio-Alano-Filho-CV-PT.pdf',
    label: 'CV (Português)',
  },
} as const

export type SocialKey = keyof typeof SOCIAL

export interface ContactLink {
  id: string
  label: string
  href: string
  external?: boolean
  download?: string
  variant?: 'primary' | 'ghost'
}

export const CONTACT_PRIMARY: ContactLink[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: SOCIAL.whatsapp,
    external: true,
    variant: 'primary',
  },
]

export const CONTACT_SOCIAL: ContactLink[] = [
  { id: 'github', label: 'GitHub', href: SOCIAL.github, external: true },
  { id: 'linkedin', label: 'LinkedIn', href: SOCIAL.linkedin, external: true },
  { id: 'behance', label: 'Behance', href: SOCIAL.behance, external: true },
  { id: 'instagram', label: 'Instagram', href: SOCIAL.instagram, external: true },
  { id: 'x', label: 'X', href: SOCIAL.x, external: true },
  { id: 'tiktok', label: 'TikTok', href: SOCIAL.tiktok, external: true },
]

export const CONTACT_CV: ContactLink[] = [
  {
    id: 'cv-en',
    label: CV.en.label,
    href: CV.en.href,
    download: CV.en.download,
    variant: 'ghost',
  },
  {
    id: 'cv-pt',
    label: CV.pt.label,
    href: CV.pt.href,
    download: CV.pt.download,
    variant: 'ghost',
  },
]
