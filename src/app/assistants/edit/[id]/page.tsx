import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TeamEdit from "@/components/Team/edit";

export const metadata: Metadata = {
  title: "Team edit | NailsAdmin Template",
  description: "This is Team edit page for NailsAdmin Template",
};

const TeamEditPage = () => {
  return (
    <DefaultLayout>
      <TeamEdit />
    </DefaultLayout>
  );
};

export default TeamEditPage;
