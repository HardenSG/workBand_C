import { Provider } from 'react-redux'
import { useError } from '@tarojs/taro'
import Error from './components/Error'
import { store } from './store'
import './app.scss'

function App(props) {
  useError((err) => {
    console.log('错了', err)
    return <Error />
  })
  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <Provider store={store}>
      {/* props.children 是将要被渲染的页面 */}
      {props.children}
    </Provider>
  )
}

export default App
