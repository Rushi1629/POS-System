import { redirect } from "next/navigation";

type Props = {
  params: {
    tableToken: string;
  };
};

export default function TableTokenRedirect({ params }: Props) {
  const { tableToken } = params;

  // Redirect to the main customer page and pass the token as a query param
  redirect(`/customer?tableToken=${encodeURIComponent(tableToken)}`);
}
