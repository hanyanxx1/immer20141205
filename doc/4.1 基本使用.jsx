import { produce } from "./immer";

const App = () => {
  let baseState = {
    ids: [1],
    pos: {
      x: 1,
      y: 1,
    },
  };

  let nextState = produce(baseState, (draft) => {
    const temp = draft;
    const ids = temp.ids;
    ids.push(2);

    const pos = temp.pos;
    pos.y = 2;
    pos.z = 3;
  });
  console.log(baseState.ids === nextState.ids); //false
  console.log(baseState.pos === nextState.pos); //true

  return <>App</>;
};

export default App;
