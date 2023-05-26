import Operation from "@/components/Operation";
import deleteTable from "@/helpers/deleteTable";
import getDataBySaveKey from "@/helpers/getDataBySaveKey";
import updateTableData from "@/helpers/updateTableData";
import updateTableTransformation from "@/helpers/updateTableTransformations";
import Link from "next/link";
import React, { useState } from "react";

export default function details({ data }) {
  const [tableData, setTableData] = useState(JSON.parse(data?.dataArray));
  const [cellDragActive, setCellDragActive] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [newTransformation, setNewTransformation] = useState("");
  const [transformations, setTransformations] = useState(data?.operations);

  const handleCellDrag = function (e, index) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setCellDragActive(index);
    } else if (e.type === "dragleave") {
      setCellDragActive(null);
    }
  };
  const handleCellDrop = function (index) {
    handleOperation(index);
    setDraggedItem(null);
  };

  const handleOperation = async function (index) {
    const serverData = await updateTableData(
      draggedItem?.operation,
      index,
      data?.saveKey
    );
    setTableData(JSON.parse(serverData));
    setCellDragActive(null);
    setDraggedItem(null);
  };

  const addNewtransformation = () => {
    if (newTransformation) {
      updateTableTransformation(
        transformations,
        newTransformation,
        data?.saveKey
      ).then((res) => {
        if (res?.operations) {
          setTransformations(res.operations);
          setNewTransformation("");
        }
      });
    }
  };

  const handleDelete = () => {
    deleteTable(data?.saveKey).then((res) => {
      if (res) {
        window.location.href = "/";
      }
    });
  };

  const deleteTransformation = (itemId) => {
    const indexofItem = transformations.findIndex((item) => item.id === itemId);
    if (indexofItem > -1) {
      transformations.splice(indexofItem, 1);
      updateTableTransformation(transformations, "", data?.saveKey).then(
        (res) => {
          if (res?.operations) {
            setTransformations(res.operations);
          }
        }
      );
    }
  };

  if (!tableData) {
    return (
      <div className="flex flex-col items-center justify-center w-screen h-screen space-y-3">
        <h1 className="text-3xl">Invalid Save Key</h1>
        <Link className="underline" href="/">
          Go to homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full p-12 overflow-x-auto">
      <div className="flex mb-12 space-x-3">
        <p>Use this to retrieve your data later:</p>
        <p className="text-pink-400 underline">{data?.saveKey}</p>
      </div>
      <table className="table w-2/3 mx-auto">
        <thead className="text-xs text-gray-700 uppercase border-b">
          <tr>
            {tableData.length > 0 &&
              Object.keys(tableData[0]).map((item, index) => (
                <th scope="col" className="py-3 text-left" key={index}>
                  {item}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData.map((item, tableIndex) => (
              <tr className="border-b" key={tableIndex}>
                {Object.values(item).map((item, itemIndex) =>
                  Object.keys(tableData[0])[itemIndex] === "Amount" ? (
                    <td
                      className={
                        cellDragActive === tableIndex ? "bg-gray-700" : ""
                      }
                      onDragEnter={(e) => handleCellDrag(e, tableIndex)}
                      onDragLeave={(e) => handleCellDrag(e, tableIndex)}
                      onDragOver={(e) => handleCellDrag(e, tableIndex)}
                      onDrop={() => handleCellDrop(tableIndex)}
                      key={itemIndex}
                    >
                      {parseFloat(item)?.toFixed(2)}
                    </td>
                  ) : (
                    <td key={itemIndex}>{item}</td>
                  )
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-end w-10/12 my-3">
        <button
          onClick={handleDelete}
          className="relative self-end text-white min-w-max btn btn-warning"
        >
          Delete Table
        </button>
      </div>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex my-4 space-x-4">
          {transformations?.map((item) => (
            <Operation
              item={item}
              setDraggedItem={setDraggedItem}
              key={item.id}
              deleteTransformation={deleteTransformation}
            />
          ))}
        </div>
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">Add Operation</span>
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addNewtransformation();
            }}
            className="flex space-x-2"
          >
            <input
              value={newTransformation}
              onChange={(e) => {
                setNewTransformation(e.target.value);
              }}
              type="text"
              placeholder="Mathematical operation"
              className="w-full max-w-xs input input-bordered"
            />
            <button className="btn btn-secondary">Add</button>
          </form>
        </div>
        <p className="my-3 text-xs text-pink-400">
          *Example: (X * 2)/3 Where X will be replaced by the value of the cell
        </p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const saveKey = context.query.saveKey;
  const data = await getDataBySaveKey(saveKey);
  return {
    props: {
      data,
    },
  };
}
