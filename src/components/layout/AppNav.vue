<script setup lang="ts">
const links = [
  { href: '#projetos', label: 'Projetos' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
]
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-bg/80 backdrop-blur-xl"
  >
    <nav
      class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4"
      aria-label="Principal"
    >
      <a
        href="#"
        class="text-sm font-semibold tracking-wide text-text transition-opacity hover:opacity-80"
      >
        M<span class="text-glow">.</span>Alano
      </a>
      <ul class="flex items-center gap-6">
        <li v-for="link in links" :key="link.href">
          <a
            :href="link.href"
            class="link-underline text-sm text-text-muted transition-colors hover:text-text"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped>
.link-underline {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-size: 0% 1px;
  background-position: left bottom;
  transition: background-size 0.35s var(--ease-luxury);
}

.link-underline:hover,
.link-underline:focus-visible {
  background-size: 100% 1px;
}
</style>
