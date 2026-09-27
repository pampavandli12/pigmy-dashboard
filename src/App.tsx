import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoadingComponent from './components/LoadingComponent';

// Route-level code-splitting: each view ships in its own chunk and loads on demand.
const Main = lazy(() => import('./views/Main'));
const Signin = lazy(() => import('./views/Signin'));
const Dashboard = lazy(() => import('./views/Dashboard'));
const Agents = lazy(() => import('./views/Agents'));
const AgentView = lazy(() => import('./views/AgentView'));
const AccountsView = lazy(() => import('./views/AccountsView'));
const CreateAgent = lazy(() => import('./views/CreateAgent'));
const UpdateAgents = lazy(() => import('./views/UpdateAgents'));
const Transactions = lazy(() => import('./views/Transactions'));
const Deposits = lazy(() => import('./views/Deposits'));
const Reports = lazy(() => import('./views/Reports'));
const NotFound = lazy(() => import('./views/NotFound'));

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {/* Public route */}
        <Route path='/signin' element={<Signin />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Main />}>
            <Route index element={<Dashboard />} />

            <Route path='agents' element={<AgentView />}>
              <Route index element={<Agents />} />
              <Route path='addAgent' element={<CreateAgent />} />
              <Route path='editAgent/:agentCode' element={<UpdateAgents />} />
              <Route path='transactions/:agentCode' element={<Transactions />} />
              <Route path='deposits/:agentCode' element={<Deposits />} />
            </Route>

            <Route path='accounts' element={<AccountsView />} />
            <Route path='reports' element={<Reports />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
