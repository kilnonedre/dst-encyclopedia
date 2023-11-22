import { adminRouterList } from './children/adminRouter'

const routerList = [
  {
    mark: 'admin',
    name: '首页',
    href: 'admin',
    children: adminRouterList,
  },
]

export { routerList }
