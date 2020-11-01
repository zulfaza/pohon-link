import {BrowserRouter as Router,Switch,Route} from "react-router-dom";
import {AuthProvider} from '../contexts/AuthContext';
import RouteName from '../config/RouteName';

// Component
import UserRoute from './UserRoute';
import GuestOnlyRoute from './GuestOnlyRoute';

// Pages
import Dashboard from '../pages/Dashboard';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import EditProfile from "../pages/EditProfile";
import EditLinkTree from "../pages/EditLinkTree";
import LinkIndex from '../pages/LinkIndex'
import Home from '../pages/Home'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <GuestOnlyRoute path={RouteName.register} component={Signup} />
          <GuestOnlyRoute path={RouteName.login} component={Login} />
          <GuestOnlyRoute path={RouteName.forgetPassword} component={ForgotPassword} />
          <UserRoute exact path={RouteName.dashboard} component={Dashboard} />
          <UserRoute exact path={RouteName.editProfile} component={EditProfile} />
          <UserRoute exact path={RouteName.editLinkTree} component={EditLinkTree} />
          <Route exact path={RouteName.home} component={Home} />
          <Route path={RouteName.linkIndex} component={LinkIndex} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
