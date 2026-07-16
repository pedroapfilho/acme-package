import { loader } from "fumadocs-core/source";

import { docs } from "@/.source/server";

const source = loader({
  baseUrl: "/",
  source: docs.toFumadocsSource(),
});

export { source };
