import head from './head'
import sidebar from './sidebar'
import nav from './nav'
import markdown from './markdown'
import lang from './lang'

const config = {
  title: '前端知识星🌟球⚽',
  description: '学习开发日常记录',
  head,
  markdown,
  themeConfig: {
    search: true,  // 展开搜索
    algolia: {
      appKey: '',
      indexName: '',
      searchParameters: {
        faeFilters: ['tags:guide,api'],
      },
    },
    sidebar,
    nav,
    demoblock: lang,
    logo: '/author.jpeg',
    lastUpdated: 'Last Update',
    author: 'YuanZhi Feng',
    authorAvatar: '/author.jpeg',  // 作者头像
    record: '未备案', // 备案
  },
}

export default config