import AuthGate from './AuthGate';
import MarketingSite from './MarketingSite';
import PaymentPage from './PaymentPage';
import TrialApp from './TrialApp';
const normalize=(p:string)=>p.replace(/\/+$/,'')||'/';
export default function App(){const path=normalize(window.location.pathname);if(path==='/trial/drugs')return <AuthGate><TrialApp/></AuthGate>;if(path==='/payment')return <AuthGate requireLogin><PaymentPage/></AuthGate>;return <MarketingSite/>}
