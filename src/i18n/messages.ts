export type Locale = 'pt' | 'en'

export const messages = {
  pt: {
    nav: {
      work: 'Projetos',
      expertise: 'Especialidades',
      experience: 'Sobre',
      getInTouch: 'Fale comigo',
      creativeDeveloper: '/ Desenvolvedor criativo',
      openMenu: 'Abrir menu',
      langLabel: 'Idioma',
      mainNav: 'Navegação principal',
    },
    hero: {
      headline: {
        brandWeb: 'Web',
        brandDesign: 'Design',
        ledeWords: ['unindo', 'o', 'melhor', 'dos', 'mundos,'] as const,
        ledeEmphasis: 'melhor',
        tags: [
          { word: 'código,', glow: true, italic: false },
          { word: '3D,', glow: true, italic: false },
          { word: 'arte', glow: false, italic: true },
          { word: 'criativa', glow: false, italic: true },
          { word: 'e', glow: false, italic: false },
          { word: 'cinema.', glow: false, italic: false },
        ] as const,
      },
      metaFolio: 'Folio / 2026 — Vol.01',
      metaCinematic: '— Um portfólio cinematográfico',
      metaLocation: 'Lisboa · Latitude 38.7°N',
      subline:
        'Marcílio Alano Filho — desenvolvedor criativo criando experiências web imersivas para marcas ambiciosas, estúdios de IA e produtos de tecnologia.',
      ctaWork: 'Ver projetos',
      ctaContact: 'Iniciar uma colaboração',
      scrollCinematic: 'Rolar para a experiência cinematográfica',
      scrollEnter: 'Role para entrar',
      available: 'Disponível',
      availableDate: 'Q1 — 2026',
      nowPlaying: 'Em reprodução',
      nowPlayingTrack: 'Intro / Reel ’26',
      srOnly:
        'Web Design — unindo o melhor dos mundos: código, 3D, arte criativa e cinema. Use a roda do mouse nesta seção para girar o modelo 3D do cérebro.',
    },
    cinematic: {
      sectionLabel: 'Experiência cinematográfica',
      label: 'Atmosfera',
      title: 'Narrativa em movimento, revelada pelo scroll',
      body: 'Uma camada visual que responde à sua navegação — pausada em mobile ou quando você prefere menos movimento.',
      srOnly: 'Sequência visual em movimento representando atmosfera digital futurista do portfólio.',
    },
    projects: {
      title: 'Projetos selecionados',
      subtitle: 'Checkout digital e landing de marca — design e front-end em produção.',
      soumed: {
        category: 'Front-end',
        description: 'Checkout e fluxos digitais para operação de convênio médico.',
        imageAlt: 'Soumed checkout — formulário de dados pessoais e pagamento',
      },
      chamateria: {
        category: 'Design web',
        description:
          'Landing tropical Mati Chamateria — erva-mate e rum artesanal, cultura de rua em Praia do Rosa.',
        imageAlt: 'Mati Chamateria — hero Praia do Rosa, erva-mate e rum artesanal',
      },
    },
    skills: {
      label: 'Especialidades',
      title: 'Arte entre código, motion e 3D',
      body: 'Arquitetura front-end, interfaces cinematográficas e WebGL — com performance e acessibilidade.',
    },
    about: {
      label: 'Sobre',
      title: 'Marcílio Alano Filho',
      p1: 'Desenvolvedor front-end focado em interfaces performáticas, design systems e integrações. Experiência em ecossistemas de saúde, MVPs e produtos digitais com Vue e React.',
      p2: 'Este portfólio segue desenvolvimento evolutivo em camadas — conteúdo primeiro, motion e WebGL depois.',
      videoLabel: 'Vídeo ilustrativo — figura digital em movimento',
      staticPreview: 'Prévia estática da seção sobre',
      reducedMotion: 'Movimento reduzido',
    },
    intro: {
      ariaLabel: 'Introdução do portfólio',
      skip: 'Pular intro',
      name: 'Marcílio Alano',
    },
    common: {
      techStack: 'Tecnologias',
    },
    contact: {
      label: 'Contato',
      title: 'Vamos construir algo memorável',
      body: 'Disponível para projetos front-end, consultoria de UI e colaborações criativas.',
      whatsapp: 'WhatsApp',
      cvEn: 'CV (English)',
      cvPt: 'CV (Português)',
    },
    footer: {
      tagline: 'Vue 3 · TypeScript · Motion design',
      socialNav: 'Redes sociais',
    },
    meta: {
      title: 'Marcílio Alano Filho | Desenvolvedor Frontend',
      description:
        'Portfólio cinematográfico de Marcílio Alano — Vue, TypeScript, GSAP e interfaces premium.',
      ogTitle: 'Marcílio Alano Filho | Desenvolvedor Frontend',
      ogDescription: 'Portfólio de desenvolvedor criativo — performance, motion e WebGL.',
    },
  },
  en: {
    nav: {
      work: 'Work',
      expertise: 'Expertise',
      experience: 'Experience',
      getInTouch: 'Get in touch',
      creativeDeveloper: '/ Creative Developer',
      openMenu: 'Open menu',
      langLabel: 'Language',
      mainNav: 'Main navigation',
    },
    hero: {
      headline: {
        brandWeb: 'Web',
        brandDesign: 'Design',
        ledeWords: ['uniting', 'the', 'best', 'of', 'worlds,'] as const,
        ledeEmphasis: 'best',
        tags: [
          { word: 'code,', glow: true, italic: false },
          { word: '3D,', glow: true, italic: false },
          { word: 'creative', glow: false, italic: true },
          { word: 'art', glow: false, italic: true },
          { word: '&', glow: false, italic: false },
          { word: 'cinema.', glow: false, italic: false },
        ] as const,
      },
      metaFolio: 'Folio / 2026 — Vol.01',
      metaCinematic: '— A cinematic folio',
      metaLocation: 'Lisbon · Latitude 38.7°N',
      subline:
        'Marcílio Alano Filho — creative developer crafting immersive web experiences for ambitious brands, AI studios, and luxury technology products.',
      ctaWork: 'View selected work',
      ctaContact: 'Start a collaboration',
      scrollCinematic: 'Scroll to cinematic experience',
      scrollEnter: 'Scroll to enter',
      available: 'Available',
      availableDate: 'Q1 — 2026',
      nowPlaying: 'Now playing',
      nowPlayingTrack: 'Intro / Reel ’26',
      srOnly:
        'WebDesgin — uniting the best of worlds: code, 3D, creative art, and cinema. Use the mouse wheel on this section to rotate the 3D brain model.',
    },
    cinematic: {
      sectionLabel: 'Cinematic experience',
      label: 'Atmosphere',
      title: 'Narrative in motion, revealed by scroll',
      body: 'A visual layer that responds to your navigation — paused on mobile or when you prefer reduced motion.',
      srOnly: 'Moving visual sequence representing the portfolio’s futuristic digital atmosphere.',
    },
    projects: {
      title: 'Selected projects',
      subtitle: 'Digital checkout and brand landing — design and front-end in production.',
      soumed: {
        category: 'Frontend',
        description: 'Checkout and digital flows for medical plan operations.',
        imageAlt: 'Soumed checkout — personal data and payment form',
      },
      chamateria: {
        category: 'Web Design',
        description:
          'Tropical Mati Chamateria landing — yerba mate and artisan rum, street culture in Praia do Rosa.',
        imageAlt: 'Mati Chamateria — Praia do Rosa hero, yerba mate and artisan rum',
      },
    },
    skills: {
      label: 'Expertise',
      title: 'Craft across code, motion & 3D',
      body: 'Frontend architecture, cinematic interfaces, and WebGL — tuned for performance and accessibility.',
    },
    about: {
      label: 'About',
      title: 'Marcílio Alano Filho',
      p1: 'Frontend developer focused on performant interfaces, design systems, and integrations. Experience in healthcare ecosystems, MVPs, and digital products with Vue and React.',
      p2: 'This portfolio follows layered evolutionary development — content first, motion and WebGL after.',
      videoLabel: 'Illustrative video — digital figure in motion',
      staticPreview: 'Static preview of the about section',
      reducedMotion: 'Reduced motion',
    },
    intro: {
      ariaLabel: 'Portfolio introduction',
      skip: 'Skip intro',
      name: 'Marcílio Alano',
    },
    common: {
      techStack: 'Technologies',
    },
    contact: {
      label: 'Contact',
      title: "Let's build something memorable",
      body: 'Available for frontend projects, UI consulting, and creative collaborations.',
      whatsapp: 'WhatsApp',
      cvEn: 'CV (English)',
      cvPt: 'CV (Portuguese)',
    },
    footer: {
      tagline: 'Vue 3 · TypeScript · Motion design',
      socialNav: 'Social links',
    },
    meta: {
      title: 'Marcílio Alano Filho | Frontend Developer',
      description:
        'Cinematic portfolio by Marcílio Alano — Vue, TypeScript, GSAP, and premium interfaces.',
      ogTitle: 'Marcílio Alano Filho | Frontend Developer',
      ogDescription: 'Creative developer portfolio — performance, motion, and WebGL.',
    },
  },
} as const

export type MessageKey = keyof (typeof messages)['en']
