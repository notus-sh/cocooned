/* globals Cocooned */
//= require 'cocooned'

// Compatibility with the original Cocoon
// TODO: Remove in 3.0
function initCocoon () {
  const findInsertionNode = function (trigger) {
    const insertionNode = trigger.data('association-insertion-node');
    const insertionTraversal = trigger.data('association-insertion-traversal');

    if (!insertionNode) return trigger.parent()
    if (typeof insertionNode === 'function') return insertionNode(trigger)
    if (insertionTraversal) return trigger[insertionTraversal](insertionNode)
    return insertionNode === 'this' ? trigger : $(insertionNode)
  }

  const findContainer = function (trigger) {
    const $trigger = $(trigger)
    const insertionNode = findInsertionNode($trigger)
    const insertionMethod = $trigger.data('association-insertion-method') || 'before'

    if (['before', 'after', 'replaceWith'].includes(insertionMethod)) return insertionNode.parent()
    return insertionNode
  }

  $('.cocooned-add, .add_fields')
    .map((_i, adder) => findContainer(adder))
    .each((_i, container) => $(container).cocooned())
}

$(initCocoon)
