"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "./local-ui/input";
import { useFormState } from "react-dom";
import { SubmitBtn } from "./local-ui/SubmitBtn";
import { useReducer } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Image from "next/image";
import visaIcon from "@/public/icons/visa.svg";
import masterCardIcon from "@/public/icons/mastercard.svg";
import paypalIcon from "@/public/icons/paypal.svg";
import { Button } from "./ui/button";
export default function PaymentForm({ serverAction = () => {} }) {
  const [state, dispatch] = useFormState(serverAction, undefined);
  const paymentMethods = [
    { icon: visaIcon, label: "Visa", value: "visa" },
    { icon: masterCardIcon, label: "Master Card", value: "master card" },
    { icon: paypalIcon, label: "Paypal", value: "paypal" },
  ];
  const defaultPaymentForm = (
    <div className="flex h-[300px] items-center justify-center font-bold">
      Choose a payment Method
    </div>
  );
  const [reducerState, dispatchReducer] = useReducer(
    handlePaymentReducer,
    defaultPaymentForm,
  );

  function handlePaymentReducer(prevState, action) {
    switch (action.type) {
      case "visa":
        return <InputFields />;
      case "master card":
        return <InputFields />;
      case "paypal":
        return (
          <div className="mx-auto">
            <Button type="button" size="sm">
              Pay with Paypal
            </Button>
          </div>
        );
      default:
        return defaultPaymentForm;
    }
  }
  return (
    <form id="payment-form" action={dispatch} className="flex flex-col gap-6">
      <RadioGroup
        onValueChange={(v) => dispatchReducer({ type: v })}
        defaultValue="default"
        name="paymentMethod"
        form="payment-form"
        className="grid cursor-pointer grid-cols-1 flex-wrap xsm:grid-cols-2 sm:grid-cols-3"
      >
        {paymentMethods.map((method) => {
          return (
            <Label
              key={method.value}
              htmlFor={method.value}
              className="flex grow cursor-pointer items-center justify-between gap-[32px] rounded-[12px] border-2 border-primary p-[16px] has-[[data-state='checked']]:bg-primary"
            >
              <div className="flex items-center gap-3">
                <Image
                  width={24}
                  height={16}
                  src={method.icon}
                  alt={method.icon + "_icon"}
                />
                <p className="text-[0.875rem]">{method.value}</p>
              </div>
              <RadioGroupItem
                className="border-2 data-[state='checked']:border-white data-[state='checked']:text-white"
                value={method.value}
                id={method.value}
              />
            </Label>
          );
        })}
      </RadioGroup>
      {reducerState}
    </form>
  );
}

function InputFields() {
  return (
    <>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Input
          name="cardNumber"
          placeholder="Card Number"
          label="Card Number"
        />
        <Input name="exp" placeholder="mm/yy" label="Expire on" />
        <Input name="cvc" placeholder="CVV" label="CVV" />
        <Input
          name="cardholderName"
          placeholder="Cardholder Name"
          label="Cardholder Name"
        />
      </div>
      <div>
        <Checkbox
          id={"securlySave"}
          name={"shouldSave"}
          label={"Securely save my information for 1-click checkout"}
        />
      </div>
      <SubmitBtn
        formId={"payment-form"}
        customTitle={{ default: "Pay now", onSubmitting: "Paying..." }}
      />
    </>
  );
}
