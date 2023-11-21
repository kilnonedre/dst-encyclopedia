import { homeRouterList } from './children/homeRouter'

const routerList = [
  {
    mark: 'home',
    name: '首页',
    href: 'home',
    children: homeRouterList,
  },
]

export { routerList }
