import React, { useState } from "react";
import { Form, Input, Select, Button, Modal } from "antd";
import db from "../../firebaseConfig";
import * as firebase from "firebase";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

const StudentForm = () => {
  const { t } = useTranslation();

  const [code, setCode] = useState({
    course: "Course",
    name: "",
    generatedCode: "",
  });
  const [studentFormState, setStudentFormState] = useState({
    course: "Course",
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
      course: "Course",
      itemCode: "",
      studentName: "",
      measurementUnit: "PHP",
      tuition: 0,
      balance: 0,
      balanceLimit: 0,
    });
    setCode({
      course: "Course",
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

  const handleChangeCourse = (e, key) => {
    const firstLetterCourse = e.slice(0, 3).toUpperCase();
    setCode({
      ...code,
      course: firstLetterCourse,
    });

    setStudentFormState({
      ...studentFormState,
      [key]: e,
    });
  };

  const handleChange = (e, key) => {
    const sForStudent = "s";

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
                message: t("student.addBtnModal.pleaseSelectoursey"),
              },
            ]}
          >
            <Select
              defaultValue="spanish"
              value={studentFormState.course}
              style={{ width: 120 }}
              onChange={(e) => handleChangeCourse(e, "course")}
            >
              <Option value="course">
                {t("student.addBtnModal.courseMenu.spanish")}
              </Option>
              
            </Select>
          </Form.Item>

          <Form.Item label={t("student.addBtnModal.tuition")} name="tuition">
            <Input
              min={0}
              type="number"
              id="tuition"
              name="tuition"
              value={studentFormState.tuition}
              onChange={(e) => handleChange(e, "price")}
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
              <Option value="PHP">PHP</Option>
              <Option value="PHP"></Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudentForm;
