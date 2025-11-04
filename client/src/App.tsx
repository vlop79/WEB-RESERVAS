import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Admin from "./pages/Admin";
import BookingsManagement from "./pages/BookingsManagement";
import CalendarView from "./pages/CalendarView";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import FAQs from "./pages/FAQs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ZohoTokenGenerator from "./pages/ZohoTokenGenerator";
import CompanyDashboard from "./pages/CompanyDashboard";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import RatePage from "./pages/RatePage";
import VolunteerLogin from "./pages/VolunteerLogin";
import VolunteerRegister from "./pages/VolunteerRegister";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import VolunteerProfile from "./pages/VolunteerProfile";
import VolunteerRankings from "./pages/VolunteerRankings";
import VolunteerCertificates from "./pages/VolunteerCertificates";
import VolunteerMyImpact from "./pages/VolunteerMyImpact";
import VolunteerCompanyImpact from "./pages/VolunteerCompanyImpact";
import VolunteerLibrary from "./pages/VolunteerLibrary";
import VolunteerCourses from "./pages/VolunteerCourses";
import VolunteerForgotPassword from "./pages/VolunteerForgotPassword";


function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/faqs"} component={FAQs} />
      <Route path={"/reservar/:slug"} component={Booking} />
      <Route path={"/valorar"} component={RatePage} />
      <Route path={"/portal-voluntario/login"} component={VolunteerLogin} />
      <Route path={"/portal-voluntario/registro"} component={VolunteerRegister} />
      <Route path={"/portal-voluntario/recuperar-contrasena"} component={VolunteerForgotPassword} />
      <Route path={"/portal-voluntario/dashboard"} component={VolunteerDashboard} />
      <Route path={"/portal-voluntario/perfil"} component={VolunteerProfile} />
      <Route path={"/portal-voluntario/rankings"} component={VolunteerRankings} />
      <Route path={"/portal-voluntario/certificados"} component={VolunteerCertificates} />
      <Route path={"/portal-voluntario/impacto"} component={VolunteerMyImpact} />
      <Route path={"/portal-voluntario/empresa"} component={VolunteerCompanyImpact} />
      <Route path={"/portal-voluntario/biblioteca"} component={VolunteerLibrary} />
      <Route path={"/portal-voluntario/cursos"} component={VolunteerCourses} />
      <Route path={"/login"} component={Login} />
      <Route path={"/forgot-password"} component={ForgotPassword} />
      <Route path={"/reset-password"} component={ResetPassword} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/admin/dashboard"} component={Dashboard} />
      <Route path={"/admin/reservas"} component={BookingsManagement} />      <Route path={"/admin/calendario"} component={CalendarView} />
      <Route path={"/calendario"} component={CalendarView} />
      <Route path={"/admin/zoho-setup"} component={ZohoTokenGenerator} />
      <Route path={"/company/dashboard"} component={CompanyDashboard} />

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
