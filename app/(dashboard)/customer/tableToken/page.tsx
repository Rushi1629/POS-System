import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    tableToken: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { tableToken } = await params;

  redirect(`/customer?tableToken=${encodeURIComponent(tableToken)}`);
}
