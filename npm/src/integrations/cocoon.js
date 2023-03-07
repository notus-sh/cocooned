const cocoonSupportMixin = (Base) => class extends Base {
  static get eventNamespaces () {
    return [...super.eventNamespaces, 'cocoon']
  }

  static get selectors () {
    const selectors = super.selectors
    selectors.item.push('.nested-fields')
    selectors['triggers.add'].push('.add_fields')
    selectors['triggers.remove'].push('.remove_fields')

    return selectors
  }
}

const findInsertionNode = function (trigger, $) {
  const insertionNode = trigger.data('association-insertion-node')
  const insertionTraversal = trigger.data('association-insertion-traversal')

  if (!insertionNode) return trigger.parent()
  if (typeof insertionNode === 'function') return insertionNode(trigger)
  if (insertionTraversal) return trigger[insertionTraversal](insertionNode)
  return insertionNode === 'this' ? trigger : $(insertionNode)
}

const findContainer = function (trigger, $) {
  const $trigger = $(trigger)
  const insertionNode = findInsertionNode($trigger, $)
  const insertionMethod = $trigger.data('association-insertion-method') || 'before'

  if (['before', 'after', 'replaceWith'].includes(insertionMethod)) return insertionNode.parent()
  return insertionNode
}

const cocoonAutoStart = function (jQuery) {
  jQuery('.add_fields')
    .map((_i, adder) => findContainer(adder, jQuery))
    .each((_i, container) => jQuery(container).cocooned())
}

export {
  cocoonAutoStart,
  cocoonSupportMixin
}
