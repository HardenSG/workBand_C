import Taro from '@tarojs/taro'
import lottie from 'lottie-miniprogram'

export const $ = (selector: string) => {
  return Taro.createSelectorQuery().select(selector).node()
}

interface LoadAnimationParameter {
  renderer?: 'canvas';
  loop?: boolean | number;
  autoplay?: boolean;
  name?: string;
  rendererSettings?: any;
  animationData?: any;
  path?: string;
}

export const loadAnimation = (node: Taro.SelectorQuery, options: LoadAnimationParameter) => {
  node.exec((res: any) => {
    const canvas = res[0].node
    const context = canvas.getContext('2d')

    lottie.setup(canvas)
    const lottieIns = lottie.loadAnimation({
      rendererSettings: {
        progressiveLoad: true,
        context,
      },
      autoplay: true,
      loop: true,
      ...options,
    })
    return lottieIns
  })
}

export const ls = () => { }
