import AuthGate from './AuthGate';
import MarketingSite from './MarketingSite';
import PaymentPage from './PaymentPage';
import TrialApp from './TrialApp';
const normalize=(p:string)=>p.replace(/\/+$/,'')||'/';
export default function App(){const path=normalize(window.location.pathname);if(path==='/trial/drugs')return <AuthGate><TrialApp/></AuthGate>;if(path==='/payment')return <AuthGate requireLogin><PaymentPage/></AuthGate>;if(path==='/program')return <MarketingSite page="program"/>;if(path==='/features')return <MarketingSite page="features"/>;if(path==='/photo-evidence')return <MarketingSite page="photoEvidence"/>;if(path==='/crime-scene')return <MarketingSite page="crimeScene"/>;if(path==='/traffic-fine')return <MarketingSite page="trafficFine"/>;return <MarketingSite/>}
