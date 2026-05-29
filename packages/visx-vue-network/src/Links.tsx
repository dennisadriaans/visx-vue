import { defineComponent, type PropType, type Component } from 'vue'
import { Group } from '@visx-vue/group'
import DefaultLink from './DefaultLink'

export type LinksProps<Link> = {
  /** Array of links to render. */
  links?: Link[]
  /** Component for rendering a single link. */
  linkComponent: Component
  /** Classname to add to each link parent g element. */
  className?: string
}

export const Links = defineComponent({
  name: 'Links',
  props: {
    links: { type: Array as PropType<unknown[]>, default: () => [] },
    linkComponent: { type: [Object, Function] as PropType<Component>, default: DefaultLink },
    className: { type: String as PropType<string>, default: undefined }
  },
  setup(props) {
    return () => (
      <>
        {(props.links as unknown[]).map((link, i) => {
          const LinkComponent = props.linkComponent as any
          return (
            <Group
              key={`network-link-${i}`}
              class={['visx-network-link', props.className]}
            >
              <LinkComponent link={link} />
            </Group>
          )
        })}
      </>
    )
  }
})

export default Links
