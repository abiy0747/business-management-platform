import AboutClient from "./AboutClient";
import { getStoreData } from "@/lib/catalog-data";

export default async function AboutPage() {
  const store = await getStoreData();

  return <AboutClient store={store} />;
}