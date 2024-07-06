import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TeamNew from "@/components/Team/TeamNew";

export const metadata: Metadata = {
  title: "Team New | NailsAdmin Template",
  description: "This is Team New page for NailsAdmin Template",
};

const TeamNewPage = () => {
  return (
    <DefaultLayout>
      <TeamNew />
    </DefaultLayout>
  );
};

export default TeamNewPage;
