import React, { useEffect, useState } from "react";
import db from "../../firebaseConfig";
import StudentTable from "../../components/StudentTable";
import { Typography, Button, Spin, Drawer } from "antd";
import StudentForm from "../../components/StudentFormPayment";
import "../../containers/Inventory/style.css";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const Receipt = () => {

  const {t} = useTranslation();

  const [loading, setLoading] = useState(true);
  const [studentreceipt, setStudentReceipt] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

 

  useEffect(() => {
    const unsubscribe = db
      .collection("studentreceipt")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const dataArr = [];
        snapshot.forEach((doc) => {
          dataArr.push({ ...doc.data() });
        });
        setStudentReceipt(dataArr);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  return (
    <div>

      <Title level={3}>{t('')}</Title>

      <Button className="button" type="primary" onClick={showDrawer}>
        {t('studentreceipt.addBtn')}
      </Button>

      <Drawer
          destroyOnClose={true}
          title={t('studentreceipt.addDrawer.title')}
          width={window.innerWidth > 576 ? 740 : 350}
          onClose={onClose}
          visible={drawerVisible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <StudentForm setDrawerVisible={setDrawerVisible}/>
          </Drawer>

      {loading ? (
        <div className="spin">
          <Spin size="large" tip={t('studentreceipt.loading')} />{" "}
        </div>
      ) : (
        <StudentTable studentreceipt={studentreceipt} />
      )}
    </div>
  );
};

export default Receipt;
