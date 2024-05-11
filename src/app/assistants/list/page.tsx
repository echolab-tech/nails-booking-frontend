import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TeamList from "@/components/Team/TeamList";

export const metadata: Metadata = {
  title: "Team List | NailsAdmin Template",
  description:
    "This is Team List page for NailsAdmin Template",
};

const TeamListPage = () => {
  return (
    <DefaultLayout>
      <TeamList />
    </DefaultLayout>
  );
};

export default TeamListPage;
