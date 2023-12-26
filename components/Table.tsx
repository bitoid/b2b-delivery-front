"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  Select,
  Space,
  Spin,
  Table,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ClientOrderType } from "@/types/orders";
import { getUniques, getDefaultFilter } from "@/lib/utils";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
import queryString from "query-string";
import {
  FilterValue,
  SortOrder,
  SorterResult,
  TableRowSelection,
} from "antd/es/table/interface";
import { useRouter } from "next/navigation";
import { EditFilled } from "@ant-design/icons";
import BlackScreen from "./BlackScreen";
import EditOrder from "./EditOrder";
import { RestTwoTone } from "@ant-design/icons";
interface CommentProps {
  text: string;
}
const Comment: React.FC<CommentProps> = ({ text }) => {
  const [isComment, setIsComment] = useState(false);

  return (
    <span
      className=" px-3 text-sm text-gray-500 cursor-pointer min-w-[120px] relative"
      onMouseOver={() => setIsComment(true)}
      onTouchStart={() => setIsComment(true)}
      onMouseOut={() => setIsComment(false)}
    >
      {isComment && text ? (
        <span className="bg-white absolute break-words w-[350px] p-2 rounded-[5px] z-10 shadow-2xl">
          {text}
        </span>
      ) : (
        <span>{text.slice(0, 7)}...</span>
      )}
    </span>
  );
};
const OrderTable: React.FC<{
  data: ClientOrderType[];
  searchParams: any;
  filteredData: ClientOrderType[];
}> = ({ data, searchParams }) => {
  let storedQuery =
    typeof window !== "undefined" ? window.localStorage.getItem("query") : null;

  const [isClient, setIsClient] = useState(false);
  const [editInfo, setEditInfo] = useState<ClientOrderType>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams["price"]?.split("to")[0]
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams["price"]?.split("to")[1]
  );
  const [query, setQuery] = useState(
    storedQuery
      ? queryString.parse(storedQuery, { arrayFormat: "comma" })
      : searchParams
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  let storedFilters =
    typeof window !== "undefined"
      ? window.localStorage.getItem("filters")
      : null;

  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, FilterValue | null>
  >(storedFilters ? JSON.parse(storedFilters) : {});

  let storedSorteds =
    typeof window !== "undefined"
      ? window.localStorage.getItem("sorteds")
      : null;

  const [sortedInfo, setSortedInfo] = useState<SorterResult<any>>(
    storedSorteds ? JSON.parse(storedSorteds) : {}
  );

  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  const parsedCurrent =
    storedQuery &&
    queryString.parse(storedQuery, { arrayFormat: "comma" }).current;
  const defaultCurrent =
    parsedCurrent !== null ? parseInt(parsedCurrent as string) : 1;

  const router = useRouter();

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
  useEffect(() => {
    setIsClient(true);

    if (query["price"]?.split("to")[0])
      setMinPrice(query["price"]?.split("to")[0]);

    if (query["price"]?.split("to")[1])
      setMaxPrice(query["price"]?.split("to")[1]);

    if (!searchParams["current"]) {
      router.push("?current=1&pageSize=10");
    }
    if (storedQuery) {
      router.push(`/orders?${storedQuery}`);
      setQuery(queryString.parse(storedQuery, { arrayFormat: "comma" }));
    }
  }, []);
  const [orders, setOrders] = useState<ClientOrderType[]>(data);

  const handleStatusChange = (key: number, value: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === key ? { ...order, status: value } : order
      )
    );
  };
  const getColorForStatus = (status: string) => {
    switch (status) {
      case "todo":
        return "red";
      case "doing":
        return "orange";
      case "done":
        return "green";
      default:
        return "black";
    }
  };
  const columns: ColumnsType<ClientOrderType> = [
    {
      title: "ქალაქი",
      dataIndex: "town",
      filters: getUniques(data, "town"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.town || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "town"),
      onFilter: (value, record) => record.town.includes(value as string),
      width: "13%",
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "fullName",
      filters: getUniques(data, "fullName"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.fullName || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "fullName"),
      onFilter: (value, record) => record.fullName == (value as string),
      width: "19%",
    },
    {
      title: "მისამართი",
      dataIndex: "address",
      filters: getUniques(data, "address"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.address || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "address"),
      onFilter: (value, record) => record.address.includes(value as string),
      width: "17%",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone",
      filters: getUniques(data, "phone"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.phone || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "phone"),
      onFilter: (value, record) => record.phone.includes(value as string),
      width: "15%",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "14%",
      filteredValue: filteredInfo?.comment || null,
      render: (text: string) => <Comment text={text} />,
    },
    {
      title: "სტატუსი",
      dataIndex: "status",
      width: "10%",
      filters: [
        { text: "Todo", value: "todo" },
        { text: "Doing", value: "doing" },
        { text: "Done", value: "done" },
      ],
      filteredValue: filteredInfo?.status || null,
      onFilter: (value, record) => {
        return record.status === value;
      },
      filterMode: "tree",
      render: (text, record) => (
        <ConfigProvider
          theme={{
            components: {
              Select: {
                optionSelectedBg: getColorForStatus(record.status),
                optionSelectedColor: "white",
                selectorBg: getColorForStatus(record.status),
              },
            },
          }}
        >
          <Select
            value={record.status}
            className={`w-[80px]`}
            onChange={(value) => handleStatusChange(record.id, value)}
          >
            <Select.Option value="todo">Todo</Select.Option>
            <Select.Option value="doing">Doing</Select.Option>
            <Select.Option value="done">Done</Select.Option>
          </Select>
        </ConfigProvider>
      ),
    },
    {
      title: "ფასი",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      sortOrder: sortedInfo.field === "price" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "price"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "price"),
      width: "10%",
      filteredValue: filteredInfo?.price || null,
      filterDropdown: ({ setSelectedKeys, confirm }) => {
        return (
          <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
            <Input
              placeholder={"დან"}
              value={minPrice}
              type="number"
              onChange={(e) => {
                if (e.target.value == "") {
                  setMinPrice(undefined);
                } else {
                  setMinPrice(Number(e.target.value));
                }
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Input
              placeholder={"მდე"}
              value={maxPrice}
              type="number"
              onChange={(e) => {
                if (e.target.value == "") {
                  setMaxPrice(undefined);
                } else {
                  setMaxPrice(Number(e.target.value));
                }
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <Space>
              <Button
                type="link"
                onClick={() => {
                  setSelectedKeys([]);
                  confirm();
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                }}
                size="small"
                style={{ width: 90 }}
                disabled={minPrice == undefined && maxPrice == undefined}
              >
                Reset
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  if (minPrice && maxPrice) {
                    setSelectedKeys([minPrice as number, maxPrice as number]);
                  } else {
                    setSelectedKeys([]);
                  }

                  confirm();
                }}
                size="small"
                style={{ width: 90 }}
              >
                OK
              </Button>
            </Space>
          </div>
        );
      },
      onFilter: (value, record) => {
        const price = record.price as number;
        if (
          searchParams["price"]?.split("to")[0] &&
          searchParams["price"]?.split("to")[1]
        ) {
          return (
            price >= searchParams["price"]?.split("to")[0] &&
            price <= searchParams["price"]?.split("to")[1]
          );
        }

        return true;
      },
    },
    {
      title: "საკურიერო",
      dataIndex: "courierPrice",
      sorter: (a, b) => a.price - b.price,
      filteredValue: filteredInfo?.courierPrice || null,
      sortOrder: sortedInfo.field === "courierPrice" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "courierPrice"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      width: "15%",
    },

    {
      title: () => (
        <>
          <span
            className="text-[#3b82f6] cursor-pointer hover:opacity-60"
            onClick={() => {
              localStorage.removeItem("query");
              localStorage.removeItem("filters");
              localStorage.removeItem("sorteds");
              router.push("/orders?current=1&pageSize=10");
              setQuery(searchParams);
              setMinPrice(undefined);
              setMaxPrice(undefined);
              setFilteredInfo({});
              setSortedInfo({});
            }}
          >
            გასუფთავება
          </span>
          <RestTwoTone />
        </>
      ),
      dataIndex: "edit",
      width: "16%",
      render: (_text: string, record: ClientOrderType) => (
        <Button
          type="link"
          onClick={() => handleEditClick(record)}
          icon={<EditFilled />}
          className="ml-auto block"
        >
          {" "}
        </Button>
      ),
    },
  ];

  //functions
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
    // s", pagination, filters, sorter, extra);
    setFilteredInfo(filters);
    setSortedInfo(
      sorter as SorterResult<{ price: number; courierPrice: number }>
    );
    localStorage.setItem("filters", JSON.stringify(filters));
    localStorage.setItem("sorteds", JSON.stringify(sorter));
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
    if (query["price"]) {
      if (query["price"].length == 2) {
        query["price"] = `${query["price"][0]}to${query["price"][1]}`;
      } else {
        query["price"] = `${query["price"][0].split("to")[0]}to${
          query["price"][0].split("to")[1]
        }`;
      }
    }

    localStorage.setItem(
      "query",
      queryString.stringify(query, {
        arrayFormat: "comma",
      })
    );
    router.push(
      "orders?" +
        queryString.stringify(query, {
          arrayFormat: "comma",
        })
    );
  };

  //selection

  const onSelectChange = (selectedRowIds: React.Key[]) => {
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
          // edRowKeys);
        },
      },
    ],
  };

  return isClient ? (
    <StyleProvider cache={cache}>
      <Table
        columns={columns}
        dataSource={orders}
        onChange={onChange}
        scroll={{ y: "50vh", x: 1400 }}
        className="custom-scroll "
        sticky={true}
        rowSelection={rowSelection}
        rowKey={(record: ClientOrderType) => record.id}
        pagination={{ pageSize: 10, current: defaultCurrent }}
      />
      {isEdit && editInfo && (
        <>
          <BlackScreen setIsBlackScreen={setIsEdit} isBlackScreen={isEdit} />
          <EditOrder order={editInfo} />
        </>
      )}
    </StyleProvider>
  ) : //   <ConfigProvider
  //   theme={{
  //     components: {
  //       Spin: {
  //        dotSize: 100,
  //        colorPrimary: "#1677ff",
  //        colorBgContainer: "black"
  //       },
  //     },
  //   }}
  // >
  //   <Spin className="block m-auto"/>
  // </ConfigProvider>
  null;
};

export default OrderTable;
