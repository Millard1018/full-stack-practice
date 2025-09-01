import { useState } from "react";
import SignUpPage from "./src/pages/SignUpPage";
import UserTable from "./src/pages/UserTable";
import LogIn from "./src/pages/LogInPage";
import RoleChangePage from "./src/pages/RolePage";
import UserList from "./src/pages/UserList";
import DeleteUserPage from "./src/pages/DeleteUserPage";

//{!dashboard && <LogIn dashboard={setDashboard}/>}
        //{dashboard && <RoleChangePage/>}

function App() {
  const [dashboard, setDashboard] = useState(false);
  return (
    <>
      <div>
        <DeleteUserPage/>
      </div>
    </>
  )
}

export default App;
