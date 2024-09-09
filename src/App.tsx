import formData from "./state/formData";
import { StateMachineProvider, createStore } from "little-state-machine";
import { BuilderPage } from "./components/BuilderPage";

createStore(
  {
    formData,
  },
  {
    storageType:
      typeof window !== "undefined" ? window.localStorage : undefined,
  }
);

function App() {
  return (
    <StateMachineProvider>
      <BuilderPage showBuilder={true} isStatic={true} />
    </StateMachineProvider>
  );
}

export default App;
