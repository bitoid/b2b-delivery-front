"use client";

import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ClientOrderType } from "@/types/orders";
import { getUniques } from "@/lib/utils";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useParams, useServerInsertedHTML } from "next/navigation";
import queryString from "query-string";
import { SortOrder, TableRowSelection } from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import { EditFilled } from "@ant-design/icons";
import BlackScreen from "./BlackScreen";
import EditOrder from "./EditOrder";

interface CommentProps {
  text: string;
}
const Comment: React.FC<CommentProps> = ({ text }) => {
  const [isComment, setIsComment] = useState(false);

  return (
    <span
      className=" px-3 py-5 text-sm text-gray-500 cursor-pointer min-w-[120px] relative"
      onMouseOver={() => setIsComment(true)}
      onTouchStart={() => setIsComment(true)}
      onMouseLeave={() => setIsComment(false)}
    >
      {isComment && text ? (
        <span className="bg-white absolute break-words w-[350px] p-2 rounded-[5px] z-10 shadow-2xl">
          {text}
        </span>
      ) : (
        <span>{text.slice(0, 10)}...</span>
      )}
    </span>
  );
};

const OrderTable: React.FC<{
  data: ClientOrderType[];
  searchParams: any;
  filteredData: ClientOrderType[];
}> = ({ data, searchParams, filteredData }) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);
  const router = useRouter();

  //improve performance
  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  const columns: ColumnsType<ClientOrderType> = [
    {
      title: "ქალაქი",
      dataIndex: "town",
      filters: getUniques(data, "town"),
      filterMode: "tree",
      filterSearch: true,

      defaultFilteredValue: searchParams.town
        ? typeof searchParams.town == "object"
          ? [...searchParams.town]
          : [searchParams.town]
        : null,
      onFilter: (value, record) => record.town.includes(value as string),
      width: "15%",
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "fullName",
      filters: getUniques(data, "fullName"),
      filterMode: "tree",
      filterSearch: true,
      defaultFilteredValue: searchParams.fullName
        ? typeof searchParams.fullName == "object"
          ? [...searchParams.fullName]
          : [searchParams.fullName]
        : null,
      onFilter: (value, record) => record.fullName.includes(value as string),
      width: "15%",
    },
    {
      title: "მისამართი",
      dataIndex: "address",
      filters: getUniques(data, "address"),
      filterMode: "menu",
      filterSearch: true,
      defaultFilteredValue: searchParams.address
        ? typeof searchParams.address == "object"
          ? [...searchParams.address]
          : [searchParams.address]
        : null,
      onFilter: (value, record) => record.address.includes(value as string),
      width: "15%",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone",
      filters: getUniques(data, "phone"),
      filterMode: "tree",
      filterSearch: true,
      defaultFilteredValue: searchParams.phone
        ? typeof searchParams.phone == "object"
          ? [...searchParams.phone]
          : [searchParams.phone]
        : null,
      onFilter: (value, record) => record.phone.includes(value as string),
      width: "15%",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "15%",
      render: (text: string) => <Comment text={text} />,
    },
    {
      title: "ფასი",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      defaultSortOrder:
        searchParams.field == "price" ? searchParams.order : null,
      defaultFilteredValue: searchParams.price
        ? typeof searchParams.price == "object"
          ? [...searchParams.price]
          : [searchParams.price]
        : null,
      width: "10%",
      filters: [
        { text: "0-100", value: "0-100" },
        { text: "101-200", value: "101-200" },
        // Add more ranges as needed...
      ],
      onFilter: (value, record) => {
        const [min, max] = value.toString().split("-").map(Number);
        return record.price >= min && record.price <= max;
      },
    },
    {
      title: "საკურიერო",
      dataIndex: "courierPrice",
      sorter: (a, b) => a.price - b.price,
      width: "15%",
    },

    {
      title: "",
      dataIndex: "edit",
      width: "7%",
      render: (_text: string, record: ClientOrderType) => (
        <Button
          type="link"
          onClick={() => handleEditClick(record)}
          icon={<EditFilled />}
        >
          {" "}
        </Button>
      ),
    },
  ];
  const [editInfo, setEditInfo] = useState<ClientOrderType>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleEditClick = (record: ClientOrderType) => {
    setEditInfo(record);
    setIsEdit(true);
  };

  const onChange: TableProps<ClientOrderType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);

    const filteredSorter: Record<string, SortOrder | undefined> = {};
    const filteredFilters: Record<string, (string | number | boolean)[]> = {};

    // Filtering out null values from sorter
    Object.keys(sorter).forEach((key) => {
      if (sorter[key as keyof typeof sorter] !== null) {
        filteredSorter[key] = sorter[key as keyof typeof sorter];
      }
    });

    // Filtering out null values from filters
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] !== null) {
        filteredFilters[key] = filters[key as keyof typeof filters] as (
          | string
          | number
          | boolean
        )[];
      }
    });

    const query: any = {
      ...pagination,
      ...filteredSorter,
      ...filteredFilters,
    };

    if (query.hasOwnProperty("column")) {
      delete query["column"];
    }
    if (!query["order"]) {
      delete query["field"];
    }
    console.log(query);
    localStorage.setItem("query", queryString.stringify(query));
    router.push("orders?" + queryString.stringify(query));
  };

//   useEffect(() => {
//     let query = localStorage.getItem("query");
//     if (query) {
//       router.push(`/orders?${query}`);
//       searchParams=queryString.parse(query)
//     } else {
//       router.push(`/orders?current=1$pageSize=10`);
//     }
//   }, []);



  //selection
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onSelectChange = (selectedRowIds: React.Key[]) => {
    console.log("Selected Row Keys:", selectedRowIds); // This will contain the 'id's of the selected rows
    setSelectedRowKeys(selectedRowIds);
  };

  const rowSelection: TableRowSelection<ClientOrderType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: ClientOrderType) => ({
      id: String(record.id),
    }),
    selections: [
      {
        key: "delete",
        text: "მონიშნული შეკვეთების წაშლა",
        onSelect: () => {},
      },
      {
        key: "send",
        text: "მონიშნული შეკვეთების ადრესატებისთვის მესიჯების გაგზავნა",
        onSelect: () => {
          console.log(selectedRowKeys);
        },
      },
    ],
  };

  return (
    <StyleProvider cache={cache}>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        scroll={{ y: 600, x: 1000 }}
        className="custom-scroll "
        sticky={true}
        rowSelection={rowSelection}
        rowKey={(record: ClientOrderType) => record.id}
        pagination={{ pageSize: 10 }}
      />
      {isEdit && editInfo && (
        <>
          <BlackScreen setIsBlackScreen={setIsEdit} isBlackScreen={isEdit} />
          <EditOrder order={editInfo} />
        </>
      )}
    </StyleProvider>
  );
};

export default OrderTable;
