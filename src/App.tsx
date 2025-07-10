import { ReactFlowProvider } from "reactflow";
import { AutomationBuilder } from "./components/AutomationBuilder";
import "reactflow/dist/style.css";
import "./App.css";

function App() {
  return (
    <ReactFlowProvider>
      <div className="h-screen bg-gray-50">
        <AutomationBuilder />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
