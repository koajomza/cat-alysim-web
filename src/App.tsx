import AuthGate from './AuthGate';
import MarketingSite from './MarketingSite';
import TrialApp from './TrialApp';
const normalize=(p:string)=>p.replace(/\/+$/,'')||'/';
export default function App(){const path=normalize(window.location.pathname);return path==='/trial/drugs'?<AuthGate><TrialApp/></AuthGate>:<MarketingSite/>}
