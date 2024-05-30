"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  ConfigProvider,
  Input,
  Select,
  Space,
  Table,
  DatePicker,
  DatePickerProps,
  Typography,
  message,
  Modal,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import { ClientOrderType } from "@/types/order";
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
import { EditFilled, PhoneFilled, MessageFilled } from "@ant-design/icons";
// import BlackScreen from "./BlackScreen";
import EditOrder, { DeleteModal } from "./EditOrder";
import { ClearOutlined } from "@ant-design/icons";
import { UserInfoType, UserType } from "@/types/user";
import { PlusIcon } from "@heroicons/react/20/solid";
import AddOrder from "./AddOrder";
import { RangePickerProps } from "antd/es/date-picker";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import dayjs from "dayjs";
import Comment from "./Comment";
import Row from "./Row";
import { TableContext } from "@/context/tableContext";
import SearchParamsType from "@/types/searchParams";

const OrderTable: React.FC<{
  data: ClientOrderType[];
  filteredOrders: ClientOrderType[];
  searchParams: SearchParamsType;
  user: UserType | undefined;
  couriers: UserInfoType[];
  clients: UserInfoType[];
}> = ({ data, searchParams, user, filteredOrders, couriers, clients }) => {
  let storedQuery = null;
  const { RangePicker } = DatePicker;
  const { Text } = Typography;

  const [orders, setOrders] = useState<ClientOrderType[]>(filteredOrders || []);
  const [editInfo, setEditInfo] = useState<ClientOrderType>();
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isCouriers, setIsCouriers] = useState<boolean>(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams["item_price"]
      ? Number(searchParams["item_price"].split("to")[0])
      : undefined
  );

  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams["item_price"]
      ? Number(searchParams["item_price"].split("to")[1])
      : undefined
  );

  const [startDate, setStartDate] = useState<number | undefined>(
    searchParams["created_at"]
      ? Number(searchParams["created_at"]?.split("to")[0])
      : undefined
  );
  const [endDate, setEndDate] = useState<number | undefined>(
    searchParams["created_at"]
      ? Number(searchParams["created_at"]?.split("to")[1])
      : undefined
  );

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [filteredInfo, setFilteredInfo] =
    useState<Record<string, FilterValue | null>>();
  const [sortedInfo, setSortedInfo] = useState<SorterResult<ClientOrderType>>();
  const [defaultCurrent, setDefaultCurrent] = useState(1);

  const router = useRouter();

  useEffect(() => {
    storedQuery = localStorage.getItem("query");
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
    if (storedQuery) {
      setDefaultCurrent(
        Number(
          queryString.parse(storedQuery, { arrayFormat: "comma" })
            .current as unknown
        )
      );
    }

    const modifiedQuery: SearchParamsType = queryString.parse(
      storedQuery || "",
      {
        arrayFormat: "comma",
      }
    );
    if (modifiedQuery["item_price"]?.split("to")[0])
      setMinPrice(Number(modifiedQuery["item_price"]?.split("to")[0]));

    if (modifiedQuery["item_price"]?.split("to")[1])
      setMaxPrice(Number(modifiedQuery["item_price"]?.split("to")[1]));

    if (modifiedQuery["created_at"]?.split("to")[0])
      setStartDate(Number(modifiedQuery["created_at"]?.split("to")[0]));

    if (modifiedQuery["created_at"]?.split("to")[1])
      setEndDate(Number(modifiedQuery["created_at"]?.split("to")[1]));

    if (!searchParams["current"]) {
      router.push("?current=1&pageSize=10");
    }
    if (storedQuery) {
      router.push(`/orders?${storedQuery}`);
    }
  }, []);

  useEffect(() => {
    setOrders(filteredOrders || []);
  }, [searchParams]);

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
      key: "sort",
      width: "40px",
    },
    {
      title: "კოდი",
      dataIndex: "id",
      width: "80px",
    },
    {
      title: "კლიენტი",
      dataIndex: "client",
      width: "110px",
      filters: [
        ...getUniques([...data.filter((item) => item.client)], "client_name"),
        { text: "კლიენტის გარეშე", value: "-1" },
      ],
      render: (text: string, record: ClientOrderType) =>
        record.client_name || "კლიენტის გარეშე",
      filterSearch: true,
      filteredValue: filteredInfo?.client || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "client"),
    },
    {
      title: "კურიერი",
      dataIndex: "courier",

      width: "110px",
      filters: [
        ...(couriers?.map((item) => ({ text: item.name, value: item.id })) ||
          []),
        { text: "კურიერის გარეშე", value: "-1" },
      ],
      render: (text: string, record: ClientOrderType) =>
        couriers?.find((item) => item.id == record.courier)?.name ||
        "კურიერის გარეშე",
      filterSearch: true,
      filteredValue: filteredInfo?.courier || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "courier"),
    },
    {
      title: "ქალაქი",
      dataIndex: "city",
      width: "100px",
      filters: getUniques(data, "city"),

      filterSearch: true,
      filteredValue: filteredInfo?.city || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "city"),
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "addressee_full_name",
      width: "140px",
      filters: getUniques(data, "addressee_full_name"),
      filterSearch: true,
      filteredValue: filteredInfo?.addressee_full_name || null,
      defaultFilteredValue: getDefaultFilter(
        storedQuery,
        "addressee_full_name"
      ),
    },
    {
      title: "მისამართი",
      dataIndex: "address",
      filters: getUniques(data, "address"),
      filterSearch: true,
      filteredValue: filteredInfo?.address || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "address"),
      width: "140px",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone_number",
      render: (text) =>
        user?.user_data.user_type == "courier" ? (
          <>
            <details>
              <summary>{text}</summary>
              <div className="flex flex-col border-2 border-gray-200 p-1">
                <a className="text-black" href={`tel:${text}`}>
                  <PhoneFilled className="w-6 h-6" /> დარეკვა
                </a>
                <a
                  className="text-black border-t-2 border-gray-200 pt-2"
                  href={`sms:${text}?body=თქვენთან მოემართება კურიერი`}
                >
                  <MessageFilled className="w-6 h-6" />
                  მესიჯის გაგზავნა
                </a>
              </div>
            </details>
          </>
        ) : (
          <>{text}</>
        ),

      filters: getUniques(data, "phone_number"),
      filterSearch: true,
      filteredValue: filteredInfo?.phone_number || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "phone_number"),
      width: "140px",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "120px",
      filteredValue: filteredInfo?.comment || null,
      render: (text: string) => <Comment text={text} />,
    },

    {
      title: "სტატუსი",
      dataIndex:
        user?.user_data.user_type == "courier" ? "staged_status" : "status",
      width: "150px",
      filters: [
        { text: "სტატუსის გარეშე", value: "DF" },
        { text: "ჩაბარებულია", value: "GR" },
        { text: "ჩაბარების პროცესშია", value: "YL" },
        { text: "ვერ ჩაბარდა", value: "RD" },
        { text: "დაბრუნებულია", value: "BK" },
      ],
      filteredValue:
        user?.user_data.user_type == "courier"
          ? filteredInfo?.staged_status
          : filteredInfo?.status || null,

      render: (text, record) => (
        <div id="table-select">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  optionSelectedBg: getColorForStatus(
                    user?.user_data.user_type == "courier"
                      ? !record.status_approved
                        ? record.staged_status
                        : record.status
                      : record.status
                  ),

                  optionSelectedColor: "white",
                  selectorBg: getColorForStatus(
                    user?.user_data.user_type == "courier" &&
                      !record.status_approved
                      ? record.staged_status
                      : record.status
                  ),
                  borderRadius: 100,
                },
              },
            }}
          >
            <Select
              value={
                user?.user_data.user_type == "courier" &&
                !record.status_approved
                  ? record.staged_status
                  : record.status
              }
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
        </div>
      ),
    },
    {
      title: "ფასი",
      dataIndex: "item_price",
      width: "110px",
      sortOrder: sortedInfo?.field === "item_price" ? sortedInfo.order : null,
      sorter: true,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "item_price"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "item_price"),
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
    },
    {
      title: "საკურიერო",
      dataIndex: "courier_fee",
      sorter: true,
      filteredValue: filteredInfo?.courier_fee || null,
      width: "150px",
      sortOrder: sortedInfo?.field === "courier_fee" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "courier_fee"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
    },
    {
      title: "თარიღი",
      dataIndex: "created_at",
      sorter: (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      sortOrder: sortedInfo?.field === "created_at" ? sortedInfo.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "created_at"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      filteredValue: filteredInfo?.created_at || null,
      width: "120px",

      render: (text: string) => <>{text.split("T")[0].replaceAll("-", "/")}</>,
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div className="flex flex-col  p-2">
          <RangePicker
            format="YYYY-MM-DD"
            onChange={onDateChange}
            defaultValue={
              startDate && endDate
                ? [dayjs(startDate), dayjs(endDate)]
                : undefined
            }
          />

          <Button
            type="primary"
            className="w-full mt-2 block"
            onClick={() => {
              if (startDate && endDate) {
                setSelectedKeys([startDate as number, endDate as number]);
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
        </div>
      ),
    },
    {
      width: "40px",
      title: () => (
        <ClearOutlined
          onClick={() => {
            localStorage.removeItem("query");
            localStorage.removeItem("filters");
            localStorage.removeItem("sorteds");
            router.push("/orders?current=1&pageSize=10");
            setMinPrice(undefined);
            setMaxPrice(undefined);
            setFilteredInfo({});
            setSortedInfo({});
          }}
        />
      ),
      dataIndex: "edit",
      render: (_text: string, record: ClientOrderType) => (
        <Button
          type="link"
          onClick={() => handleEditClick(record)}
          icon={<EditFilled />}
          className="ml-[-15px]"
        >
          {" "}
        </Button>
      ),
    },
  ];

  if (user?.user_data.user_type == "courier") {
    columns.splice(3, 3);
  } else {
    columns.splice(0, 1);
  }

  if (user?.user_data.user_type == "client") {
    columns.splice(1, 2);
  }

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
          if (selectedRowKeys.length > 0) {
            setIsDelete(true);
          } else {
            message.warning("შეკვეთები არჩეული არ გაქვთ");
          }
        },
      },

      {
        key: "send",
        text: "მონიშნული შეკვეთების ადრესატებისთვის მესიჯების გაგზავნა",
        onSelect: async () => {
          try {
            if (selectedRowKeys.length == 0) {
              message.warning("შეკვეთები არჩეული არ გაქვთ");
              return;
            }
            message.config({ maxCount: 1 });
            message.loading("დაელოდეთ...");
            const response = await fetch(
              `${process.env.API_URL}/orders/send_bulk_sms/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${user?.token}`,
                },
                body: JSON.stringify({ order_ids: selectedRowKeys }),
              }
            );

            if (response.ok) {
              message.success("მესიჯი წარმატებით გაიგზავნა");
              setSelectedRowKeys([]);
            } else {
              message.error("მესიჯის გაგზავნა ვერ მოხერხდა");
            }
          } catch (err) {
            console.error(err);
          }
        },
      },
      {
        key: "print",
        text: "მონიშნული შეკვეთების დაპრინტვა",
        onSelect: () => {
          if (selectedRowKeys.length == 0) {
            message.warning("შეკვეთები არჩეული არ გაქვთ");
            return;
          }
          const printWindow = window.open("", "_blank");
          const columnNames = {
            id: "კოდი",
            address: "მისამართი",
            phone_number: "ტელეფონი",
            item_price: "შეკვეთის ფასი",
            courier_fee: "საკურიერო",
            client_name: "კლიენტი",
            comment: "კომენტარი",
          };

          // Get the selected rows from the data using the selected keys
          const selectedRows = orders.filter((row) =>
            selectedRowKeys.includes(row.id)
          );
          printWindow?.document.write("<table style='width:100%'>");

          // Write table headers
          printWindow?.document.write("<tr style=`border: 1px solid black`>");
          Object.values(columnNames).forEach((value) => {
            printWindow?.document.write(
              `<th style="border: 1px solid black">${value}</th>`
            );
          });
          printWindow?.document.write("</tr>");

          interface NewClientOrderType extends ClientOrderType {
            [key: string]: string | number | null | boolean;
          }
          // Write table rows
          selectedRows.forEach((record: ClientOrderType) => {
            printWindow?.document.write("<tr style=`border: 1px solid black`>");
            Object.keys(columnNames).forEach((key) => {
              printWindow?.document.write(
                `<td style="text-align: center; border: 1px solid black">${
                  (record as NewClientOrderType)[key]
                }</td>`
              );
            });
            printWindow?.document.write("</tr>");
          });

          printWindow?.document.write("</table>");

          printWindow?.document.write("</body></html>");
          printWindow?.document.close();
          printWindow?.print();
        },
      },

      {
        key: "add_courier",
        text: "მონიშნული შეკვეთების მიბმა კურიერისთვის",
        onSelect: () => setIsCouriers(true),
      },
    ],
  };

  if (user?.user_data.user_type != "admin") {
    if (Array.isArray(rowSelection.selections)) {
      rowSelection.selections.splice(0, 1);
      rowSelection.selections.splice(rowSelection.selections.length - 1, 1);
    }
  }

  //event handlers
  const handleStatusChange = async (key: number, value: string) => {
    if (user?.user_data.user_type === "client") {
      message.warning("სტატუსის შეცვლის უფლება არ გაქვთ");
      return;
    }
    try {
      const response = await fetch(`${process.env.API_URL}/orders/${key}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
        body: JSON.stringify(
          user?.user_data.user_type == "admin"
            ? { status: value }
            : { staged_status: value }
        ),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders?.map((order) =>
            order.id === key
              ? user?.user_data.user_type == "admin"
                ? { ...order, status: value }
                : { ...order, staged_status: value }
              : order
          )
        );
      }
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
    sorter
  ) => {
    setDefaultCurrent(pagination.current as number);
    setFilteredInfo(filters);
    setSortedInfo(sorter as SorterResult<ClientOrderType>);
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
    const query: SearchParamsType = {
      ...pagination,
      ...filteredSorter,
      ...filteredFilters,
    };
    if (Object.prototype.hasOwnProperty.call(query, "column")) {
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

    if (query["created_at"]) {
      const startDate = new Date(query["created_at"][0]);
      const formattedStartDate =
        startDate.getFullYear() +
        "-" +
        ("0" + (startDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startDate.getDate()).slice(-2);
      const endDate = new Date(query["created_at"][1]);
      const formattedEndDate =
        endDate.getFullYear() +
        "-" +
        ("0" + (endDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + endDate.getDate()).slice(-2);

      if (query["created_at"].length == 2) {
        query["created_at"] = `${formattedStartDate}to${formattedEndDate}`;
      }
    }

    if (query["staged_status"]) {
      query["status"] = query["staged_status"];
      delete query["staged_status"];
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
        }),

      { shallow: true }
    );
  };

  function onSelectChange(selectedRowIds: React.Key[]) {
    setSelectedRowKeys(selectedRowIds);
  }

  const onDateChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setStartDate(new Date(dateString[0]).getTime());
    setEndDate(new Date(dateString[1]).getTime());
  };

  const handleDelete = async () => {
    try {
      message.config({ maxCount: 1 });
      message.loading("დაელოდეთ...");
      const response = await fetch(
        `${process.env.API_URL}/orders/delete-batch/`,
        {
          method: "DELETE",
          body: JSON.stringify({ ids: selectedRowKeys }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => !selectedRowKeys.includes(order.id))
        );
        setSelectedRowKeys([]);
        message.success("შეკვეთები წარმატებით წაიშალა");
        setIsDelete(false);
      } else {
        message.error("შეკვეთების წაშლა ვერ მოხერხდა");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    })
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setOrders((prev) => {
        const activeIndex = prev.findIndex((i) => i.id === active.id);
        const overIndex = prev.findIndex((i) => i.id === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  return (
    <StyleProvider cache={cache}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          // rowKey array
          items={orders?.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={columns}
            dataSource={orders}
            onChange={onChange}
            footer={() => (
              <div className="bg-white">
                {user?.user_data.user_type != "courier" && (
                  <button
                    type="button"
                    className="rounded flex justify-center items-center bg-white w-full py-2 text-sm font-bold text-gray-600 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setIsAdd(true)}
                  >
                    დამატება <PlusIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}
            scroll={{ y: "65vh", x: 750 }}
            className="custom-scroll"
            components={{
              body: {
                row: Row,
              },
            }}
            sticky={true}
            rowSelection={
              user?.user_data.user_type != "client" ? rowSelection : undefined
            }
            rowKey={"id"}
            summary={(pageData) => {
              let totalPrice = 0;
              let totalCourierFee = 0;
              let count = 0;
              if (selectedRowKeys.length) {
                totalPrice = data.reduce(
                  (acc, current) =>
                    selectedRowKeys.indexOf(current.id) !== -1
                      ? acc + +current.item_price
                      : acc,
                  0
                );
                totalCourierFee = data.reduce(
                  (acc, current) =>
                    selectedRowKeys.indexOf(current.id) !== -1
                      ? acc + +current.courier_fee
                      : acc,
                  0
                );
              } else {
                pageData.forEach(({ item_price, courier_fee }) => {
                  totalPrice += +item_price;
                  totalCourierFee += +courier_fee;
                  count++;
                });
              }

              return (
                <>
                  <Table.Summary.Row className="absolute text-[15px]">
                    <Table.Summary.Cell index={1} className="font-bold">
                      ჯამი
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>ფასი: {totalPrice.toFixed(2)} ₾</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text>საკურიერო: {totalCourierFee.toFixed(2)} ₾</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} className="font-bold">
                      საშუალო
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>
                        ფასი:{" "}
                        {(
                          totalPrice / (selectedRowKeys.length || count)
                        ).toFixed(2)}
                        ₾
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={4}>
                      <Text>
                        საკურიერო:{" "}
                        {(
                          totalCourierFee / (selectedRowKeys.length || count)
                        ).toFixed(2)}{" "}
                        ₾
                      </Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={2} className="font-bold">
                      რაოდენობა
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={3}>
                      <Text>{selectedRowKeys.length || count}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
            pagination={{
              pageSize: 10,
              current: defaultCurrent as number,
              showSizeChanger: false,
            }}
          />
        </SortableContext>
      </DndContext>
      <TableContext.Provider
        value={{ orders, setOrders, user, setIsEdit, couriers, clients }}
      >
        {editInfo && isEdit && (
          <>
            {/* <BlackScreen setIsBlackScreen={setIsEdit} isBlackScreen={isEdit} /> */}

            <Modal
              open={isEdit}
              onOk={() => setIsEdit(false)}
              onCancel={() => setIsEdit(false)}
              footer={null}
              width={900}
            >
              <EditOrder order={editInfo} setIsEdit={setIsEdit} />
            </Modal>
          </>
        )}

        {isAdd && (
          <>
            <Modal
              open={isAdd}
              onOk={() => setIsAdd(false)}
              onCancel={() => setIsAdd(false)}
              width={900}
              footer={null}
            >
              <AddOrder
                user={user}
                setOrders={setOrders}
                orders={orders}
                setIsAdd={setIsAdd}
              />{" "}
            </Modal>
          </>
        )}

        <Modal
          open={isDelete}
          onOk={() => setIsDelete(false)}
          onCancel={() => setIsDelete(false)}
          closeIcon={null}
          footer={null}
          width={300}
          centered
        >
          <DeleteModal setIsDelete={setIsDelete} handleDelete={handleDelete} />
        </Modal>
        <Modal
          open={isCouriers}
          onCancel={() => setIsCouriers(false)}
          footer={null}
          closeIcon={null}
        >
          <Select
            placeholder="აირჩიეთ კურიერი"
            className="w-full"
            dropdownStyle={{ width: "200px" }}
            options={couriers?.map((courier) => ({
              label: courier.name,
              value: courier.id,
            }))}
            onChange={async (value) => {
              message.config({ maxCount: 1 });
              message.loading("დაელოდეთ...");
              try {
                const response = await fetch(
                  `${process.env.API_URL}/orders/assign_courier/`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Token ${user?.token}`,
                    },
                    body: JSON.stringify({
                      courier_id: value,
                      order_ids: selectedRowKeys,
                    }),
                  }
                );

                if (response.ok) {
                  message.success("შეკვეთები წარმატებით მიება კურიერს");
                  setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                      selectedRowKeys.includes(order.id)
                        ? { ...order, courier: value }
                        : order
                    )
                  );
                  setIsCouriers(false);
                  setSelectedRowKeys([]);
                } else {
                  message.error("შეკვეთების მიბმა ვერ მოხერხდა");
                }
              } catch (error) {
                console.error("Error:", error);
              }
            }}
          />
        </Modal>
      </TableContext.Provider>
    </StyleProvider>
  );
};

export default OrderTable;
