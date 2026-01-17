import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "z9wsynas",
  dataset: "production",
  apiVersion: "2024-05-13",
  useCdn: false
});

async function test() {
  const article = await client.fetch('*[_type == "article"][0]');
  console.log("Structure d'un article:");
  console.log(JSON.stringify(article, null, 2));
}

test();
