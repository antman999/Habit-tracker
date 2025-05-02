import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-col gap-[32px] items-center sm:items-start p-8 pb-20 sm:p-20">
        <Button>HI</Button>
      </div>
    </Layout>
  );
}
