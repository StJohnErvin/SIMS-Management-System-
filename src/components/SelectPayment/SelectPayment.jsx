import React from "react";
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';

const { Option } = Select;

const SelectPayment = (props) => {
  const { onChange, onFocus, onBlur, onSearch, payment } = props
  const {t} = useTranslation();

  return (
    <div>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder={t('payment.selectPayment')}
        optionFilterProp="children"
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onSearch={onSearch}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {payment.map((payment) => (
          <Option value={payment.receiptName}>{payment.receiptName}</Option>
        ))}
      </Select>
    </div>
  );
};

export default SelectPayment;
