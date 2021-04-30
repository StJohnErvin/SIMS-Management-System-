import React, { useEffect, useState } from "react";
import SelectPayment from "../../components/SelectPayment/SelectPayment";
import PaymentTable from "../../components/PaymentTable";
import { Button, Input, Typography, Spin, notification, Space } from "antd";
import "./style.css";
import db from "../../firebaseConfig";
import { useTranslation } from 'react-i18next';
import * as firebase from "firebase";

const timestamp = firebase.firestore.FieldValue.serverTimestamp;
const date = new Date();

const { Title } = Typography;

const Payment = () => {

  const {t} = useTranslation();

  const [payments, setPayments] = useState([])
  const [paymentMultiplier, setPaymentMultiplier] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState("")
  const [payed, setPayed] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    const res = await db.collection("student").get();
    const data = res.docs.map((doc) => doc.data());
    setPayments(data);
  };

 
  const showNotification = (type, content, title) => {
    notification[type]({
      message: title,
      description:
        typeof content === "object" ? content.join(", ") : content
    });
  };

  
  const addPayment = async () => {
    if (payments.length > 0) {
      let isSufficient = true;
      const insufficientIngredients = [];
      const ingredientsArr = payments.find(
        (payment) => payment.recipeCode === selectedPayment
      ).ingredients;
      for (let i = 0; i < ingredientsArr.length; i++) {
        const paymentItem = ingredientsArr[i];
        const res = await paymentItem.itemDocRef.get();
        const data = res.data();
       
        if (data.stock - paymentItem.requiredAmount * paymentMultiplier < 0) {
          isSufficient = false;
          insufficientIngredients.push(data.itemName)
        }
      }

      if (isSufficient) {
        ingredientsArr.forEach(async (paymentItem) => {
          const res = await paymentItem.itemDocRef.get();
          const data = res.data();
          paymentItem.itemDocRef.update({
            balance: data.stock - paymentItem.requiredAmount * paymentMultiplier,
          });
        });
        for (let i = 0; i < paymentMultiplier; i++) {
          db.collection("payment").add({
            createdAt: timestamp(),
            recipeCode: selectedPayment,
            paymentName: payments.find((x) => x.recipeCode === selectedPayment)
              .paymentName,
          });
        }
        showNotification("success", t('payment.successNotification'), t('payment.successNotification2'));
      } else {
        showNotification("error", insufficientIngredients, t('payment.errorNotification'));
      }
    }
  };

  function onChange(value) {
    setSelectedPayment(value);
  }
  useEffect(() => {
    fetchPayments();

    const unsubscribe = db
      .collection("payment")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const dataArr = [];
        snapshot.forEach((doc) => {
          dataArr.push({ ...doc.data(), docId : doc.id , date : doc.data().createdAt && `${doc.data().createdAt.toDate().getDate()}/${doc.data().createdAt.toDate().getMonth() + 1}/${doc.data().createdAt.toDate().getFullYear()}`});
        });
        const filteredArr = dataArr.filter(x => x.createdAt && x.createdAt.toDate().getMonth() === date.getMonth())
        setPayed(filteredArr);
        setLoading(false);
      });

    return unsubscribe;
  }, []);
  return (
    <div>
      <Title level={3}>{t('payment.payments')}</Title>
      <div className="orderInputs" /* style={{ display: "flex", justifyContent: "center" }} */>
        <Space>
          <SelectPayment onChange={onChange} payments={payments} />
          <Input
            style={{ width: "200px" }}
            type="number"
            onChange={(e) => setPaymentMultiplier(e.target.value)}
            value={paymentMultiplier}
            placeholder="number of payments"
            min={1}
          />
          <Button
            disabled={selectedPayment ? false : true}
            onClick={addPayment}
            type="primary"
          >
            {t('payment.addPayment')}
          </Button>
        </Space>
      </div>
      {loading ? (
        <div className="spin">
          <Spin size="large" tip={t('payment.loading')} />
        </div>
      ) : (
        <div style={{ marginTop: "1em" }}>
          <PaymentTable orderedFood={payed} />
        </div>
      )}
    </div>
  );
};

export default Payment;
