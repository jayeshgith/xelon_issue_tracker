import CTASection from '../components/landing/CTASection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import HeroSection from '../components/landing/HeroSection.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';
import LandingNavbar from '../components/landing/LandingNavbar.jsx';
import LifecycleSection from '../components/landing/LifecycleSection.jsx';
import PreviewSection from '../components/landing/PreviewSection.jsx';
import RolesSection from '../components/landing/RolesSection.jsx';
import TrustSection from '../components/landing/TrustSection.jsx';

const LandingPage = () => (
  <div className="app-bg min-h-screen bg-slate-50">
    <LandingNavbar />
    <main>
      <HeroSection />
      <RolesSection />
      <HowItWorks />
      <LifecycleSection />
      <FeaturesSection />
      <PreviewSection />
      <TrustSection />
      <CTASection />
    </main>
    <LandingFooter />
  </div>
);

export default LandingPage;