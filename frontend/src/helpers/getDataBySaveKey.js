export default async function getDataBySaveKey(saveKey) {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/getTableBySaveKey/${saveKey}`
  );

  if (request.status === 200) {
    const data = await request.json();
    return data;
  } else {
    return {};
  }
}
