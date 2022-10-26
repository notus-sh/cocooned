const asAttribute = function(string) {
  return string.replaceAll(/</g, '&lt;')
      .replaceAll(/>/g, '&gt;')
      .replaceAll(/"/g, '&quot;')
      .trim();
};

module.exports = {
  asAttribute: asAttribute
}
