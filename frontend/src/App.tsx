import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <h1>Project</h1>
      <div>
        <Button onClick={() => console.log("clicked")}>shadcn button</Button>
      </div>
    </>
  );
}

export default App;
