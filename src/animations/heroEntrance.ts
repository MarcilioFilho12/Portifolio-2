import { gsap, registerGsap } from '@/composables/useGsap'

export function playHeroEntrance(root: HTMLElement, onComplete?: () => void) {
  registerGsap()

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) {
    root.querySelectorAll<HTMLElement>('[data-reveal="mask"]').forEach((el) => {
      el.style.clipPath = 'none'
    })
    gsap.set(root.querySelectorAll('[data-reveal]'), { clearProps: 'all' })
    onComplete?.()
    return
  }

  const canvas = root.querySelector('[data-hero-canvas]')
  if (canvas) gsap.set(canvas, { opacity: 0 })

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete,
  })

  const masks = root.querySelectorAll<HTMLElement>('[data-reveal="mask"]')
  masks.forEach((el) => {
    const delay = parseFloat(el.getAttribute('data-reveal-delay') || '0')
    tl.from(
      el,
      {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 0.75,
      },
      delay,
    )
  })

  const maskEnd = masks.length
    ? Math.max(
        ...Array.from(masks).map((el) =>
          parseFloat(el.getAttribute('data-reveal-delay') || '0'),
        ),
      ) + 0.5
    : 0

  tl.from(
    '[data-reveal="split"] .split-word',
    {
      yPercent: 110,
      opacity: 0,
      duration: 0.65,
      stagger: 0.04,
    },
    maskEnd > 0 ? maskEnd - 0.35 : 0,
  )
    .from(
      '[data-reveal="corner"]',
      { opacity: 0, scale: 0.6, duration: 0.4, stagger: 0.05 },
      '-=0.5',
    )
    .from('[data-reveal="subhead"]', { y: 16, opacity: 0, duration: 0.55 }, '-=0.35')
    .from('[data-reveal="cta"]', { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
    .from('[data-reveal="discover"]', { opacity: 0, y: 8, duration: 0.45 }, '-=0.2')
    .from('[data-reveal="meta"]', { opacity: 0, y: -8, duration: 0.5 }, '-=0.6')
    .from('[data-reveal="footer"]', { opacity: 0, y: 12, duration: 0.55 }, '-=0.35')

  if (canvas) {
    tl.to(canvas, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.8')
  }

  return tl
}
