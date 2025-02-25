import * as Pages from './pages/pages'
import Preload from './components/Preload/Preload'
import CartContextProvider from './stores/CartContext'
import AuthContextProvider from './stores/UserContext'
import SettingsContextProvider from './stores/SettingsContext'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import AdminRoute from './components/routes/AdminRoute/AdminRoute'
import RootLayout from './components/layouts/RootLayout/RootLayout'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from './components/routes/ProtectedRoute/ProtectedRoute'
import AnimatedLayout from './components/layouts/AnimatedLayout/AnimatedLayout'

const theme = createTheme({
  palette: {
    primary: {
      main: '#a4ca49'
    },
    secondary: {
      main: '#575352'
    }
  }
})

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Preload>
          <ProtectedRoute>
            <RootLayout />
          </ProtectedRoute>
        </Preload>
      ),
      errorElement: <Pages.ErrorOccurs />,
      children: [
        { index: true, element: <Pages.Home /> },
        { path: 'cart', element: <Pages.Cart /> },
        { path: 'product/:productId', element: <Pages.ProductDetails /> },
        { path: 'coupons', element: <Pages.Coupons /> },
        { path: 'coupons/:categoryId', element: <Pages.Coupons /> },
        { path: 'newspaper', element: <Pages.Newspaper /> },
        { path: 'newspaper/:categoryId', element: <Pages.Newspaper /> },
        { path: 'accountSettings', element: <Pages.AccountSettings /> },
        { path: 'accountSettings/changePassword', element: <Pages.ChangePassword /> },
        { path: 'regulations', element: <Pages.Regulations /> },
        {
          path: 'admin',
          element: <AdminRoute />,
          children: [
            { path: 'finalizeTransaction', element: <Pages.FinalizeTransaction /> },
            { path: 'panel', element: <Pages.AdminPanel /> },
            { path: 'panel/shopSettings', element: <Pages.ShopSettings /> },
            { path: 'panel/manageCategories', element: <Pages.ManageCategories /> },
            { path: 'panel/manageCategories/:categoryId', element: <Pages.ManageCategory /> },
            { path: 'panel/manageProducts', element: <Pages.ManageProducts /> },
            { path: 'panel/manageProducts/:productId', element: <Pages.ManageProduct /> },
            { path: 'panel/manageProducts/:productId/variants', element: <Pages.ManageProductVariants /> },
            { path: 'panel/manageProducts/:productId/variants/:variantId', element: <Pages.ManageProductVariant /> },
            { path: 'panel/clients', element: <Pages.Clients /> },
            { path: 'panel/clients/history/:userId', element: <Pages.ClientHistory /> },
            { path: 'panel/manageNews', element: <Pages.ManageNews /> },
            { path: 'panel/manageNews/:newsId', element: <Pages.ManageNewsItem /> }
          ]
        }
      ]
    },
    {
      path: '/p',
      element: <AnimatedLayout />,
      errorElement: <Pages.ErrorOccurs />,
      children: [
        { path: '/p/login', element: <Pages.Login /> },
        { path: '/p/registration', element: <Pages.Registration /> },
        { path: '/p/forgotPassword', element: <Pages.ForgotPassword /> },
        { path: '/p/regulations', element: <Pages.Regulations publicAccess={true} /> }
      ]
    }
  ])

  return (
    <AuthContextProvider>
      <SettingsContextProvider>
        <CartContextProvider>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </CartContextProvider>
      </SettingsContextProvider>
    </AuthContextProvider>
  )
}

export default App
