import * as React from "./libs/react";
import "./style.css";

export default function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
      <p>{count}</p>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
