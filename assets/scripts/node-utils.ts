
export function recurseAncestors(node: cc.Node): cc.Node[] {
  if (node.parent != null) {
    return [node.parent, ...recurseAncestors(node.parent)];
  }
  return [];
}

export function findCommonAncestor(a: cc.Node, b: cc.Node): cc.Node {
  // optimized siblings
  if (a.parent === b.parent) {
    return a.parent;
  }
  const aParents = recurseAncestors(a);
  const bParents = recurseAncestors(b);

}
