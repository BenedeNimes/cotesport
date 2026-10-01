import { handle } from "./api";

export default {
  fetch: (request: Request) => handle(request),
};
