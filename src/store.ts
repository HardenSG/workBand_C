import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import selectPlugin from '@rematch/select'
import { models, RootModel } from './models'

export const store = init<RootModel>({
  models,
  plugins: [immerPlugin(), selectPlugin()],
})

export type Store = typeof store
export type RootDispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
