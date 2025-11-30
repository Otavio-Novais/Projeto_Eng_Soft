import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';
import './CustomDatePicker.css';

// Register Portuguese locale
registerLocale('pt-BR', ptBR);

const CustomDatePicker = ({
    selected,
    onChange,
    placeholder = "Selecione uma data",
    className = "",
    dateFormat = "dd/MM/yyyy"
}) => {
    return (
        <div className={`custom-datepicker-wrapper ${className}`}>
            <DatePicker
                selected={selected}
                onChange={onChange}
                dateFormat={dateFormat}
                locale="pt-BR"
                placeholderText={placeholder}
                className="custom-datepicker-input"
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                autoComplete="off"
                // Enable typing
                onChangeRaw={(e) => {
                    // Optional: Add custom raw input handling if needed
                }}
            />
        </div>
    );
};

export default CustomDatePicker;
