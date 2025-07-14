import { ReactFlowProvider } from "reactflow";
import { AutomationBuilder } from "./components/AutomationBuilder";
import "reactflow/dist/style.css";
import "./App.css";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <ReactFlowProvider>
      <div className="h-screen bg-gray-50">
        <AutomationBuilder />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </ReactFlowProvider>
  );
}

export default App;
