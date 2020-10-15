import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'user',
    meta: {
      title: '用户管理',
      icon: 'user'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'user_list',
        meta: { title: '用户列表' }
      }
    ]
  },
  {
    path: '/ads',
    component: Layout,
    redirect: '/carousel',
    name: 'ads',
    meta: {
      title: '广告位管理',
      icon: 'example'
    },
    children: [
      {
        path: 'ads_cates',
        component: () => import('@/views/ads/ads_cates'),
        name: 'ads_cates',
        meta: { title: '分类管理' }
      },
      {
        path: 'ads_content',
        component: () => import('@/views/ads/ads_content'),
        name: 'ads_content',
        meta: { title: '内容管理' }
      },
      {
        path: 'articles',
        component: () => import('@/views/ads/articles'),
        name: 'ads_content',
        meta: { title: '文章管理' }
      },
      {
        path: 'articles_create',
        component: () => import('@/views/ads/article_add_check/create'),
        hidden: true,
        name: 'articles_create',
        meta: { title: '文章添加' }
      },
      {
        path: 'articles_edit',
        component: () => import('@/views/ads/article_add_check/edit'),
        hidden: true,
        name: 'articles_edit',
        meta: { title: '文章编辑' }
      }
    ]
  },
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods',
    name: 'goods',
    meta: {
      title: '商品管理',
      icon: 'excel'
    },
    children: [
      {
        path: 'goods',
        component: () => import('@/views/goods/goods'),
        name: 'goods',
        meta: { title: '商品管理' }
      },
      {
        path: 'goods_create',
        component: () => import('@/views/goods/goods_add_check/create'),
        name: 'goods_create',
        hidden: true,
        meta: { title: '添加商品' }
      },
      {
        path: 'goods_edit',
        component: () => import('@/views/goods/goods_add_check/edit'),
        name: 'goods_edit',
        hidden: true,
        meta: { title: '编辑商品' }
      }
    ]
  },
  {
    path: '/recharge',
    component: Layout,
    redirect: '/recharge',
    name: 'recharge',
    meta: { title: '充值管理', icon: 'guide', noCache: true },
    children: [
      {
        path: 'rechargeList',
        component: () => import('@/views/recharge/rechargeList'),
        name: 'rechargeList',
        meta: { title: '充值列表', noCache: true }
      },
      {
        path: 'rechargeCountConfig',
        component: () => import('@/views/recharge/rechargeCountConfig'),
        name: 'rechargeCountConfig',
        meta: { title: '金额配置', noCache: true }
      }
    ]
  },
  {
    path: '/integral',
    component: Layout,
    redirect: '/integral',
    name: 'integral',
    meta: { title: '积分管理', icon: 'table', noCache: true },
    children: [
      {
        path: 'rechargeConfig',
        component: () => import('@/views/recharge/rechargeConfig'),
        name: 'rechargeConfig',
        meta: { title: '等级配置', noCache: true }
      },
      {
        path: 'register',
        component: () => import('@/views/integral/register'),
        name: 'register',
        meta: { title: '签到配置', noCache: true }
      },
      {
        path: 'register_leiji',
        component: () => import('@/views/integral/register_leiji'),
        name: 'register_leiji',
        meta: { title: '累计配置', noCache: true }
      }
      // {
      //   path: 'buRegister',
      //   component: () => import('@/views/integral/buRegister'),
      //   name: 'buRegister',
      //   meta: { title: '补签到配置', noCache: true }
      // }
    ]
  },
  {
    path: '/services_model2',
    component: Layout,
    redirect: '/services_model2',
    name: 'services_model2',
    meta: { title: '营销管理', icon: 'list', noCache: true },
    children: [
      {
        path: 'service_list',
        component: () => import('@/views/service_model/service_list'),
        name: 'service_model',
        meta: { title: '礼品仓库', noCache: true }
      },
      {
        path: 'service_list2',
        component: () => import('@/views/service_model/cate_list'),
        name: 'service_model2',
        meta: { title: '领取配置', noCache: true }
      },
      {
        path: 'service_list3',
        component: () => import('@/views/service_model/little_tree'),
        name: 'service_model3',
        meta: { title: '小树配置', noCache: true }
      }
    ]
  },
  {
    path: '/finacial',
    component: Layout,
    redirect: '/finacial',
    name: 'finacial',
    meta: { title: '财务管理', icon: 'chart', noCache: true },
    children: [
      {
        path: 'finacial',
        component: () => import('@/views/finacial/finacial'),
        name: 'finacial',
        meta: { title: '订单列表', noCache: true }
      },
      {
        path: 'finacial_list',
        component: () => import('@/views/finacial/finacial_list'),
        name: 'finacial_list',
        meta: { title: '提现列表', noCache: true }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '个人信息', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: '图标库', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: '例子',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: '编辑文章', noCache: true, activeMenu: '/example/list' }
  //       // hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: '文章列表', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: '切换', icon: 'tab' }
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: '错误页面',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: '错误日志', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: '导出 Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: '选择导出' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: '合并头部' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: '上传 Excel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: '导出 Zip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: '导出PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: '主题', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: '项目链接', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },

  // permission
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/page',
    alwaysShow: true, // will always show the root menu
    name: 'Permission',
    meta: {
      title: '权限管理',
      icon: 'lock'
      // roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: '授权规则'
          // roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: '管理员管理'
          // if do not set roles, means: this page does not require permission
        }
      },
      {
        path: 'role',
        component: () => import('@/views/permission/role'),
        name: 'RolePermission',
        meta: {
          title: '用户组管理'
          // roles: ['admin']
        }
      },
      {
        path: '401',
        component: () => import('@/views/error-page/401'),
        name: 'Page401',
        meta: { title: '没权限', noCache: true },
        hidden: true
      }
    ]
  },

  // config
  {
    path: '/config',
    component: Layout,
    children: [
      {
        path: 'config',
        component: () => import('@/views/config/config'),
        name: 'config',
        meta: { title: '系统设置', icon: 'component' }
      }
    ]
  },
  {
    path: 'login_out',
    component: Layout,
    redirect: '/permission/page',
    name: 'login_out'
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
