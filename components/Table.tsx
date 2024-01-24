"use client";

import React, { createContext, useEffect, useState } from "react";
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
import EditOrder, { DeleteModal } from "./EditOrder";
import { ClearOutlined, MenuOutlined } from "@ant-design/icons";
import { UserType } from "@/types/user";
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
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

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

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row = ({ children, ...props }: RowProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
  };

  return (
    <tr {...props} ref={setNodeRef} style={style} {...attributes}>
      {React.Children.map(children, (child) => {
        if ((child as React.ReactElement).key === "sort") {
          return React.cloneElement(child as React.ReactElement, {
            children: (
              <MenuOutlined
                ref={setActivatorNodeRef}
                style={{ touchAction: "none", cursor: "move" }}
                {...listeners}
              />
            ),
          });
        }
        return child;
      })}
    </tr>
  );
};

const OrderTable: React.FC<{
  data: ClientOrderType[];
  filteredData: ClientOrderType[];
  searchParams: any;
  user: UserType | undefined;
}> = ({ data, searchParams, user, filteredData }) => {
  let storedQuery = null;
  let page;
  const { RangePicker } = DatePicker;
  const { Text } = Typography;
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
  const [startDate, setStartDate] = useState<number | undefined>(
    searchParams["created_at"]?.split("to")[0]
  );
  const [endDate, setEndDate] = useState<number | undefined>(
    searchParams["created_at"]?.split("to")[1]
  );

  const [query, setQuery] = useState(
    storedQuery
      ? queryString.parse(storedQuery, { arrayFormat: "comma" })
      : searchParams
  );

  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    let storedQuery = localStorage.getItem("query");

    if (storedQuery) {
      setDefaultCurrent(
        Number(
          queryString.parse(storedQuery, { arrayFormat: "comma" })
            .current as unknown
        )
      );
    }

    if (query["item_price"]?.split("to")[0])
      setMinPrice(query["item_price"]?.split("to")[0]);

    if (query["item_price"]?.split("to")[1])
      setMaxPrice(query["item_price"]?.split("to")[1]);

    if (query["created_at"]?.split("to")[0])
      setStartDate(query["created_at"]?.split("to")[0]);

    if (query["created_at"]?.split("to")[1])
      setEndDate(query["created_at"]?.split("to")[1]);

    if (!searchParams["current"]) {
      router.push("?current=1&pageSize=10");
    }
    page = searchParams["current"];
    if (storedQuery) {
      router.push(`/orders?${storedQuery}`);
      setQuery(queryString.parse(storedQuery, { arrayFormat: "comma" }));
    }

    // setDefaultCurrent(
    //   Number(queryString.parse(localStorage.getItem("query") || "{}").current)
    // );
  }, []);

  const [defaultCurrent, setDefaultCurrent] = useState(1);

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
      title: "ქალაქი",
      dataIndex: "city",
      width: "100px",
      filters: getUniques(data, "city"),

      filterSearch: true,
      filteredValue: searchParams?.city?.split(",") || null,

      defaultFilteredValue: getDefaultFilter(storedQuery, "city"),
    },
    {
      title: "სახელი და გვარი",
      dataIndex: "addressee_full_name",
      width: "140px",
      filters: getUniques(data, "addressee_full_name"),
      filterSearch: true,
      filteredValue: searchParams?.addressee_full_name?.split(",") || null,
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
      filteredValue: searchParams?.address?.split(",") || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "address"),
      width: "140px",
    },
    {
      title: "ტელეფონი",
      dataIndex: "phone_number",
      filters: getUniques(data, "phone_number"),
      filterSearch: true,
      filteredValue: searchParams?.phone_number?.split(",") || null,
      defaultFilteredValue: getDefaultFilter(storedQuery, "phone_number"),
      width: "140px",
    },

    {
      title: "კომენტარი",
      dataIndex: "comment",
      width: "120px",
      filteredValue: searchParams?.comment?.split(",") || null,
      render: (text: string) => <Comment text={text} />,
    },

    {
      title: "სტატუსი",
      dataIndex: "status",
      width: "150px",
      filters: [
        { text: "სტატუსის გარეშე", value: "DF" },
        { text: "ჩაბარებულია", value: "GR" },
        { text: "ჩაბარების პროცესშია", value: "YL" },
        { text: "ვერ ჩაბარდა", value: "RD" },
        { text: "დაბრუნებულია", value: "BK" },
      ],
      filteredValue: searchParams?.status?.split(",") || null,

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
      width: "110px",
      sorter: true,
      sortOrder:
        searchParams?.field === "item_price" ? searchParams?.order : null,
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "item_price"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "item_price"),
      filteredValue: searchParams?.item_price || null,
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
      filteredValue: searchParams?.courier_fee || null,
      width: "150px",
      sortOrder:
        searchParams?.field === "courier_fee" ? searchParams.order : null,
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
      defaultSortOrder:
        storedQuery &&
        queryString.parse(storedQuery, { arrayFormat: "comma" }).field ===
          "created_at"
          ? (queryString.parse(storedQuery, { arrayFormat: "comma" })
              .order as SortOrder)
          : undefined,
      defaultFilteredValue: getDefaultFilter(storedQuery, "created_at"),
      filteredValue: searchParams?.created_at || null,
      width: "120px",

      render: (text: string) => <>{text.split("T")[0].replaceAll("-", "/")}</>,
      filterDropdown: ({ setSelectedKeys, confirm }) => (
        <div className="flex flex-col  p-2">
          <RangePicker format="YYYY-MM-DD" onChange={onDateChange} />

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
            setQuery(searchParams);
            setMinPrice(undefined);
            setMaxPrice(undefined);
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
    columns.splice(2, 1);
    columns.splice(2, 1);
  } else {
    columns.splice(0, 1);
  }
  const rowSelection: TableRowSelection<ClientOrderType> = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: ClientOrderType) => ({
      id: String(record.id),
    }),
    selections:
      user?.user_data.user_type == "admin"
        ? [
            {
              key: "delete",
              text: "მონიშნული შეკვეთების წაშლა",
              onSelect: () => {
                setIsDelete(true);
              },
            },

            {
              key: "send",
              text: "მონიშნული შეკვეთების ადრესატებისთვის მესიჯების გაგზავნა",
              onSelect: () => {
                // edRowKeys);
              },
            },
          ]
        : [
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
    if (user?.user_data.user_type === "client") {
      return;
    }
    try {
      const response = await fetch(`${process.env.API_URL}/orders/${key}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
        body: JSON.stringify({ status: value }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === key ? { ...order, status: value } : order
          )
        );
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
    sorter
  ) => {
    setDefaultCurrent(pagination.current as number);

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

    if (query["created_at"]) {
      if (query["created_at"].length == 2) {
        query["created_at"] = `${new Date(query["created_at"][0])
          .toLocaleDateString()
          .replaceAll("/", "-")}to${new Date(query["created_at"][1])
          .toLocaleDateString()
          .replaceAll("/", "-")}`;
      } else {
        query["created_at"] = `${new Date(query["created_at"][0].split("to")[0])
          .toLocaleDateString()
          .replaceAll("/", "-")}to${new Date(
          query["created_at"][0].split("to")[1]
        )
          .toLocaleDateString()
          .replaceAll("/", "-")}`;
      }
    }

    console.log(query);

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

  const onDateChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    setStartDate(new Date(dateString[0]).getTime());
    setEndDate(new Date(dateString[1]).getTime());
  };

  const handleDelete = async () => {
    try {
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
        setIsDelete(false);
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
  console.log(orders);
  return (
    <StyleProvider cache={cache}>
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          // rowKey array
          items={orders.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            columns={columns}
            dataSource={filteredData}
            onChange={onChange}
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
            pagination={{ pageSize: 10, current: defaultCurrent as number }}
          />
        </SortableContext>
      </DndContext>
      {isEdit && editInfo && (
        <TableContext.Provider value={{ orders, setOrders, user, setIsEdit }}>
          <BlackScreen setIsBlackScreen={setIsEdit} isBlackScreen={isEdit} />

          <EditOrder order={editInfo} />
        </TableContext.Provider>
      )}

      {user?.user_data.user_type != "courier" && (
        <button
          onClick={() => setIsAdd(true)}
          className="mt-[-50px] flex items-center bg-gray-200 py-1 px-2 rounded-[20px] hover:opacity-70 pointer relative z-5"
        >
          დამატება
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
      {isAdd && (
        <>
          <AddOrder
            user={user}
            setOrders={setOrders}
            orders={orders}
            setIsAdd={setIsAdd}
          />{" "}
          <BlackScreen isBlackScreen={isAdd} setIsBlackScreen={setIsAdd} />
        </>
      )}
      {isDelete && (
        <>
          <DeleteModal setIsDelete={setIsDelete} handleDelete={handleDelete} />
          <BlackScreen isBlackScreen={isAdd} setIsBlackScreen={setIsDelete} />
        </>
      )}
    </StyleProvider>
  );
};

export default OrderTable;
