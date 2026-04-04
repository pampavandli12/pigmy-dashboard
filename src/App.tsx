import { Route, Routes } from "react-router-dom";
import Main from "./views/Main";
import Signin from "./views/Signin";
import Dashboard from "./views/Dashboard";
import Agents from "./views/Agents";
import AgentView from "./views/AgentView";
import AccountsView from "./views/AccountsView";
import { ProtectedRoute } from "./ProtectedRoute";
import CreateAgent from "./views/CreateAgent";
import UpdateAgents from "./views/UpdateAgents";
import Transactions from "./views/Transactions";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/signin" element={<Signin />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Main />}>
          <Route index element={<Dashboard />} />

          <Route path="agents" element={<AgentView />}>
            <Route index element={<Agents />} />
            <Route path="addAgent" element={<CreateAgent />} />
            <Route path="editAgent/:agentCode" element={<UpdateAgents />} />
            <Route path="transactions/:agentCode" element={<Transactions />} />
          </Route>

          <Route path="accounts" element={<AccountsView />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
