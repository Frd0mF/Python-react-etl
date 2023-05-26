import { useQuery } from "@tanstack/react-query";

export default async function deleteTable(saveKey) {
  const request = useQuery({
    queryFn: async () => {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/deleteTable/${saveKey}`,
        {
          method: "Delete",
        }
      );
      return request;
    },
  });
  if (request.status === 204) {
    return "success";
  } else {
    return {};
  }
}
