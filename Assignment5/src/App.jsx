import "./App.css";
import ExternalCss from "./components/ExternalCss";
import {InlineCss}  from "./components/InlineCss";
import { ModularCss } from "./components/ModularCss";

function App() {
  return (
    <>
      <ExternalCss/>
      <InlineCss/>
      <ModularCss/>
    </>
  );
}

export default App;
