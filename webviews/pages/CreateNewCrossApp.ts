import App from "../components/CreateNewCrossApp.svelte";

const app = new App({
  target: document.body,
});

export default app;


// "watch": "concurrently \"rollup -c -w\" \"tsc -watch -p ./\"",