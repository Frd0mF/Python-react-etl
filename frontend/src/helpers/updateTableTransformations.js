import { v4 as uuidv4 } from "uuid";

export default async function updateTableTransformation(
  transformations,
  newTransformation,
  saveKey
) {
  let operations;
  if (newTransformation !== "") {
    operations = [
      ...transformations,
      { id: uuidv4(), operation: newTransformation },
    ];
  } else {
    operations = [...transformations];
  }
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/updateTableTransformations/${saveKey}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify({
        operations,
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
