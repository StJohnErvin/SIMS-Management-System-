import React, { useState } from "react";
import { Table, Button, Input, Space, Popconfirm } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useTranslation } from 'react-i18next'
import db from "../../firebaseConfig";

const PaymentTable = ({ payed }) => {

  const {t} = useTranslation();
  const [search, setSearch] = useState({
    searchText: "",
    searchedColumn: "",
  });

  
  let searchInput;

  const cancelOrder = async (id) => {
    const res = await db.collection("payment").doc(id).get()
    const datas = res.data()
    datas.ingredients.forEach(async (paymentItem) => {
      const res = await paymentItem.itemDocRef.get();
      const data = res.data();
      paymentItem.itemDocRef.update({
        balance: data.balance - paymentItem.requiredAmount * -1,
      });
    });
  }


  const deletePayment = (record) => {
    cancelOrder(record.recipeCode);
    db.collection("payment").doc(record.docId).delete();
  }

 
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            {t('payment.searchBox')}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t('payment.reset')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: "" });
  };
  const columns = [
    {
      title: t("payment.tableHeader0"),
      dataIndex: "paymentName",
      key: "paymentName",
      editable: true,
      ...getColumnSearchProps("paymentName"),
    },
    {
      title: t("payment.tableHeader1"),
      key: "date",
      dataIndex: "date" ,
      responsive: ["md"],
      editable: true,
      ...getColumnSearchProps("date"),
    },
    {
      title: t("payment.tableHeader2"),
      key: "action",
      //responsive: ["md"],
      render: (record) => (
        <Space>
          <Popconfirm
            title={t('payment.sureToCancel')}
            okText={t("deleteButton.ok")}
            cancelText={t("deleteButton.cancel")}
            onConfirm={() => deletePayment(record)}
          >
            <Button type="primary" danger>
              {t('payment.cancelBtn')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={payed} />
    </>
  );
};

export default PaymentTable;
