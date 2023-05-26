export default async function updateTableData(operation, index, saveKey) {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/updateTable/${saveKey}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        operation,
        index,
      }),
    }
  );
  if (request.status === 200) {
    const data = await request.json();
    return data;
  } else {
    return {};
  }
}
