import React, { useRef, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { sendDeviceInfo, sendLocationInfo } from './utils/deviceInfo.jsx';
import Header from './components/Header';
import Footer from './components/Footer';
import Cookies from './components/CookieConsent.jsx';
import PageTransition from './components/PageTransition';
import './App.css';
import HubComputerDetails from './pages/7HubComputerDetails.jsx';

const SignIn = lazy(() => import('./components/SignIn'));
const Profile = lazy(() => import('./components/Profile'));
const Cart = lazy(() => import('./components/Cart'));
const Home = lazy(() => import('./pages/Home'));
const PreBuiltPCs = lazy(() => import('./pages/PreBuiltPCs'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/privacy'));
const Terms = lazy(() => import('./pages/terms'));
const Faq = lazy(() => import('./pages/faq'));
const Support = lazy(() => import('./pages/Support'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const Laptop = lazy(() => import('./pages/Laptop'));
const MiniPC = lazy(() => import('./pages/MiniPCs'));
const OfficePCs = lazy(() => import('./pages/office_pc.jsx'));
const Payment = lazy(() => import('./components/Payment'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
const CategoryPage = lazy(() => import('./pages/Categories.jsx'));
const Accessories = lazy(() => import('./pages/Accessories.jsx'));
const MonitorsDisplays = lazy(() => import('./pages/MonitorsDisplays.jsx'));
const Cameras = lazy(() => import('./pages/Cameras.jsx'));
const Wearables = lazy(() => import('./pages/Wearables.jsx'));
const Mobile_Tables = lazy(() => import('./pages/Mobiles_&_Tablets.jsx'));
const TV_Entertainment = lazy(() => import('./pages/TV_&_Entertainment.jsx'));
const Audio = lazy(() => import('./pages/Audio.jsx'));
const PC_Components = lazy(() => import('./pages/PC_Components.jsx'));
const Kitchen_Appliances = lazy(() => import('./pages/Kitchen_Appliances.jsx'));
const Laundry_Cleaning = lazy(() => import('./pages/Laundry_&_Cleaning.jsx'));

const App = () => {
  useEffect(() => {
    sendDeviceInfo();
    sendLocationInfo();
  }, []);
  const location = useLocation();
  const nodeRef = useRef(null);
  const isAdminRoute = location.pathname === '/admin';

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        {!isAdminRoute && <Header />}
        <Cookies />
        <main className="pt-[80px]">
          <div ref={nodeRef}>
            <PageTransition in={true} nodeRef={nodeRef}>
              <Suspense fallback={
                <div className="flex justify-center items-center h-screen bg-gray-100">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg text-gray-600 font-medium">Loading, please wait...</p>
                  </div>
                </div>
              }>
                <Routes location={location} key={location.pathname}>
                  <Route path="/about" element={<About />} />
                  <Route path='/admin' element={<AdminPanel />} />
                  <Route path='/accessories' element={<Accessories />} />
                  {/* <Route path="/accessories/:subcategory" element={<Accessories />} /> */}
                  <Route path='/accessories/:id' element={<ProductDetails />} />
                  <Route path='/cart' element={<Cart />} />

                  <Route path="/categories" element={<CategoryPage />} />
                  <Route path="/categories/laptops" element={<Laptop />} />
                  <Route path="/categories/mobiles" element={<Mobile_Tables />} />
                  <Route path="/categories/tvs" element={<TV_Entertainment />} />
                  <Route path="/categories/displays" element={<MonitorsDisplays />} />
                  <Route path="/categories/kitchenAppliances" element={<Kitchen_Appliances />} />
                  <Route path="/categories/laundry" element={<Laundry_Cleaning />} />
                  <Route path="/categories/accessories" element={<Accessories />} />
                  <Route path="/categories/cameras" element={<Cameras />} />
                  <Route path="/categories/wearables" element={<Wearables />} />
                  <Route path="/categories/audio" element={<Audio />} />



                  <Route path='/profile' element={<Profile />} />
                  <Route path="/prebuilt" element={<PreBuiltPCs />} />
                  <Route path="/mini-pcs" element={<MiniPC />} />
                  <Route path="/mini-pcs/:id" element={<ProductDetails />} />
                  <Route path="/office-pcs" element={<OfficePCs />} />
                  <Route path="/office-pc/:id" element={<ProductDetails />} />
                  <Route path="/pc/:id" element={<ProductDetails />} />
                  <Route path="/laptops/:id" element={<ProductDetails />} />
                  <Route path="/" element={<Home />} />
                  <Route path='/payment' element={<Payment />} />
                  <Route path='/laptops' element={<Laptop />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path='/privacy' element={<Privacy />} />
                  <Route path='/terms' element={<Terms />} />
                  <Route path='/faq' element={<Faq />} />
                  <Route path='/support' element={<Support />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path='/signin' element={<SignIn />} />
                  <Route path="/7hubcomputer-details" element={<HubComputerDetails />} />
                  <Route path='/displays' element={<MonitorsDisplays />} />
                  <Route path='/displays/:id' element={<ProductDetails />} />
                  <Route path='/cameras' element={<Cameras />} />
                  <Route path='/cameras/:id' element={<ProductDetails />} />
                  <Route path='/wearables' element={<Wearables />} />
                  <Route path='/wearables/:id' element={<ProductDetails />} />
                  <Route path='/mobiles' element={<Mobile_Tables />} />
                  <Route path='/mobiles/:id' element={<ProductDetails />} />
                  <Route path='/tvs' element={<TV_Entertainment />} />
                  <Route path='/tv/:id' element={<ProductDetails />} />
                  <Route path='/audio' element={<Audio />} />
                  <Route path='/audio/:id' element={<ProductDetails />} />
                  <Route path='/audio/:subcategory' element={<Audio />} />

                  <Route path='/components' element={<PC_Components />} />
                  <Route path='/components/:id' element={<ProductDetails />} />
                  <Route path='/kitchen' element={<Kitchen_Appliances />} />
                  <Route path='/kitchen/:id' element={<ProductDetails />} />
                  <Route path='/laundry' element={<Laundry_Cleaning />} />
                  <Route path='/laundry/:id' element={<ProductDetails />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </div>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    </HelmetProvider>
  );
};

export default App;