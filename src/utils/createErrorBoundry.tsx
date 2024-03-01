import { View } from '@tarojs/components'
import { Component } from 'react'

export function createErrorBoundary(Page) {
  return class ErrorBoundary extends Component {
    static getDerivedStateFromError() {
      return {
        hasError: true,
      }
    }
    state = {
      hasError: null,
    }

    componentDidCatch(error, errorInfo) {
      console.log(error, errorInfo)
    }

    render() {
      return this.state.hasError ? <View>Something went wrong.</View> : <Page />
    }
  }
}
