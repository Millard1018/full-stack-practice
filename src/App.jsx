import { useState } from "react";
//import Counter from './useState-Integer.jsx'
//import WelcomeName from './useState-String.jsx'
//import LikeButton from './useState-Boolean.jsx'
//import Reaction from './useState-Reaction.jsx';
//import ReactionButtons from './useState-reactionCounter.jsx'
//import NameInput from './useReducer-input.jsx'
//import TextInput from './TextInput.jsx';
//import FormComponent from './FormComponent.jsx'
//import MouseTracker from './useEffect-mouseMovement.jsx'
//import PokemonList from './useEffect-PokemonAPI.jsx'
//import PokeSearch from './useEffect-Search.jsx'
//import FormBackend from "./formWithBackend";
import SignUpPage from "./userSignupPage/SignUpPage";
import UserTable from "./userSignupPage/UserTable";
import LogIn from "./userSignupPage/LogInPage";
import RoleChangePage from "./userSignupPage/rolePage";
import UserList from "./userSignupPage/UserList";
import DeleteUserPage from "./userSignupPage/DeleteUserPage";

//{!dashboard && <LogIn dashboard={setDashboard}/>}
        //{dashboard && <RoleChangePage/>}

function App() {
  const [dashboard, setDashboard] = useState(false);
  return (
    <>
      <div>
        {!dashboard && <LogIn dashboard={setDashboard}/>}
        {dashboard && <RoleChangePage/>}
      </div>
    </>
  )
}

export default App;
