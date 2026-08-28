import type { StoryGalleryItem } from '@/modules/story/types'
import galleryImage01 from '@/shared/assets/gallery/editorial-hero-01.jpg'
import galleryImage02 from '@/shared/assets/gallery/editorial-hero-02.jpg'
import galleryImage03 from '@/shared/assets/gallery/banner.jpg'
import galleryImage04 from '@/shared/assets/gallery/login-hero-bg-01.jpg'
import galleryImage05 from '@/shared/assets/gallery/login-hero-bg-02.jpg'
import galleryImage06 from '@/shared/assets/gallery/login-hero-bg-03.jpg'
import galleryImage07 from '@/shared/assets/gallery/pic04.jpg'
import galleryImage08 from '@/shared/assets/gallery/pic05.jpg'
import galleryImage09 from '@/shared/assets/ui/default-avatar.png'
import galleryImage10 from '@/shared/assets/logos/brand-home-header.png'
import galleryImage11 from '@/shared/assets/icons/vue.svg'
import galleryImage12 from '@/shared/assets/gallery/editorial-hero-01.jpg'

const defaultDescription =
  'Nunc blandit nisi ligula magna sodales lectus elementum non. Integer id venenatis velit.'

export const STORY_GALLERY_ITEMS: StoryGalleryItem[] = [
  { title: 'Magna Feugiat Lorem', description: defaultDescription, image: galleryImage01, thumbnail: galleryImage01 },
  { title: 'Nisl Adipiscing', description: defaultDescription, image: galleryImage02, thumbnail: galleryImage02 },
  { title: 'Tempus Aliquam Veroeros', description: defaultDescription, image: galleryImage03, thumbnail: galleryImage03 },
  { title: 'Aliquam Ipsum Sed Dolore', description: defaultDescription, image: galleryImage04, thumbnail: galleryImage04 },
  { title: 'Cursis Aliquam Nisl', description: defaultDescription, image: galleryImage05, thumbnail: galleryImage05 },
  { title: 'Sed Consequat Phasellus', description: defaultDescription, image: galleryImage06, thumbnail: galleryImage06 },
  { title: 'Mauris Id Tellus Arcu', description: defaultDescription, image: galleryImage07, thumbnail: galleryImage07 },
  { title: 'Nunc Vehicula Id Nulla', description: defaultDescription, image: galleryImage08, thumbnail: galleryImage08 },
  { title: 'Neque Et Faucibus Viverra', description: defaultDescription, image: galleryImage09, thumbnail: galleryImage09 },
  { title: 'Mattis Ante Fermentum', description: defaultDescription, image: galleryImage10, thumbnail: galleryImage10 },
  { title: 'Sed Ac Elementum Arcu', description: defaultDescription, image: galleryImage11, thumbnail: galleryImage11 },
  { title: 'Vehicula Id Nulla Dignissim', description: defaultDescription, image: galleryImage12, thumbnail: galleryImage12 },
]