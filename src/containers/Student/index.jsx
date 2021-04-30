// import React, { useEffect, useState } from "react";
// import db from "../../firebaseConfig";
// import StudentTable from "../../components/StudentTable";
// import { Typography, Spin } from "antd";
// import "../../containers/Inventory/style.css";
// import StudentForm from "../../components/StudentForm";
// import { useTranslation } from 'react-i18next';

// const { Title } = Typography;

// const Student = () => {

//   const {t}  = useTranslation();
//   const [loading, setLoading] = useState(true);
//   const [item, setItem] = useState([]);

//   useEffect(() => {
//     const unsubscribe = db
//       .collection("student")
//       .orderBy("createdAt", "desc")
//       .onSnapshot((snapshot) => {
//         const dataArr = [];
//         snapshot.forEach((doc) => {
//           dataArr.push({ ...doc.data() });
//         });
//         setItem(dataArr);
//         setLoading(false);
//       });

//     return unsubscribe;
//   }, []);

//   return (
//     <div>
//       <Title level={3}>{t('student.student')}</Title>
//       <StudentForm />
//       {loading ? (
//         <div className="spin">
//           <Spin size="large" tip={t('student.loading')} />
//         </div>
//       ) : (
//         <StudentTable item={item} />
//       )}
//     </div>
//   );
// };

// export default Student;

import React, { useEffect, useState } from "react";
import db from "../../firebaseConfig";
import StudentTable from "../../components/StudentTable";
import { Typography, Spin } from "antd";
import "../../containers/Inventory/style.css";
import StudentForm from "../../components/StudentForm";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const Inventory = () => {

  const {t}  = useTranslation();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("student")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const dataArr = [];
        snapshot.forEach((doc) => {
          dataArr.push({ ...doc.data() });
        });
        setItem(dataArr);
        setLoading(false);
      });

    return unsubscribe;
  }, []);

  return (
    <div>
      <Title level={3}>{t('student.student')}</Title>
      <StudentForm />
      {loading ? (
        <div className="spin">
          <Spin size="large" tip={t('student.loading')} />
        </div>
      ) : (
        <StudentTable item={item} />
      )}
    </div>
  );
};

export default Inventory;

