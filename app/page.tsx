import { Layout } from "@/components/layout/layout";
import { NewHabitForm } from "@/components/new-habit-form/NewHabitForm";

export default function Home() {
  return (
    <Layout>
      <div className="">
        <NewHabitForm />
      </div>
    </Layout>
  );
}
