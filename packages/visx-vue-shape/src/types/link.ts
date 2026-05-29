export type AccessorProps<Link, Node> = {
  /** Given a node, returns its x coordinate. */
  x?: (node: Node) => number
  /** Given a node, returns its y coordinate. */
  y?: (node: Node) => number
  /** Given a link, returns the source node. */
  source?: (link: Link) => Node
  /** Given a link, returns the target node. */
  target?: (link: Link) => Node
}

export type RadialAccessorProps<Link, Node> = Pick<
  AccessorProps<Link, Node>,
  'source' | 'target'
> & {
  /** Given a node, returns its x coordinate. */
  angle?: (node: Node) => number
  /** Given a node, returns its y coordinate. */
  radius?: (node: Node) => number
}

type PathType<Link> = (link: Link) => string | null

export type SharedLinkProps<Link> = {
  /** className applied to path element. */
  className?: string
  /** Path generator, given a link returns a path d attribute string */
  path?: PathType<Link>
  /** Datum for which to render a link. */
  data: Link
}
