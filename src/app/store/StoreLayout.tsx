'use client'

import { Provider } from 'react-redux'
import { store } from './store'

const StoreLayout = ({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) => {

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default StoreLayout