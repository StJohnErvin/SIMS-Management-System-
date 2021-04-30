import React, { useState } from "react";
import { Table, Button, Input, Space, Popconfirm, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import db from "../../firebaseConfig";
import EditInventoryForm from "../EditInventoryForm";
import { useTranslation } from 'react-i18next';

const StudentTable = ({ item }) => {
  const {t} = useTranslation();
  
  const [search, setSearch] = useState({
    searchText: "",
    searchedColumn: "",
  });
  const [modalVisible, setModalVisible] = useState(false);

  const [editInventoryFormState, setEditInventoryFormState] = useState({
    measurementUnit: "Php",
    tuition: 0,
    balance: 0,
  });

  const [keyCode, setKeyCode] = useState("");

  let searchInput;

  const deleteItem = (key) => {
    db.collection("student")
      .doc(key)
      .delete()
  };

  const showModal = (key) => {
    setModalVisible(true);
    setKeyCode(key);
  };

  const handleOk = (e) => {
    setModalVisible(false);
  };

  const handleCancel = (e) => {
    setModalVisible(false);
  };

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
            {t('student.studentTable.searchBox')}
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            {t('student.studentTable.reset')}
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
      title: t('student.studentTable.name'),
      dataIndex: "studentName",
      key: "studentName",
      editable: true,
      ...getColumnSearchProps("studentName"),
    },
    {
      title: t('student.studentTable.code'),
      dataIndex: "itemCode",
      key: "itemCode",
      ...getColumnSearchProps("itemCode"),
    },
    {
      title: t('student.studentTable.course'),
      dataIndex: "course",
      key: "course",
      responsive: ["md"],
      editable: true,
      ...getColumnSearchProps("course"),
    },
    {
      title: t('student.studentTable.unit'),
      key: "measurementUnit",
      dataIndex: "measurementUnit",
      responsive: ["md"],
      editable: true,
      filters: [
        {
          text: "PHP",
          value: "PHP",
        },
        {
          text: "",
          value: "",
        },
      ],
      onFilter: (value, record) => record.measurementUnit.indexOf(value) === 0,
    },
    {
      title: t('student.studentTable.tuition'),
      key: "tuition",
      dataIndex: "tuition",
      responsive: ["md"],
      editable: true,
      sorter: (a, b) => a.tuition - b.tuition,
    },
    {
      title: t('student.studentTable.balance'),
      key: "balance",
      dataIndex: "balance",
      editable: true,
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: t('student.studentTable.action'),
      key: "action",
      responsive: ["md"],
      render: (record) => (
        <Space>
          <Button onClick={() => showModal(record.itemCode)} type="primary">{t('inventory.inventoryTable.actionBtns.edit')}</Button>
          <Popconfirm title={t('student.studentTable.sureToDelete')} 
          okText={t("deleteButton.ok")}
          cancelText={t("deleteButton.cancel")}
          onConfirm={()=> deleteItem(record.itemCode)}>
          <Button  type="primary" danger>
            {t('student.studentTable.actionBtns.delete')}
          </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table 
      locale={{triggerAsc: t("student.studentTable.triggerAsc"),
      filterConfirm: t("student.studentTable.ok"),
      filterReset: t("student.studentTable.reset"),
      triggerDesc: t("student.studentTable.triggerDesc"),
      cancelSort: t("student.studentTable.cancelSort") }} 
      columns={columns} 
      dataSource={item} />
      <Modal
        destroyOnClose
        title={t('student.editModal.editItemInfo')}
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button danger key="cancel" onClick={handleCancel}>
          {t("student.addBtnModal.cancel")}
        </Button>,
          <Button  type="primary"  form="editStudentForm"  key="submit" htmlType="submit">
            {t("student.addBtnModal.ok")}
          </Button>,
        ]}
      >
        <EditInventoryForm
          editInventoryFormState={editInventoryFormState}
          setEditInventoryFormState={setEditInventoryFormState}
          keyCode={keyCode}
          handleOk={handleOk}
        />
      </Modal>
    </>
  );
};

export default StudentTable;
