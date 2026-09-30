export interface BlogPost {
  id: number
  title: string
  excerpt: string
  date: string
  datetime: string
  tags: string[]
  readTime: string
  lang: string
  href: string
}

export interface BlogPostPreview {
  id: number
  title: string
  date: string
  datetime: string
}

export interface EducationItem {
  school: string
  degree: string
  period: string
}

export interface SkillCategory {
  category: string
  items: string[]
}
