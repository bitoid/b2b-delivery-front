"use client";

import React, { useEffect, useState } from "react";
import { Button, ConfigProvider, Input, Space, Spin, Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ClientOrderType } from "@/types/orders";
import { getUniques } from "@/lib/utils";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { useServerInsertedHTML } from "next/navigation";
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
  let storedQuery =
    typeof window !== "undefined" ? window.localStorage.getItem("query") : null;
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

  const getDefaultFilter = (storedQuery: string | null, key: string) => {
    const keyQuery = storedQuery
      ? queryString.parse(storedQuery, { arrayFormat: "comma" })[key]
      : null;
    const parsedKeyQuery = Array.isArray(keyQuery)
      ? keyQuery
      : keyQuery
      ? [keyQuery]
      : null;

    const defaultFilter =
      parsedKeyQuery && parsedKeyQuery.length > 0 ? parsedKeyQuery : null;

    return defaultFilter as any;
  };

  const [query, setQuery] = useState(
    storedQuery
      ? queryString.parse(storedQuery, { arrayFormat: "comma" })
      : searchParams
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    storedQuery = localStorage.getItem("query");
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
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams["price"]?.split("to")[0]
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams["price"]?.split("to")[1]
  );
  const columns: ColumnsType<ClientOrderType> = [
    {
      title: "ქალაქი",
      dataIndex: "town",
      filters: getUniques(data, "town"),
      filterMode: "tree",
      filterSearch: true,

      defaultFilteredValue: getDefaultFilter(storedQuery, "town"),
      onFilter: (value, record) => record.town.includes(value as string),
      width: "15%",
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "fullName",
      filters: getUniques(data, "fullName"),
      filterMode: "tree",
      filterSearch: true,

      defaultFilteredValue: getDefaultFilter(storedQuery, "fullName"),
      onFilter: (value, record) => record.fullName == (value as string),
      width: "17%",
    },
    {
      title: "მისამართი",
      dataIndex: "address",
      filters: getUniques(data, "address"),
      filterMode: "tree",
      filterSearch: true,
      defaultFilteredValue: getDefaultFilter(storedQuery, "address"),
      onFilter: (value, record) => record.address.includes(value as string),
      width: "15%",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone",
      filters: getUniques(data, "phone"),
      filterMode: "tree",
      filterSearch: true,
      defaultFilteredValue: getDefaultFilter(storedQuery, "phone"),
      onFilter: (value, record) => record.phone.includes(value as string),
      width: "15%",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "16%",
      render: (text: string) => <Comment text={text} />,
    },
    {
      title: "ფასი",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "price"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "price"),
      width: "10%",

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
    // s", pagination, filters, sorter, extra);

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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

  const parsedCurrent =
    storedQuery &&
    queryString.parse(storedQuery, { arrayFormat: "comma" }).current;
  const defaultCurrent =
    parsedCurrent !== null ? parseInt(parsedCurrent as string) : 1;

  return isClient ? (
    <StyleProvider cache={cache}>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        scroll={{ y: "50vh", x: 1150 }}
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
  ) : (
  //   <ConfigProvider
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
  null
  );
};

export default OrderTable;
