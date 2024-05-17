class Builder {
  constructor (documentFragment, replacements) {
    this.#documentFragment = documentFragment
    this.#replacements = replacements
  }

  build (id) {
    const node = this.#documentFragment.cloneNode(true)
    this.#applyReplacements(node, id)
    return node
  }

  /* Protected and private attributes and methods */
  #documentFragment
  #replacements

  #applyReplacements (node, id) {
    this.#replacements.forEach(replacement => {
      node.querySelectorAll(`*[${replacement.attribute}]`).forEach(node => replacement.apply(node, id))
    })

    node.querySelectorAll('template').forEach(template => {
      this.#applyReplacements(template.content, id)
    })
  }
}

export {
  Builder
}
