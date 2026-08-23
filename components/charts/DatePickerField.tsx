import { DatePickerFieldProps } from "@/types/dashboard-types";
import React from "react";
import { Field, FieldLabel } from "../ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { formatDateInput, parseDateInput } from "@/utils/utils";

const DatePickerField = ({
  label,
  value,
  displayValue,
  onChange,
  disabled,
}: DatePickerFieldProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Field className="w-36 gap-1">
      <FieldLabel htmlFor={label}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={label}
            className="w-full justify-start font-normal"
          >
            {displayValue}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={parseDateInput(value)}
            defaultMonth={parseDateInput(value)}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (!date) return;
              onChange(formatDateInput(date));
              setOpen(false);
            }}
            disabled={disabled}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePickerField;
