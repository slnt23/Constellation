import type { SkillCategory } from '@/modules/blog/types'

export const SKILLS: SkillCategory[] = [
  {
    category: 'Web',
    items: ['Vue.js', 'Nuxt.js', 'Node.js', 'React.js', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
  },
  {
    category: 'Programming',
    items: ['Python', 'PyTorch', 'C', 'C++', 'C#', 'R', 'MySQL', 'PostgreSQL'],
  },
  {
    category: 'Tools',
    items: ['VSCode', 'Vim', 'Git', 'Linux', 'Docker', 'Nginx'],
  },
  {
    category: 'Design',
    items: ['Figma', 'Photoshop', 'Illustrator'],
  },
  {
    category: 'Other',
    items: ['Markdown', 'LaTeX'],
  },
]
