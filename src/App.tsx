import { Route, Routes } from "react-router";
import "./App.css";
import Main from "./views/Main";
import Signin from "./views/Signin";
import Dashboard from "./views/Dashboard";
import Agents from "./views/Agents";
import AgentView from "./views/AgentView";
import AddAgent from "./views/AddAgent";
import AccountsView from "./views/AccountsView";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />
          <Route path="/agents" element={<AgentView />}>
            <Route index element={<Agents />} />
            <Route path="addAgent" element={<AddAgent />} />
          </Route>
          <Route path="accounts" element={<AccountsView />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
