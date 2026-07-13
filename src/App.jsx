import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CreateApartment from "./pages/Apartment/CreateApartment.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Apartment from "./pages/Apartment/Apartment.jsx";
import UpdateApartment from "./pages/Apartment/UpdateApartments/UpdateApartment.jsx";
import Main from "./pages/Main/Main.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy.jsx";
import PersonalAccount from "./pages/PersonalAccount/PersonalAccount.jsx";
import Rules from "./pages/Rules/Rules.jsx";
import AboutUs from "./pages/AboutUs/AboutUs.jsx";
import Faqs from "./pages/Faqs/Faqs.jsx";
import CreateFaq from "./components/CreateFaq/CreateFaq.jsx";
import EditFaq from "./components/EditFaq/EditFaq.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import EmailVerificationModal from "./components/EmailVerification/EmailVerification.jsx";
import VerifyEmail from "./pages/VerifyEmail/VerifyEmail.jsx";
import CookieConsent from "./components/CookieConset/CookieConset.jsx";
import ApartmentsMap from "./pages/ApartmentsMap/ApartmentsMap.jsx";
import CallRequest from "./pages/CallRequest/CallRequest.jsx";


export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <CookieConsent/>
            {/*<EmailVerificationModal/>*/}
                <Routes>
                    <Route path='*' element={<NotFound />} />

                    <Route path='/privacy-policy' element={<PrivacyPolicy/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/rules" element={<Rules/>} />
                    <Route path="/aboutUs" element={<AboutUs/>} />
                    <Route path="/faqs" element={<Faqs/>} />
                    <Route path='/verify-email' element={<VerifyEmail/>} />
                    <Route path="/" element={<Main/>} />
                    <Route path="/profile" element={<PersonalAccount/>} />
                    <Route path='apartments/:slug' element={<Apartment/>}/>
                    <Route path='/apartments-map' element={<ApartmentsMap/>}/>
                    <Route path='/call-request' element={<CallRequest/>}/>
                    {/* Админ панель */}
                    <Route path='/admin' element={<Admin/>}/>
                    <Route path="/admin/:tab" element={<Admin />} />
                    <Route path="/admin/faqs/create" element={<CreateFaq/>} />
                    <Route path="/admin/faqs/edit/:id" element={<EditFaq/>} />
                    <Route path="/admin/apartments/create" element={<CreateApartment/>} />
                    <Route path='/admin/apartments/edit/:id' element={<UpdateApartment/>}/>

                </Routes>
            <Footer />
        </BrowserRouter>
    )
};