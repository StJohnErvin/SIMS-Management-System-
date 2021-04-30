import React, { useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import db from "../../firebaseConfig";
import * as firebase from "firebase";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

const InventoryForm = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState({
    course: "Course",
    name: "",
    generatedCode: "",
  });
  const [studentFormState, setStudentFormState] = useState({
    course: "course",
    itemCode: "",
    studentName: "",
    measurementUnit: "PHP",
    tuition: 0,
    balance: 0,
    balanceLimit: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };
  const handleOk = (e) => {
    setModalVisible(false);
  };

  const handleCancel = (e) => {
    setModalVisible(false);
  };

  const addItem = () => {
    db.collection("student").doc(studentFormState.itemCode).set({
      course: studentFormState.course,
      itemCode: studentFormState.itemCode,
      studentName: studentFormState.studentName,
      measurementUnit: studentFormState.measurementUnit,
      tuition: studentFormState.tuition,
      balance: studentFormState.balance,
      balanceLimit: studentFormState.balanceLimit,
      createdAt: timestamp(),
    });

    handleOk();
    setStudentFormState({
      course: "course",
      itemCode: "",
      studentName: "",
      measurementUnit: "PHP",
      price: 0,
      stock: 0,
      stockLimit: 0,
    });
    setCode({
      course: "course",
    name: "",
    generatedCode: "",}
    );
  };
  console.log(studentFormState);
  const handleChangeName = (e, key) => {
    const threeLetterName = e.target.value.slice(0, 3).toUpperCase();
    setCode({
      ...code,
      name: threeLetterName,
    });
    setStudentFormState({
      ...studentFormState,
      [key]: e.target.value,
    });
  };

  const handleChangeCategory = (e, key) => {
    const firstLetterCategory = e.slice(0, 3).toUpperCase();
    setCode({
      ...code,
      category: firstLetterCategory,
    });

    setStudentFormState({
      ...studentFormState,
      [key]: e,
    });
  };

  const handleChange = (e, key) => {
    const sForStudent = "S";

    setCode({
      ...code,
      generatedCode: sForStudent + code.course + code.name,
    });

    setStudentFormState({
      ...studentFormState,
      itemCode: code.generatedCode,
      [key]: e.target ? e.target.value : e,
    });
  };

  return (
    <div>
      <Button onClick={showModal} className="button" type="primary">
        {t("student.addBtn")}
      </Button>
      <Modal
        destroyOnClose={true}
        title={t("student.addBtnModal.modalTitle")}
        visible={modalVisible}
        //onOk={addItem}
        onCancel={handleCancel}
        footer={[
          <Button danger key="cancel" onClick={handleCancel}>
            {t("student.addBtnModal.cancel")}
          </Button>,
          <Button
            type="primary"
            form="studentForm"
            key="submit"
            htmlType="submit"
          >
            {t("student.addBtnModal.ok")}
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          name="studentForm"
          onFinish={addItem}
          initialValues={{
            remember: true,
          }}
        >
          <Form.Item
            label={t("student.addBtnModal.studentName")}
            name="studentName"
            rules={[
              {
                required: true,
                message: t("student.addBtnModal.pleaseStudentName"),
              },
            ]}
          >
            <Input
              type="text"
              id="studentName"
              name="studentName"
              value={studentFormState.studentName}
              onChange={(e) => handleChangeName(e, "studentName")}
            />
          </Form.Item>

          <Form.Item
            label={t("student.addBtnModal.course")}
            name="course"
            rules={[
              {
                required: false,
                message: t("student.addBtnModal.pleaseSelectCourse"),
              },
            ]}
          >
            <Select
              defaultValue="spanish"
              value={studentFormState.category}
              style={{ width: 120 }}
              onChange={(e) => handleChangeCategory(e, "course")}
            >
              <Option value="spanish">
                {t("student.addBtnModal.courseMenu.spanish")}
              </Option>
              {/* <Option value="yeşillik">
                {t("inventory.addBtnModal.categoryMenu.green")}
              </Option>
              <Option value="hayvansal">
                {t("inventory.addBtnModal.categoryMenu.animal")}
              </Option>
              <Option value="yağ/sos">
                {t("inventory.addBtnModal.categoryMenu.oilSauce")}
              </Option>
              <Option value="baharat">
                {t("inventory.addBtnModal.categoryMenu.spice")}
              </Option>
              <Option value="konserve">
                {t("inventory.addBtnModal.categoryMenu.canned")}
              </Option>
              <Option value="kuru gıda">
                {t("inventory.addBtnModal.categoryMenu.dryFood")}
              </Option>
              <Option value="meyve">
                {t("inventory.addBtnModal.categoryMenu.fruit")}
              </Option> */}
            </Select>
          </Form.Item>

          <Form.Item label={t("student.addBtnModal.tuition")} name="tuition">
            <Input
              min={0}
              type="number"
              id="tuition"
              name="tuition"
              value={studentFormState.tuition}
              onChange={(e) => handleChange(e, "tuition")}
            />
          </Form.Item>

          <Form.Item
            label={t("student.addBtnModal.balance")}
            name="balance"
            rules={[
              {
                required: true,
                message: t("student.addBtnModal.pleaseBalanceAmount"),
              },
            ]}
          >
            <Input
              min={0}
              type="number"
              id="balance"
              name="balance"
              value={studentFormState.balance}
              onChange={(e) => handleChange(e, "balance")}
            />
          </Form.Item>
          <Form.Item
            label={t("student.addBtnModal.balanceWarning")}
            name="balanceLimit"
            rules={[
              {
                required: true,
                message: t("student.addBtnModal.pleaseBalanceLimit"),
              },
            ]}
          >
            <Input
              min={0}
              type="number"
              id="balanceLimit"
              name="balanceLimit"
              value={studentFormState.balanceLimit}
              onChange={(e) => handleChange(e, "balanceLimit")}
            />
          </Form.Item>

          <Form.Item
            label={t("student.addBtnModal.unit")}
            name="measurementUnit"
            rules={[
              {
                required: false,
                message: t("student.addBtnModal.pleaseSelectUnit"),
              },
            ]}
          >
            <Select
              defaultValue="PHP"
              value={studentFormState.measurementUnit}
              style={{ width: 120 }}
              onChange={(e) => handleChange(e, "measurementUnit")}
            >
              <Option value="pcs">PHP</Option>
              <Option value="ml">PHP</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryForm;
