import { v4 as uuidv4 } from "uuid";
import csvToArr from "./csvToArr";

const operations = [
  {
    id: uuidv4(),
    operation: "X + 10",
  },
  {
    id: uuidv4(),
    operation: "X - 10",
  },
  {
    id: uuidv4(),
    operation: "X * 5",
  },
  {
    id: uuidv4(),
    operation: "X / 5",
  },
];
export default async function addCsvToDatabase(file) {
  const saveKey = uuidv4();
  const dataArray = csvToArr(file, ",");
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/addTable`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        saveKey,
        operations,
        dataArray,
      }),
    }
  );
  if (request.status === 201) {
    const data = await request.json();
    return data;
  } else {
    return {};
  }
}
