import AuthGate from './AuthGate';
import MarketingSite from './MarketingSite';
import TrialApp from './TrialApp';
import UserHome from './UserHome';
const normalize=(p:string)=>p.replace(/\/+$/,'')||'/';
export default function App(){const path=normalize(window.location.pathname);if(path==='/trial/drugs')return <AuthGate><TrialApp/></AuthGate>;if(path==='/user')return <AuthGate><UserHome/></AuthGate>;return <MarketingSite/>}
