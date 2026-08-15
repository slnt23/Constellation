import { computed, ref } from 'vue'
import { MEDITATIONS } from '@/modules/meditation/constants'
import type { Meditation } from '@/modules/meditation/types'

export function useMeditation() {
  const meditations = ref<Meditation[]>(MEDITATIONS)
  const activeId = ref(0)
  const activeMeditation = computed(() => meditations.value[activeId.value])

  const selectMeditation = (id: number) => {
    activeId.value = id
  }

  return {
    meditations,
    activeId,
    activeMeditation,
    selectMeditation,
  }
}
