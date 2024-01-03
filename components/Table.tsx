"use client";

import React, { createContext, useEffect, useState } from "react";
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
import { getUniques, getDefaultFilter, getColorForStatus } from "@/lib/utils";
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
import { ClearOutlined } from "@ant-design/icons";
import { Session } from "next-auth";
import { UserType } from "@/types/user";
import { PlusIcon } from "@heroicons/react/20/solid";
import AddOrder from "./AddOrder";

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
        <span>{text.slice(0, 6)}...</span>
      )}
    </span>
  );
};

interface OrdersContextProps {
  orders: ClientOrderType[];
  user: UserType | undefined;
  setOrders: React.Dispatch<React.SetStateAction<ClientOrderType[]>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialContext: OrdersContextProps = {
  orders: [],
  user: undefined,
  setIsEdit: () => {},
  setOrders: () => {},
};

export const TableContext = createContext<OrdersContextProps>(initialContext);

const OrderTable: React.FC<{
  data: ClientOrderType[];
  searchParams: any;
  user: UserType | undefined;
}> = ({ data, searchParams, user }) => {
  let storedQuery = null;
  const router = useRouter();
  const [orders, setOrders] = useState<ClientOrderType[]>(data);
  const [editInfo, setEditInfo] = useState<ClientOrderType>();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams["item_price"]?.split("to")[0]
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams["item_price"]?.split("to")[1]
  );
  const [query, setQuery] = useState(
    storedQuery
      ? queryString.parse(storedQuery, { arrayFormat: "comma" })
      : searchParams
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] =
    useState<Record<string, FilterValue | null>>();
  const [sortedInfo, setSortedInfo] = useState<SorterResult<any>>();

  useEffect(() => {
    let storedQuery = localStorage.getItem("query");
    setFilteredInfo(
      window.localStorage.getItem("filters")
        ? JSON.parse(window.localStorage.getItem("filters") || "")
        : {}
    );
    setSortedInfo(
      window.localStorage.getItem("sorteds")
        ? JSON.parse(window.localStorage.getItem("sorteds") || "")
        : {}
    );
    if (query["item_price"]?.split("to")[0])
      setMinPrice(query["item_price"]?.split("to")[0]);

    if (query["item_price"]?.split("to")[1])
      setMaxPrice(query["item_price"]?.split("to")[1]);

    if (!searchParams["current"]) {
      router.push("?current=1&pageSize=10");
    }
    if (storedQuery) {
      router.push(`/orders?${storedQuery}`);
      setQuery(queryString.parse(storedQuery, { arrayFormat: "comma" }));
    }
  }, []);

  const parsedCurrent =
    storedQuery &&
    queryString.parse(storedQuery, { arrayFormat: "comma" }).current;
  const defaultCurrent =
    parsedCurrent !== null ? parseInt(parsedCurrent as string) : 1;

  //optimezed antd for nextjs
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

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
      dataIndex: "city",
      filters: getUniques(data, "city"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.city || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "city"),
      onFilter: (value, record) => record.city.includes(value as string),
      width: "9%",
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "addressee_full_name",
      filters: getUniques(data, "addressee_full_name"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.addressee_full_name || null,
      defaultFilteredValue: getDefaultFilter(
        storedQuery,
        "addressee_full_name"
      ),
      onFilter: (value, record) =>
        record.addressee_full_name == (value as string),
      width: "15%",
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
      width: "12%",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone_number",
      filters: getUniques(data, "phone_number"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.phone_number || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "phone_number"),
      onFilter: (value, record) =>
        record.phone_number.includes(value as string),
      width: "10%",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "10%",
      filteredValue: filteredInfo?.comment || null,
      render: (text: string) => <Comment text={text} />,
    },
    {
      title: "სტატუსი",
      dataIndex: "status",
      width: "10%",
      filters: [
        { text: "სტატუსის გარეშე", value: "DF" },
        { text: "ჩაბარებულია", value: "GR" },
        { text: "ჩაბარების პროცესშია", value: "YL" },
        { text: "ვერ ჩაბარდა", value: "RD" },
        { text: "დაბრუნებულია", value: "BK" },
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
                borderRadius: 100,
              },
            },
          }}
        >
          <Select
            value={record.status}
            className={`w-[120px]`}
            dropdownStyle={{ width: "190px" }}
            onChange={(value) => handleStatusChange(record.id, value)}
            options={[
              { label: "სტატუსის გარეშე", value: "DF" },
              { label: "ჩაბარებულია", value: "GR" },
              { label: "ჩაბარების პროცესშია", value: "YL" },
              { label: "ვერ ჩაბარდა", value: "RD" },
              { label: "დაბრუნებულია", value: "BK" },
            ]}
          />
        </ConfigProvider>
      ),
    },
    {
      title: "ფასი",
      dataIndex: "item_price",
      sorter: (a, b) => +a.item_price - +b.item_price,
      sortOrder: sortedInfo?.field === "item_price" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "item_price"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "item_price"),
      width: "8%",
      filteredValue: filteredInfo?.item_price || null,
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
        const item_price = +record.item_price;

        if (
          searchParams["item_price"]?.split("to")[0] &&
          searchParams["item_price"]?.split("to")[1]
        ) {
          return (
            item_price >= +searchParams["item_price"]?.split("to")[0] &&
            item_price <= +searchParams["item_price"]?.split("to")[1]
          );
        }

        return true;
      },
    },
    {
      title: "საკურიერო",
      dataIndex: "courier_fee",
      sorter: (a, b) => a.courier_fee - b.courier_fee,
      filteredValue: filteredInfo?.courier_fee || null,
      sortOrder: sortedInfo?.field === "courier_fee" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "courier_fee"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      width: "10%",
    },
    {
      title: "თარიღი",
      dataIndex: "created_at",
      filters: getUniques(data, "created_at"),
      filterMode: "tree",
      filterSearch: true,
      filteredValue: filteredInfo?.created_at || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "created_at"),
      onFilter: (value, record) => record.created_at.includes(value as string),
      width: "9%",
      render: (text: string) => <>{text.split("T")[0].replaceAll("-", "/")}</>,
    },
    {
      title: () => (
        <ClearOutlined
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
        />
      ),
      dataIndex: "edit",
      width: "4%",
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
        onSelect: () => {
          console.log(selectedRowKeys);
          try {
            selectedRowKeys.forEach(async (id) => {
              const response = await fetch(
                `${process.env.API_URL}/orders/${id}`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${user?.token}`,
                  },
                }
              );
            });

            setOrders((prevOrders) =>
              prevOrders.filter((order) => !selectedRowKeys.includes(order.id))
            );
          } catch (error) {
            console.error("Error:", error);
          }
        },
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

  //event handlers
  const handleStatusChange = async (key: number, value: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === key ? { ...order, status: value } : order
      )
    );

    try {
      const response = await fetch(`${process.env.API_URL}/orders/${key}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
        body: JSON.stringify({ status: value }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      sorter as SorterResult<{ item_price: number; courierPrice: number }>
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
    if (query["item_price"]) {
      if (query["item_price"].length == 2) {
        query[
          "item_price"
        ] = `${query["item_price"][0]}to${query["item_price"][1]}`;
      } else {
        query["item_price"] = `${query["item_price"][0].split("to")[0]}to${
          query["item_price"][0].split("to")[1]
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

  function onSelectChange(selectedRowIds: React.Key[]) {
    setSelectedRowKeys(selectedRowIds);
  }

  return (
    <StyleProvider cache={cache}>
      <Table
        columns={columns}
        dataSource={orders}
        onChange={onChange}
        scroll={{ y: "50vh", x: 1400 }}
        className="custom-scroll "
        sticky={true}
        rowSelection={
          user?.user_data.user_type != "client" ? rowSelection : undefined
        }
        rowKey={(record: ClientOrderType) => record.id}
        pagination={{ pageSize: 10, current: defaultCurrent }}
      />
      {isEdit && editInfo && (
        <TableContext.Provider value={{ orders, setOrders, user, setIsEdit }}>
          <BlackScreen setIsBlackScreen={setIsEdit} isBlackScreen={isEdit} />
          <EditOrder order={editInfo} />
        </TableContext.Provider>
      )}

      <button
        onClick={() => setIsAdd(true)}
        className="mt-[-40px] flex items-center bg-gray-200 py-1 px-2 rounded-[20px] hover:opacity-70 pointer relative z-5"
      >
        დამატება
        <PlusIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {isAdd && (
        <>
          <AddOrder
            token={user?.token}
            setOrders={setOrders}
            orders={orders}
            setIsAdd={setIsAdd}
          />{" "}
          <BlackScreen isBlackScreen={isAdd} setIsBlackScreen={setIsAdd} />
        </>
      )}
    </StyleProvider>
  );
};

export default OrderTable;
