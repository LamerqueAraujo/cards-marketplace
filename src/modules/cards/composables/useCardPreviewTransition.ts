import type { Ref } from 'vue'
import type { UserCard } from '../types/cards.types'

interface Options {
  cards: Ref<UserCard[]>
  onOpen: (card: UserCard) => void
  onClose: () => void
}

export function useCardPreviewTransition(options: Options) {
  const { cards, onOpen, onClose } = options

  let transitionOriginEl: HTMLElement | null = null
  let transitionCard: UserCard | null = null

  function handleCardSelect(payload: { id: string; el: HTMLElement | null }) {
    const card = cards.value.find(c => c.id === payload.id)
    if (!card || !payload.el) return

    transitionOriginEl = payload.el
    transitionCard = card

    startCardTransition()
  }


  function startCardTransition() {
    if (!transitionOriginEl || !transitionCard) return

    const rect = transitionOriginEl.getBoundingClientRect()

    const ghost = document.createElement('img')
    ghost.src = transitionCard.imageUrl

    ghost.style.position = 'fixed'
    ghost.style.top = rect.top + 'px'
    ghost.style.left = rect.left + 'px'
    ghost.style.width = rect.width + 'px'
    ghost.style.height = rect.height + 'px'
    ghost.style.zIndex = '9999'
    ghost.style.transition = 'all .45s cubic-bezier(.2,.8,.2,1)'

    document.body.appendChild(ghost)

    requestAnimationFrame(() => {
      ghost.style.top = '50%'
      ghost.style.left = '50%'
      ghost.style.transform =
        'translate(-50%, -50%) scale(1.6) rotateY(15deg)'
    })

    setTimeout(() => {
      document.body.removeChild(ghost)
      onOpen(transitionCard!)
    }, 450)
  }

  function animateBackToOrigin() {
    if (!transitionOriginEl || !transitionCard) {
      onClose()
      return
    }

    const rect = transitionOriginEl.getBoundingClientRect()

    const ghost = document.createElement('img')
    ghost.src = transitionCard.imageUrl

    ghost.style.position = 'fixed'
    ghost.style.top = '50%'
    ghost.style.left = '50%'
    ghost.style.transform =
      'translate(-50%, -50%) scale(1.6) rotateY(15deg)'
    ghost.style.width = rect.width + 'px'
    ghost.style.height = rect.height + 'px'
    ghost.style.zIndex = '9999'
    ghost.style.transition = 'all .45s cubic-bezier(.2,.8,.2,1)'

    document.body.appendChild(ghost)

    onClose()

    requestAnimationFrame(() => {
      ghost.style.top = rect.top + 'px'
      ghost.style.left = rect.left + 'px'
      ghost.style.transform = 'scale(1) rotateY(0deg)'
    })

    setTimeout(() => {
      document.body.removeChild(ghost)
      transitionCard = null
      transitionOriginEl = null
    }, 450)
  }

  return {
    handleCardSelect,
    animateBackToOrigin
  }
}
