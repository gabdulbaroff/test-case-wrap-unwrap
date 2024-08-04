import './App.css'
import {Header} from "./components/Header/Header.tsx";
import {Wrap} from "./pages/Wrap/Wrap.tsx";
import { WagmiProvider } from 'wagmi'
import {wagmiConfig} from "../walletConfig.ts";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const queryClient = new QueryClient()

function App() {
  return (
      <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
              <ToastContainer />
              <Header />
            {/*Here should be the react router provider, but we have only one page*/}
            <Wrap />
          </QueryClientProvider>
    </ WagmiProvider>
  )
}

export default App
