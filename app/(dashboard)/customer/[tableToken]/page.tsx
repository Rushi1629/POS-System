import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    tableToken: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { tableToken } = await params;

  // Redirect to the main customer page and pass the token as a query param
  redirect(`/customer?tableToken=${encodeURIComponent(tableToken)}`);
}
