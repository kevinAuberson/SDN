import { prompt } from "./deps.ts";
import { set } from "./credentials.ts";

const { Input, Secret } = prompt;

const username = await Input.prompt({
  message: "Username",
});

const password = await Secret.prompt({
  message: "Password",
});

set({ username, password });
